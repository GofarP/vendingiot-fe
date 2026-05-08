import { Metadata } from "next";
import PermissionPage from "./PermissionClient";
export const metadata: Metadata = {
  title: "Permission",
};

export default function Page() {
  return <PermissionPage />;
}
