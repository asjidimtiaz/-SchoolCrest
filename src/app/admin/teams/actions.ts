"use server";

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

async function getSupabase() {
  const cookieStore = await cookies();
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Supabase environment variables are missing in actions.ts");
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Handle edge case where set is called in a component
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // Handle edge case where remove is called in a component
          }
        },
      },
    },
  );
}

export async function deleteTeam(id: string) {
  try {
    const supabase = await getSupabase();
    const { error } = await supabase.from("teams").delete().eq("id", id);
    if (error) {
      console.error("Error in deleteTeam:", error.message);
      throw new Error(error.message);
    }
    revalidatePath("/admin/teams");
  } catch (err) {
    console.error("FATAL in deleteTeam:", err);
    throw err;
  }
}

export async function createTeam(prevState: any, formData: FormData) {
  try {
    const supabase = await getSupabase();

    const name = formData.get("name") as string;
    const gender = formData.get("gender") as string;
    // Use 'Athletics' as fallback if category is missing (legacy support)
    const sport_category = (formData.get("sport_category") as string) || 'Athletics';
    const head_coach = formData.get("head_coach") as string;
    const school_id = formData.get("school_id") as string;
    const media_type = formData.get("media_type") as string || 'image';

    // Season Data
    const season_year = parseInt(formData.get("season_year") as string || new Date().getFullYear().toString());
    const wc_state = formData.get("wc_state") === 'true';
    const wc_region = formData.get("wc_region") === 'true';
    const wc_individual = formData.get("wc_individual") === 'true'; // Actually formData checkbox comes as 'on' or missing if standard submit, but we used controlled state in React which sends value. 
    // Wait, controlled React form submit sends values as strings normally? 
    // In our manual fetch or FormData construction? 
    // Since we use <form action={formAction}>, standard browser behavior applies. 
    // Checkboxes only send if checked, value is 'on' usually. 
    // BUT we intercepted via React state? NO, we used UseActionState which binds to the form submission.
    // The inputs in the form are controlled but they still need 'value' or 'checked' attributes to submit.
    // In modify `TeamForm`, I used `checked={!!formData...}`. The input is `<input type="checkbox" name="wc_..." ... />`.
    // So if checked, it sends 'on'. If not, nothing.
    // So helper check:
    const isState = formData.get("wc_state") === 'on';
    const isRegion = formData.get("wc_region") === 'on';
    
    // Note: The new column needs to exist in DB
    const individual_accomplishments = formData.get("individual_accomplishments") as string || '';

    // photo_url should now come from existing_photo_url as it's uploaded client-side
    let photo_url = formData.get("existing_photo_url") as string || '';
    let background_url = formData.get("existing_background_url") as string || '';

    // Roster Data
    const rosterRaw = formData.get("roster") as string;
    let initialRoster = [];
    try {
        if (rosterRaw) initialRoster = JSON.parse(rosterRaw);
    } catch (e) {
        console.warn("Failed to parse initial roster:", e);
    }

    // 1. Upsert/Find Team (Program)
    // We want to avoid duplicates if user just adds a season to existing program
    let teamId = '';
    let teamName = name;

    const { data: existingTeam } = await supabase
        .from("teams")
        .select("id, name")
        .eq("school_id", school_id)
        .eq("name", name)
        .eq("gender", gender)
        .single();

    if (existingTeam) {
        teamId = existingTeam.id;
        // Optionally update the program photo if a new one was provided? 
        // For now, let's update it so the latest upload becomes the program header
        if (photo_url || background_url) {
            const updates: any = { media_type, head_coach };
            if (photo_url) updates.photo_url = photo_url;
            if (background_url) updates.background_url = background_url;
            
            await supabase.from("teams").update(updates).eq("id", teamId);
        }
    } else {
        const { data: newTeam, error: createError } = await supabase.from("teams").insert({
            name,
            gender,
            sport_category,
            head_coach,
            photo_url,
            background_url,
            media_type,
            school_id,
        }).select().single();

        if (createError) {
            console.error("Error creating team program:", createError.message);
            return { error: createError.message };
        }
        teamId = newTeam.id;
        teamName = newTeam.name;
    }

    // 2. Create Season
    const achievements: string[] = [];
    if (isState) achievements.push("State Champions");
    if (isRegion) achievements.push("Region Champions");
    
    const season_photo_url = formData.get("season_photo_url") as string || '';

    const { data: seasonData, error: seasonError } = await supabase.from("team_seasons").insert({
        team_id: teamId,
        year: season_year,
        record: '', // Optional start
        coach: head_coach, // Default to program coach
        achievements: achievements,
        individual_accomplishments: individual_accomplishments,
        summary: formData.get("summary") as string || '',
        roster: initialRoster,
        photo_url: season_photo_url
    }).select().single();

    if (seasonError) {
        console.warn("Failed to create season:", seasonError.message);
        // If it failed (e.g. duplicate year for team), return error
        return { error: "Failed to create season (maybe it already exists?): " + seasonError.message };
    }

    revalidatePath("/admin/teams");
    return { 
        success: true, 
        teamId: teamId, 
        teamName: teamName,
        seasonId: seasonData.id,
        seasonYear: seasonData.year
    };
  } catch (err) {
    console.error("FATAL in createTeam:", err instanceof Error ? err.message : err);
    return { error: "An unexpected error occurred." };
  }
}

