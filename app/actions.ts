"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  adjustEntry,
  createLeaderboard,
  deleteLeaderboard,
  deleteEntry,
  upsertEntry,
  updateLeaderboardSettings,
  updateManagerPassword,
  verifyManager,
  verifyManagerByUsername
} from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { clearSession, requireAdmin, requireManager, setSession } from "@/lib/session";
import {
  createLeaderboardSchema,
  adjustmentSchema,
  entrySchema,
  loginSchema,
  passwordChangeSchema,
  settingsSchema
} from "@/lib/validation";

function toObject(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

function failure(path: string, error: unknown): never {
  const message = error instanceof Error ? error.message : "Something went wrong.";
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function staffLoginAction(formData: FormData) {
  let target = "/admin";
  try {
    await rateLimit("staff-login", 10, 60_000);
    const input = loginSchema.parse(toObject(formData));
    const username = process.env.ADMIN_USERNAME;
    const passwordHash = process.env.ADMIN_PASSWORD_HASH;

    let isAdmin = false;
    if (username && passwordHash) {
      const adminOk = input.username === username && (await bcrypt.compare(input.password, passwordHash));
      if (adminOk) {
        await setSession("admin");
        isAdmin = true;
        target = "/admin/dashboard";
      }
    }

    if (!isAdmin) {
      const managerBoard = await verifyManagerByUsername(input.username, input.password);
      if (managerBoard) {
        await setSession("manager", managerBoard.slug);
        target = `/manage/${managerBoard.slug}`;
      } else {
        throw new Error("Invalid staff credentials.");
      }
    }
  } catch (error) {
    failure("/admin", error);
  }
  redirect(target);
}

export async function logoutAction() {
  await clearSession();
  redirect("/home");
}

export async function createLeaderboardAction(formData: FormData) {
  let target = "/admin";
  try {
    await rateLimit("create-leaderboard", 12, 60_000);
    await requireAdmin();
    const input = createLeaderboardSchema.parse(toObject(formData));
    const board = await createLeaderboard({
      ...input,
      maxValue: input.maxValue ?? null
    });
    revalidatePath("/home");
    target = `/manage/${board.slug}`;
  } catch (error) {
    failure("/admin/dashboard", error);
  }
  redirect(target);
}

export async function managerLoginAction(slug: string, formData: FormData) {
  try {
    await rateLimit(`manager-login-${slug}`, 8, 60_000);
    const input = loginSchema.parse(toObject(formData));
    const board = await verifyManager(slug, input.username, input.password);
    if (!board) {
      throw new Error("Invalid manager credentials.");
    }
    await setSession("manager", slug);
  } catch (error) {
    failure(`/manage/${slug}`, error);
  }
  redirect(`/manage/${slug}`);
}

export async function saveEntryAction(slug: string, formData: FormData) {
  try {
    await rateLimit(`save-entry-${slug}`, 40, 60_000);
    await requireManager(slug);
    const input = entrySchema.parse(toObject(formData));
    await upsertEntry(slug, input);
    revalidatePath(`/leaderboards/${slug}`);
    revalidatePath(`/manage/${slug}`);
  } catch (error) {
    failure(`/manage/${slug}`, error);
  }
  redirect(`/manage/${slug}`);
}

export async function adjustEntryAction(slug: string, formData: FormData) {
  try {
    await rateLimit(`adjust-entry-${slug}`, 60, 60_000);
    await requireManager(slug);
    const input = adjustmentSchema.parse(toObject(formData));
    await adjustEntry(slug, input.id, input.delta);
    revalidatePath(`/leaderboards/${slug}`);
    revalidatePath(`/manage/${slug}`);
  } catch (error) {
    failure(`/manage/${slug}`, error);
  }
  redirect(`/manage/${slug}`);
}

export async function deleteEntryAction(slug: string, formData: FormData) {
  try {
    await rateLimit(`delete-entry-${slug}`, 30, 60_000);
    await requireManager(slug);
    const id = String(formData.get("id") ?? "");
    if (!id) throw new Error("Entry id is required.");
    await deleteEntry(slug, id);
    revalidatePath(`/leaderboards/${slug}`);
    revalidatePath(`/manage/${slug}`);
  } catch (error) {
    failure(`/manage/${slug}`, error);
  }
  redirect(`/manage/${slug}`);
}

export async function updateSettingsAction(slug: string, formData: FormData) {
  try {
    await rateLimit(`settings-${slug}`, 20, 60_000);
    await requireManager(slug);
    const input = settingsSchema.parse(toObject(formData));
    await updateLeaderboardSettings(slug, {
      name: input.name,
      description: input.description,
      measurement: input.measurement,
      maxValue: input.maxValue ?? null,
      primaryColor: input.primaryColor,
      accentColor: input.accentColor,
      textColor: input.textColor,
      headerImageUrl: input.headerImageUrl
    });
    revalidatePath(`/leaderboards/${slug}`);
    revalidatePath(`/manage/${slug}`);
  } catch (error) {
    failure(`/manage/${slug}`, error);
  }
  redirect(`/manage/${slug}?tab=style&ok=${encodeURIComponent("Style updated.")}`);
}

export async function deleteLeaderboardAction(slug: string) {
  try {
    await rateLimit(`delete-board-${slug}`, 8, 60_000);
    await requireAdmin();
    await deleteLeaderboard(slug);
    revalidatePath("/home");
    revalidatePath(`/leaderboards/${slug}`);
    revalidatePath(`/manage/${slug}`);
  } catch (error) {
    failure(`/manage/${slug}`, error);
  }
  redirect("/admin/dashboard?ok=Leaderboard%20deleted.");
}

export async function changeManagerPasswordAction(slug: string, formData: FormData) {
  try {
    await rateLimit(`manager-password-${slug}`, 6, 60_000);
    await requireManager(slug);
    const input = passwordChangeSchema.parse(toObject(formData));
    await updateManagerPassword(slug, input.oldPassword, input.newPassword);
  } catch (error) {
    failure(`/manage/${slug}`, error);
  }
  redirect(`/manage/${slug}?tab=account&ok=${encodeURIComponent("Password updated.")}`);
}
