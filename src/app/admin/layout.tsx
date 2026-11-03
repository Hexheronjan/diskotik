// Admin shell. The proxy already blocks unauthenticated requests; this re-checks on the server as defense in depth.
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Button } from "@/components/ui/Button";
import { PERMISSIONS, hasPermission } from "@/lib/permissions";
import { logoutAction } from "./actions";
import styles from "./admin.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Dasbor Admin", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  RESERVATION_STAFF: "Staf Reservasi",
  TICKET_STAFF: "Staf Tiket",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user.role, PERMISSIONS.DASHBOARD_VIEW)) redirect("/masuk");

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={`container ${styles.bar}`}>
          <p className={styles.brand}>Panel Admin</p>
          <div className={styles.user}>
            <span className={styles.who}>
              {session.user.name} · {ROLE_LABELS[session.user.role] ?? session.user.role}
            </span>
            <form action={logoutAction}>
              <Button type="submit" icon="logout">
                Keluar
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="container">{children}</main>
    </div>
  );
}
