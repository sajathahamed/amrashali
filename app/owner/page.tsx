import { getOwnerProfile, getCVData } from "@/lib/data";
import OwnerClient from "./OwnerClient";

export const revalidate = 60;

const emptyContact = { id: "", phone: "", email: "", address: "" };

export default async function OwnerPage() {
  const ownerProfile = await getOwnerProfile();
  let contact = emptyContact;
  try {
    const cvData = await getCVData();
    contact = cvData?.contact ?? emptyContact;
  } catch {
    // CV data optional; page still shows profile
  }
  return (
    <OwnerClient
      ownerProfile={ownerProfile}
      contact={contact}
    />
  );
}
