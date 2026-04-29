"use client"
import { useState } from "react";
import { toast } from "sonner";
import { PermissionCategory } from "@/src/services/permissionCategoryServices";
import { ActionResponse } from "@/src/types/common";

interface UsePermissionCategoryActionProps {
    addPermissionCategory: (payload: PermissionCategory) => Promise<ActionResponse>;
    updatePermissionCategory: (id: number, payload: PermissionCategory) => Promise<ActionResponse>;
}

export function UsePermissionCategoryActions({
    addPermissionCategory,
    updatePermissionCategory
}: UsePermissionCategoryActionProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPermissionCategory, setSelectedPermissionCategory] = useState<PermissionCategory | null>(null);
    const [form, setForm] = useState<PermissionCategory>({ id: 0, name: "", description: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});


    const resetForm = () => {
        setForm({ id: 0, name: "", description: "" });
        setServerErrors({});
        setSelectedPermissionCategory(null);
    };

    const handleOpenAdd = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleOpenEdit = (permissionCategory: PermissionCategory) => {
        resetForm();
        setSelectedPermissionCategory(permissionCategory);
        setForm({ id: permissionCategory.id, name: permissionCategory.name, description: permissionCategory.description });
        setIsModalOpen(true);
    };


    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        setIsSubmitting(true);
        setServerErrors({});

        const action = selectedPermissionCategory?.id
            ? updatePermissionCategory(selectedPermissionCategory.id, form)
            : addPermissionCategory(form);

        const res = await action;
        setIsSubmitting(false);

        if (res.success) {
            toast.success(selectedPermissionCategory
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

}
