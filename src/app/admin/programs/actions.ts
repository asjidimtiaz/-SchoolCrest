"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseAdmin";



export async function deleteProgram(id: string) {
  try {
    if (!id || id === 'null' || id === 'undefined') {
      return { error: 'Invalid ID provided for deletion.' };
    }

    // 1. Delete associated seasons first (to avoid foreign key constraint issues)
    const { error: seasonError } = await supabaseAdmin
      .from("team_seasons")
      .delete()
      .eq("team_id", id);

    if (seasonError) {
      console.error("Error deleting associated seasons:", seasonError.message);
      return { error: `Failed to delete program seasons: ${seasonError.message}` };
    }

    // 2. Delete the program itself
    const { error } = await supabaseAdmin.from("teams").delete().eq("id", id);
    if (error) {
      console.error("Error in deleteProgram:", error.message);
      return { error: error.message };
    }

    revalidatePath("/admin/programs");
    return { success: true };
  } catch (err: any) {
    console.error("FATAL in deleteProgram:", err);
    return { error: "Connection error: " + (err?.message || "fetch failed") };
  }
}

export async function createProgram(prevState: any, formData: FormData) {
  try {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!serviceKey) {
      console.error('[CRITICAL] SUPABASE_SERVICE_ROLE_KEY is MISSING!');
    }

    const name = formData.get("name") as string;
    const gender = formData.get("gender") as string;
    const sport_category = (formData.get("sport_category") as string) || 'Athletics';
    const head_coach = (formData.get("head_coach") as string) || '';
    const school_id = formData.get("school_id") as string;
    const media_type = formData.get("media_type") as string || 'image';

    const season_year = parseInt(formData.get("season_year") as string || new Date().getFullYear().toString());
    const isState = formData.get("wc_state") === 'on';
    const isRegion = formData.get("wc_region") === 'on';
    const individual_accomplishments = formData.get("individual_accomplishments") as string || '';

    let photo_url = formData.get("existing_photo_url") as string || '';
    let background_url = formData.get("existing_background_url") as string || '';

    const rosterRaw = formData.get("roster") as string;
    let initialRoster = [];
    try {
      if (rosterRaw) initialRoster = JSON.parse(rosterRaw);
    } catch (e) {
      console.warn("Failed to parse initial roster:", e);
    }

    const recordsRaw = formData.get("records") as string;
    let records = [];
    try {
      if (recordsRaw) records = JSON.parse(recordsRaw);
    } catch (e) {
      console.warn("Failed to parse records:", e);
    }

    let programId = '';
    let programName = name;

    const { data: existingProgram } = await supabaseAdmin
      .from("teams")
      .select("id, name")
      .eq("school_id", school_id)
      .eq("name", name)
      .eq("gender", gender)
      .maybeSingle();

    if (existingProgram) {
      return { error: `A program named "${name}" (${gender}) already exists. Please use a unique name or manage the existing program from the dashboard.` };
    } else {
      const { data: newProgram, error: createError } = await supabaseAdmin.from("teams").insert({
        name,
        gender,
        sport_category,
        head_coach,
        photo_url,
        background_url,
        media_type,
        school_id,
        records,
      }).select().single();

      if (createError) {
        console.error("Error creating program:", createError.message);
        return { error: createError.message };
      }

      programId = newProgram?.id;
      programName = newProgram?.name;
    }

    const create_season = formData.get("create_season") === 'on';

    let seasonData = null;

    if (create_season) {
      const achievements: string[] = [];
      if (isState) achievements.push("State Champions");
      if (isRegion) achievements.push("Region Champions");

      const season_photo_url = formData.get("season_photo_url") as string || '';

      const { data: newSeason, error: seasonError } = await supabaseAdmin.from("team_seasons").insert({
        team_id: programId,
        year: season_year,
        record: '',
        coach: head_coach,
        achievements: achievements,
        individual_accomplishments: individual_accomplishments,
        summary: formData.get("summary") as string || '',
        roster: initialRoster,
        photo_url: season_photo_url
      }).select().single();

      if (seasonError) {
        console.warn("Failed to create season:", seasonError.message);
        return { error: "Failed to create season: " + seasonError.message };
      }
      seasonData = newSeason;
    }

    revalidatePath("/admin/programs");
    return {
      success: true,
      programId: programId,
      programName: programName,
      seasonId: seasonData?.id,
      seasonYear: seasonData?.year
    };
  } catch (err: any) {
    console.error("FATAL in createProgram:", err);
    return { error: "Failed to create program. Please check your connection." };
  }
}

