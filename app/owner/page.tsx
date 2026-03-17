import { getOwnerProfile } from "@/lib/data";
import OwnerClient from "./OwnerClient";

export const revalidate = 60;

export default async function OwnerPage() {
  const ownerProfile = await getOwnerProfile();
  return <OwnerClient ownerProfile={ownerProfile} />;
}
