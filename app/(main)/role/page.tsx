import { Metadata } from "next";
import RoleForm from "./RoleClient";

export const metadata: Metadata = {
  title: "Role",
};

export default function Page() {
  return <RoleForm/>
}
