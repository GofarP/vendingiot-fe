import { Metadata } from "next";
import VendingMachineClient from "./VendingMachineClient";

export const metadata:Metadata={
    title:"Vending Machine"
}

export default function Page(){
    return <VendingMachineClient/>
}