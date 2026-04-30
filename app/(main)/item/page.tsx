import { Metadata } from "next";
import ItemPage from "./ItemPage";
export const metadata: Metadata = {
  title: "Item",
};

export default function Page() {
  return <ItemPage />;
}
