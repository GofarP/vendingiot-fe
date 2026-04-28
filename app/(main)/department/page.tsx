import { Metadata } from "next";
import DepartmentClient from "./DepartmentClient";

export const metadata: Metadata = {
  title: "Department",
};

export default function Page() {
  return <DepartmentClient />;
}
