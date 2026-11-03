"use server";

import { auth, signOut } from "@/auth";
import { db } from "@/lib/db";

export async function logoutAction() {
  const session = await auth();
  const userId = Number(session?.user?.id);
  if (Number.isInteger(userId) && userId > 0) {
    await db.activityLog.create({
      data: { userId, action: "LOGOUT", entity: "User", entityId: String(userId), detail: "Staf keluar dari dasbor" },
    });
  }
  await signOut({ redirectTo: "/masuk" });
}
