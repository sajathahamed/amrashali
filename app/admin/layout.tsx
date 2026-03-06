import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - AB Journal",
  description: "AB Journal Admin Panel",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