export async function updateProgram(prevState: any, formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const gender = formData.get("gender") as string;
    const sport_category = formData.get("sport_category") as string;
    const head_coach = formData.get("head_coach") as string;
    const media_type = formData.get("media_type") as string || 'image';

    const photo_url = formData.get("existing_photo_url") as string || '';
    const background_url = formData.get("existing_background_url") as string || '';

    const recordsRaw = formData.get("records") as string;
    let records = [];
    try {
      if (recordsRaw) records = JSON.parse(recordsRaw);
    } catch (e) {
      console.warn("Failed to parse records:", e);
    }

    const updates: any = {
      name,
      gender,
      sport_category,
      head_coach,
      media_type,
      records
    };

    if (photo_url) updates.photo_url = photo_url;
    if (background_url) updates.background_url = background_url;

    const { error } = await supabaseAdmin
      .from("teams")
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error("Error in updateProgram:", error.message);
      return { error: error.message };
    }
    revalidatePath("/admin/programs");
    return { success: true };
  } catch (err) {
    console.error("FATAL in updateProgram:", err);
    return { error: "An unexpected error occurred while updating the program." };
  }
}

// Season Actions
export async function deleteSeason(id: string, programId: string) {
  try {
    const { error } = await supabaseAdmin.from("team_seasons").delete().eq("id", id);
    if (error) {
      console.error("Error in deleteSeason:", error.message);
      return { error: error.message };
    }

    if (programId && programId !== 'null' && programId !== 'undefined') {
      revalidatePath(`/admin/programs/${programId}`);
    } else {
      revalidatePath('/admin/programs');
    }

    return { success: true };
  } catch (err) {
    console.error("FATAL in deleteSeason:", err);
    return { error: "An unexpected error occurred while deleting the season." };
  }
}

export async function upsertSeason(prevState: any, formData: FormData) {
  try {
    const id = formData.get("id") as string | null;
    const program_id = formData.get("program_id") as string || formData.get("team_id") as string;
    const year = parseInt(formData.get("year") as string);
    const coach = formData.get("coach") as string;
    const record = formData.get("record") as string;
    const achievementsRaw = formData.get("achievements") as string || '';
    let achievements: string[] = [];
    try {
      // Try parsing as JSON first (new format)
      if (achievementsRaw.startsWith('[')) {
        achievements = JSON.parse(achievementsRaw);
      } else if (achievementsRaw) {
        // Fallback to newline-separated (legacy format)
        achievements = achievementsRaw.split("\n").filter(Boolean);
      }
    } catch (e) {
      console.warn('Failed to parse achievements, using empty array');
    }
    const summary = formData.get("summary") as string || '';

    const rosterRaw = formData.get("roster") as string;
    let roster = rosterRaw;
    try {
      if (rosterRaw && (rosterRaw.startsWith('[') || rosterRaw.startsWith('{'))) {
        roster = JSON.parse(rosterRaw);
      } else if (!rosterRaw) {
        roster = '[]' as any;
      }
    } catch (e) {
      console.warn('Roster is not valid JSON, storing as string/text');
    }

    const photo_url = formData.get("existing_photo_url") as string || '';
    const individual_accomplishments = formData.get("individual_accomplishments") as string || '';

    const payload = {
      team_id: program_id,
      year,
      record,
      coach,
      achievements,
      roster,
      summary,
      photo_url,
      individual_accomplishments,
    };

    let result;
    if (id) {
      result = await supabaseAdmin.from("team_seasons").update(payload).eq("id", id);
    } else {
      result = await supabaseAdmin.from("team_seasons").insert(payload);
    }

    if (result.error) {
      console.error("Error in upsertSeason:", result.error.message);
      return { error: result.error.message };
    }
    revalidatePath(`/admin/programs/${program_id}`);
    return { success: true };
  } catch (err) {
    console.error("FATAL in upsertSeason:", err);
    return { error: "An unexpected error occurred while saving the season." };
  }
}

export async function updateRoster(seasonId: string, programId: string, roster: any) {
  try {
    const { error } = await supabaseAdmin
      .from("team_seasons")
      .update({ roster })
      .eq("id", seasonId);

    if (error) {
      console.error("Error in updateRoster:", error.message);
      throw new Error(error.message);
    }
    revalidatePath(`/admin/programs/${programId}`);
    return { success: true };
  } catch (err) {
    console.error("FATAL in updateRoster:", err);
    return { error: "An unexpected error occurred while updating the roster." };
  }
}