export async function updateTeam(prevState: any, formData: FormData) {
  try {
    const supabase = await getSupabase();

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const gender = formData.get("gender") as string;
    const sport_category = formData.get("sport_category") as string;
    const head_coach = formData.get("head_coach") as string;
    const media_type = formData.get("media_type") as string || 'image';
    const school_id = formData.get("school_id") as string; // Ensure this is passed!

    const photo_url = formData.get("existing_photo_url") as string || '';
    const background_url = formData.get("existing_background_url") as string || '';

    const updates: any = {
        name,
        gender,
        sport_category,
        head_coach,
        media_type
    };

    if (photo_url) updates.photo_url = photo_url;
    if (background_url) updates.background_url = background_url;

    const { error } = await supabase
      .from("teams")
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error("Error in updateTeam:", error.message);
      return { error: error.message };
    }
    revalidatePath("/admin/teams");
    return { success: true };
  } catch (err) {
    console.error("FATAL in updateTeam:", err);
    return { error: "An unexpected error occurred while updating the team." };
  }
}

// Season Actions
export async function deleteSeason(id: string, teamId: string) {
  try {
    const supabase = await getSupabase();
    const { error } = await supabase.from("team_seasons").delete().eq("id", id);
    if (error) {
      console.error("Error in deleteSeason:", error.message);
      throw new Error(error.message);
    }
    revalidatePath(`/admin/teams/${teamId}`);
  } catch (err) {
    console.error("FATAL in deleteSeason:", err);
    throw err;
  }
}

export async function upsertSeason(prevState: any, formData: FormData) {
  try {
    const supabase = await getSupabase();

    const id = formData.get("id") as string | null;
    const team_id = formData.get("team_id") as string;
    const year = parseInt(formData.get("year") as string);
    const coach = formData.get("coach") as string;
    const record = formData.get("record") as string;
    const achievements = (formData.get("achievements") as string || '')
      .split("\n")
      .filter(Boolean);
    const summary = formData.get("summary") as string || '';

    const rosterRaw = formData.get("roster") as string;
    let roster = rosterRaw;
    try {
        // Attempt to parse if it's a JSON string, otherwise keep as string or empty array
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
      team_id,
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
      result = await supabase.from("team_seasons").update(payload).eq("id", id);
    } else {
      result = await supabase.from("team_seasons").insert(payload);
    }

    if (result.error) {
      console.error("Error in upsertSeason:", result.error.message);
      return { error: result.error.message };
    }
    revalidatePath(`/admin/teams/${team_id}`);
    return { success: true };
  } catch (err) {
    console.error("FATAL in upsertSeason:", err);
    return { error: "An unexpected error occurred while saving the season." };
  }
}

export async function updateRoster(seasonId: string, teamId: string, roster: any) {
  try {
    const supabase = await getSupabase();
    const { error } = await supabase
      .from("team_seasons")
      .update({ roster })
      .eq("id", seasonId);
    
    if (error) {
      console.error("Error in updateRoster:", error.message);
      throw new Error(error.message);
    }
    revalidatePath(`/admin/teams/${teamId}`);
    return { success: true };
  } catch (err) {
    console.error("FATAL in updateRoster:", err);
    return { error: "An unexpected error occurred while updating the roster." };
  }
}

