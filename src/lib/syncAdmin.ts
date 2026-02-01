import { currentUser, auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from './supabaseAdmin'

/**
 * Syncs the current Clerk user with the Supabase 'admins' table.
 * If the user exists only by email (pre-invited), it updates the record with their Clerk ID.
 */
export async function syncAdminIdentity() {
  // 1. First attempt: Quick check using auth() (No Secret Key API call needed)
  // 1. First attempt: Quick check using auth() (No Secret Key API call needed)
  try {
    const { userId } = await auth()
    if (userId) {
      const { data: existingProfile } = await supabaseAdmin
        .from('admins')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (existingProfile) {
        // If profile exists but is missing name/avatar (legacy schema), try to update it?
        // We can't easily get Clerk details here without `currentUser()`, so we'll skip the quick check
        // if important fields are missing, and let it fall through to the full sync below.
        if (existingProfile.full_name && existingProfile.avatar_url) {
          return existingProfile
        }
        // Fall through to full sync to get Clerk data
      }
    }
  } catch (e) {
    // Fail silently in quick check
  }

  // 2. Second attempt: Full sync using currentUser() (Requires valid Secret Key)
  const user = await currentUser()
  if (!user) return null

  const email = user.emailAddresses[0]?.emailAddress
  if (!email) return null

  // 1. Check if we already have the profile by Clerk ID
  // 1. Check if we already have the profile by Clerk ID
  const { data: profileById } = await supabaseAdmin
    .from('admins')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (profileById) {
    // Only backfill if fields are actually NULL/missing (not just different from Clerk)
    // This prevents overwriting user's manual profile edits
    const needsUpdate =
      profileById.full_name === null ||
      profileById.avatar_url === null ||
      profileById.email === null;

    if (needsUpdate) {
      const updateData: any = {}

      // Only update fields that are actually NULL
      if (profileById.email === null) {
        updateData.email = email
      }
      if (profileById.full_name === null) {
        updateData.full_name = `${user.firstName || ''} ${user.lastName || ''}`.trim()
      }
      if (profileById.avatar_url === null) {
        updateData.avatar_url = user.imageUrl
      }

      const { data: updated, error: updateErr } = await supabaseAdmin
        .from('admins')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single();

      if (!updateErr && updated) return updated;
    }

    return profileById
  }

  // 2. If not found by ID, check if they were pre-invited by email
  const { data: profileByEmail } = await supabaseAdmin
    .from('admins')
    .select('*')
    .eq('email', email)
    .maybeSingle()

  if (profileByEmail) {
    // Switch the ID from the temporary one (likely the email) to the actual Clerk ID
    // We do this by deleting the temp record and inserting the new one if ID is different,
    // or just updating if the column allows (but primary keys usually don't like changes).

    // Safety: If ID is already the userId, no need to do anything (handled above)
    if (profileByEmail.id === user.id) return profileByEmail

    // Perform an atomic-ish exchange (delete temp, insert real)
    // Note: This assumes any school_id or role is preserved
    const { error: deleteError } = await supabaseAdmin
      .from('admins')
      .delete()
      .eq('id', profileByEmail.id)

    if (deleteError) {
      // Log only critical errors in production if needed, or keep generic
    }

    const { data: syncedProfile, error: insertError } = await supabaseAdmin
      .from('admins')
      .insert({
        id: user.id,
        email: email,
        full_name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        avatar_url: user.imageUrl,
        role: profileByEmail.role,
        school_id: profileByEmail.school_id,
        active: profileByEmail.active ?? true
      })
      .select()
      .single()

    if (insertError) {
      return null
    }

    return syncedProfile
  }

  return null
}
