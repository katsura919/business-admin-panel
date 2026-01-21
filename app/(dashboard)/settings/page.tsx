"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SettingsPage() {
  const router = useRouter();

  // Redirect to create-admin by default
  useEffect(() => {
    router.replace("/settings/create-admin");
  }, [router]);

  return null;
}
