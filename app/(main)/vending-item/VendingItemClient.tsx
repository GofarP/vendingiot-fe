"use client";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import DataTable from "@/src/components/DataTable";
import Input from "@/src/components/Input";
import Button from "@/src/components/Button";
import FormShell from "@/src/components/FormShell";
import { useVendingItem } from "@/src/hooks/vending-item/useVendingItem";
import { useVendingItemAction } from "@/src/hooks/vending-item/useVendingItemAction";

export default function VendingItemPage() {
  const {
    vendingItem,
    loading,
    error,
    meta,
    setPage,
    setPageSize,
    setSearch,
    search,
    removeItemFromMachine,
    assignItemToMachine,
    restock,
  } = useVendingItem();

 
}
