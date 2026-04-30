import { Metadata } from "next";
import ItemPage from "./ItemClient";
export const metadata: Metadata = {
  title: "Item",
};

export default function Page() {
  return <ItemPage />;
}
