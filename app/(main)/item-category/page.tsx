import { Metadata } from "next";
import ItemCategoryPage from "./ItemCategoryClient";

export const metadata: Metadata = {
  title: "Item Category",
};

export default function Page() {
  return <ItemCategoryPage />;
}
