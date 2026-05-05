import { Metadata } from "next";
import PermissionCategoryPage from "./PermissionCategoryClient";

export const metadata: Metadata = {
  title: "Permission Category",
};

export default function Page() {
  return <PermissionCategoryPage />;
}
