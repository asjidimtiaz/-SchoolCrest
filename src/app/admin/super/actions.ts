'use server'

import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createSchool(prevState: any, formData: FormData) {
  try {
    const name = formData.get('name') as string
    const slug = formData.get('slug') as string
    const is_demo = formData.get('is_demo') === 'true'

    if (!name || !slug) {
      return { error: "Name and slug are required" }
    }

    const { data: school, error } = await supabaseAdmin.from('schools').insert({
      name,
      slug,
      is_demo,
      active: true,
      primary_color: '#000000',
      secondary_color: '#ffffff',
      accent_color: '#3b82f6'
    }).select().single()

    if (error) {
      console.error("Error in createSchool:", error.message)
      return { error: error.message }
    }

    revalidatePath('/admin/super')
    return { success: true, schoolId: school.id }
  } catch (err) {
    console.error("FATAL in createSchool:", err)
    return { error: "An unexpected error occurred while creating the school." }
  }
}

export async function assignAdmin(schoolId: string, userId: string) {
  try {
    const { error } = await supabaseAdmin.from('admins').upsert({
      id: userId,
      school_id: schoolId,
      role: 'school_admin'
    })

    if (error) {
      console.error("Error in assignAdmin:", error.message)
      return { error: error.message }
    }
    
    revalidatePath('/admin/super')
    return { success: true }
  } catch (err) {
    console.error("FATAL in assignAdmin:", err)
    return { error: "An unexpected error occurred while assigning the admin." }
  }
}

export async function toggleSchoolStatus(schoolId: string, newStatus: boolean) {
  try {
    const { error } = await supabaseAdmin.from('schools')
      .update({ active: newStatus, last_updated: new Date().toISOString() })
      .eq('id', schoolId)

    if (error) {
      console.error("Error in toggleSchoolStatus:", error.message)
      return { error: error.message }
    }
    
    revalidatePath('/admin/super')
    revalidatePath(`/admin/super/schools/${schoolId}`)
    return { success: true }
  } catch (err) {
    console.error("FATAL in toggleSchoolStatus:", err)
    return { error: "An unexpected error occurred while toggling school status." }
  }
}
export async function toggleSchoolDemo(schoolId: string, isDemo: boolean) {
  try {
    const { error } = await supabaseAdmin.from('schools')
      .update({ is_demo: isDemo })
      .eq('id', schoolId)

    if (error) {
      console.error("Error in toggleSchoolDemo:", error.message)
      return { error: error.message }
    }
    
    revalidatePath('/admin/super')
    revalidatePath(`/admin/super/schools/${schoolId}`)
    return { success: true }
  } catch (err) {
    console.error("FATAL in toggleSchoolDemo:", err)
    return { error: "An unexpected error occurred while toggling demo status." }
  }
}

export async function deleteSchool(schoolId: string) {
  try {
    // 1. Delete dependent data first (Manual Cascade)
    
    // Admins
    await supabaseAdmin.from('admins').delete().eq('school_id', schoolId)

    // Screensaver Images
    await supabaseAdmin.from('screensaver_images').delete().eq('school_id', schoolId)

    // Calendar Events
    await supabaseAdmin.from('events').delete().eq('school_id', schoolId)

    // Hall of Fame
    await supabaseAdmin.from('hall_of_fame').delete().eq('school_id', schoolId)

    // Teams & Seasons (More complex due to relationship)
    // First get all teams to delete their seasons
    const { data: teams } = await supabaseAdmin.from('teams').select('id').eq('school_id', schoolId)
    if (teams && teams.length > 0) {
        const teamIds = teams.map(t => t.id)
        // Delete all seasons for these teams
        await supabaseAdmin.from('team_seasons').delete().in('team_id', teamIds)
        // Delete the teams themselves
        await supabaseAdmin.from('teams').delete().eq('school_id', schoolId)
    }

    // 2. Finally, delete the school
    const { error } = await supabaseAdmin.from('schools').delete().eq('id', schoolId)

    if (error) {
      console.error("Error in deleteSchool:", error.message)
      return { error: error.message }
    }
    
    revalidatePath('/admin/super')
    redirect('/admin/super')
  } catch (err: any) {
    if (err.message === 'NEXT_REDIRECT') throw err
    console.error("FATAL in deleteSchool:", err)
    return { error: "An unexpected error occurred while deleting the school." }
  }
}

