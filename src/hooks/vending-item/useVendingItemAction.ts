"use client"
import { useState } from "react";
import { toast } from "sonner";
import { ActionResponse } from "@/src/types/common";
import { VendingItem } from "@/src/services/vendingItemServices";

interface UseVendingItemActionProps {
    assignItemToMachine: (payload: VendingItem) => Promise<ActionResponse>;
    removeItemFromMachine: (id: number) => Promise<ActionResponse>;
    restockItem: (id: number, qty: number) => Promise<ActionResponse>;
}

export function useVendingItemAction({
    assignItemToMachine,
    removeItemFromMachine,
    restockItem
}: UseVendingItemActionProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVendingItem, setSelectedVendingItem] = useState<VendingItem | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverErrors, setServerErrors] = useState<any>(null);

    const [form, setForm] = useState<VendingItem>({
        id: 0,
        vendingMachineId: 0,
        itemId: 0,
        quantity: 0,
        capacity: 0
    });

    const resetForm = () => {
        setForm({ id: 0, vendingMachineId: 0, itemId: 0, capacity: 0, quantity: 0 });
        setServerErrors(null);
        setSelectedVendingItem(null);
    };

    const handleOpenAdd = (machineId: number) => {
        resetForm();
        setForm(prev => ({ ...prev, vendingMachineId: machineId }));
        setIsModalOpen(true);
    };

    const handleOpenEdit = (vendingItem: VendingItem) => {
        resetForm();
        setSelectedVendingItem(vendingItem);
        setForm({ 
            id: vendingItem.id, 
            vendingMachineId: vendingItem.vendingMachineId, 
            itemId: vendingItem.itemId, 
            capacity: vendingItem.capacity, 
            quantity: vendingItem.quantity 
        });
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setServerErrors(null);

        try {
            const res = await assignItemToMachine(form);

            if (res.success) {
                toast.success("Barang berhasil ditambahkan ke mesin.");
                setIsModalOpen(false);
            } else {
                toast.error(res.message || "Gagal menyimpan data.");
            }
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setServerErrors(error.response.data.errors);
            } else {
                toast.error("Terjadi kesalahan pada server.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        form,
        setForm,
        isModalOpen,
        setIsModalOpen,
        selectedVendingItem,
        isSubmitting,
        serverErrors,
        setServerErrors,
        handleOpenAdd,
        handleOpenEdit,
        handleSave,
        removeItemFromMachine,
        restockItem
    };
}