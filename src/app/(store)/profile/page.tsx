import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/require-auth";
import { ProfileView } from "@/components/auth/profile-view";

export const metadata: Metadata = {
  title: "Profile",
  description: "Your account details.",
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileView />
    </RequireAuth>
  );
}