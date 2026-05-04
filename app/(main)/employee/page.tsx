import { Metadata } from "next";
import EmployeePage from "./EmployeeClient";
export const metadata: Metadata = {
  title: "Employee",
};

export default function Page() {
  return <EmployeePage />;
}
