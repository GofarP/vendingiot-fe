"use client"
import { useState } from "react";
import { toast } from "sonner";
import { Item } from "@/src/services/itemServices";
import { ActionResponse } from "@/src/types/common";

interface UseItemActionProps {
    addItem: (payload: Item) => Promise<ActionResponse>;
    updateItem: (id: number, payload: Item) => Promise<ActionResponse>;
}

export function UseItemActions({
    addItem,
    updateItem
}: UseItemActionProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [form, setForm] = useState<Item>({ id: 0, name: "", itemCategoryId: 0, price: 0.0, quantity: 0 });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});

    const resetForm = () => {
        setForm({ id: 0, name: "", itemCategoryId: 0, price: 0.0, quantity: 0 });
        setServerErrors({});
        setSelectedItem(null);
    };

    const handleOpenAdd = () => {
        resetForm();
        setIsModalOpen(true);
    }

    const handleOpenEdit = (item: Item) => {
        resetForm();
        setSelectedItem(item);
        setForm({ id: item.id, name: item.name, itemCategoryId: item.itemCategoryId, price: item.price, quantity: item.quantity });
        setIsModalOpen(true);
    };

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        setIsSubmitting(true);
        setServerErrors({});

        const action = selectedItem?.id
            ? updateItem(selectedItem.id, form)
            : addItem(form);

        const res = await action;
        setIsSubmitting(false);

        if (res.success) {
            toast.success(selectedItem
                ? `Berhasil memperbarui data ${form.name}`
                : `Berhasil menambahkan data ${form.name}`
            );

            setIsModalOpen(false);
            resetForm();
        } else {
            if (res.errors) {
                setServerErrors(res.errors);
                toast.error("Gagal menyimpan: Silakan periksa kembali isian Anda.");
            } else {
                toast.error(res.message || "Terjadi kesalahan sistem.");
            }
        }
    };

    return{
        form,
        isModalOpen,
        selectedItem,
        isSubmitting,
        serverErrors,
        setForm,
        setIsModalOpen,
        setServerErrors,
        handleOpenAdd,
        handleOpenEdit,
        handleSave,
        resetForm
    }

}