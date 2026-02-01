'use server'

import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { revalidatePath } from 'next/cache'

export async function toggleAdminStatus(adminId: string, newStatus: boolean) {
  try {
    const { error } = await supabaseAdmin
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


export async function reassignAdminToSchool(adminId: string, newSchoolId: string | null) {
  try {
    const { error } = await supabaseAdmin
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
    // Delete from admins table
    const { error: adminError } = await supabaseAdmin
      .from('admins')
      .delete()
      .eq('id', adminId)

    if (adminError) {
      console.error("Error deleting admin record:", adminError.message)
      return { error: adminError.message }
    }

    // Note: We don't delete from Clerk automatically here 
    // to avoid accidental data loss across shared accounts,
    // but the user will lose authorization immediately.

    revalidatePath('/admin/super/admins')
    return { success: true }
  } catch (err) {
    console.error("FATAL in deleteAdmin:", err)
    return { error: "Failed to delete admin" }
  }
}
