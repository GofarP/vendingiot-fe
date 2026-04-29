"use client"
import { useState } from "react";
import { toast } from "sonner";
import { ItemCategory } from "@/src/services/itemCategoryServices";
import { ActionResponse } from "@/src/types/common";

interface UseItemCategoryActionProps {
    addItemCategory: (payload: ItemCategory) => Promise<ActionResponse>;
    updateItemCategory: (id: number, payload: ItemCategory) => Promise<ActionResponse>;
}

export function UseItemCategoryActions({
    addItemCategory,
    updateItemCategory
}: UseItemCategoryActionProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItemCategory, setSelectedItemCategory] = useState<ItemCategory | null>(null);
    const [form, setForm] = useState<ItemCategory>({ id: 0, name: "", description: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});


    const resetForm = () => {
        setForm({ id: 0, name: "", description: "" });
        setServerErrors({});
        setSelectedItemCategory(null);
    };

    const handleOpenAdd = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleOpenEdit = (itemCategory: ItemCategory) => {
        resetForm();
        setSelectedItemCategory(itemCategory);
        setForm({ id: itemCategory.id, name: itemCategory.name, description: itemCategory.description });
        setIsModalOpen(true);
    };


    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        setIsSubmitting(true);
        setServerErrors({});

        const action = selectedItemCategory?.id
            ? updateItemCategory(selectedItemCategory.id, form)
            : addItemCategory(form);

        const res = await action;
        setIsSubmitting(false);

        if (res.success) {
            toast.success(selectedItemCategory
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
        selectedItemCategory,
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
