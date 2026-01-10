'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
}

export async function toggleAdminStatus(adminId: string, newStatus: boolean) {
  try {
    const supabase = getSupabaseAdmin()
    
    const { error } = await supabase
      .from('admins')
      .update({ active: newStatus })
      .eq('id', adminId)

    if (error) {
      console.error("Error toggling admin status:", error.message)
      return { error: error.message }
    }

    revalidatePath('/admin/super/admins')
    return { success: true }
  } catch (err) {
    console.error("FATAL in toggleAdminStatus:", err)
    return { error: "Failed to update admin status" }
  }
}

export async function changeAdminRole(adminId: string, newRole: string) {
  try {
    const supabase = getSupabaseAdmin()
    
    const { error } = await supabase
      .from('admins')
      .update({ role: newRole })
      .eq('id', adminId)

    if (error) {
      console.error("Error changing admin role:", error.message)
      return { error: error.message }
    }

    revalidatePath('/admin/super/admins')
    return { success: true }
  } catch (err) {
    console.error("FATAL in changeAdminRole:", err)
    return { error: "Failed to change admin role" }
  }
}

export async function reassignAdminToSchool(adminId: string, newSchoolId: string | null) {
  try {
    const supabase = getSupabaseAdmin()
    
    const { error } = await supabase
      .from('admins')
      .update({ school_id: newSchoolId })
      .eq('id', adminId)

    if (error) {
      console.error("Error reassigning admin:", error.message)
      return { error: error.message }
    }

    revalidatePath('/admin/super/admins')
    return { success: true }
  } catch (err) {
    console.error("FATAL in reassignAdminToSchool:", err)
    return { error: "Failed to reassign admin" }
  }
}

export async function deleteAdmin(adminId: string) {
  try {
    const supabase = getSupabaseAdmin()
    
    // Delete from admins table
    const { error: adminError } = await supabase
      .from('admins')
      .delete()
      .eq('id', adminId)

    if (adminError) {
      console.error("Error deleting admin record:", adminError.message)
      return { error: adminError.message }
    }

    // Delete from auth
    const { error: authError } = await supabase.auth.admin.deleteUser(adminId)

    if (authError) {
      console.error("Error deleting auth user:", authError.message)
      // Don't fail completely - admin record is already deleted
    }

    revalidatePath('/admin/super/admins')
    return { success: true }
  } catch (err) {
    console.error("FATAL in deleteAdmin:", err)
    return { error: "Failed to delete admin" }
  }
}
