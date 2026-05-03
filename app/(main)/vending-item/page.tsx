import { Metadata } from "next";
import VendingItemClient from "./VendingItemClient";

export const metadata:Metadata={
    title:"Vending Item"
}

export default function Page(){
   return  <VendingItemClient/>
}