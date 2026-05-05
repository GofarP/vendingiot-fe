import { Metadata } from "next";
import RolePage from "./RoleClient";

export const metadata: Metadata = {
  title: "Role",
};

export default function Page() {
  return <RolePage />;
}
