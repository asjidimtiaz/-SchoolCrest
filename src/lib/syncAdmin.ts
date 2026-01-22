import { currentUser, auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from './supabaseAdmin'

/**
 * Syncs the current Clerk user with the Supabase 'admins' table.
 * If the user exists only by email (pre-invited), it updates the record with their Clerk ID.
 */
export async function syncAdminIdentity() {
  // 1. First attempt: Quick check using auth() (No Secret Key API call needed)
  try {
    const { userId } = await auth()
    if (userId) {
      const { data: existingProfile } = await supabaseAdmin
        .from('admins')
        .select('id, role, school_id')
        .eq('id', userId)
        .maybeSingle()

      if (existingProfile) return existingProfile
    }
  } catch (e) {
    console.warn('[syncAdminIdentity] Quick auth check failed:', e)
  }

  // 2. Second attempt: Full sync using currentUser() (Requires valid Secret Key)
  const user = await currentUser()
  if (!user) return null

  const email = user.emailAddresses[0]?.emailAddress
  if (!email) return null

  // 1. Check if we already have the profile by Clerk ID
  const { data: profileById } = await supabaseAdmin
    .from('admins')
    .select('id, role, school_id')
    .eq('id', user.id)
    .maybeSingle()

  if (profileById) return profileById

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
      console.error('[syncAdminIdentity] Failed to remove temp record:', deleteError.message)
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
      console.error('[syncAdminIdentity] Failed to insert synced record:', insertError.message)
      return null
    }

    console.log(`[syncAdminIdentity] Synced Clerk user ${user.id} with email ${email}`)
    return syncedProfile
  }

  return null
}
