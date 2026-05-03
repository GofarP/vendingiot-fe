"use client"
import { useState } from "react";
import { toast } from "sonner";
import { ActionResponse } from "@/src/types/common";
import { Permission } from "@/src/services/permissionServices";
import { PermissionCategory } from "@/src/services/permissionCategoryServices";

interface UsePermissionActionProps {
    addPermission: (payload: Permission) => Promise<ActionResponse>;
    updatePermission: (id: number, payload: Permission) => Promise<ActionResponse>;
}

export function UsePermissionActions({
    addPermission: addPermission,
    updatePermission: updatePermission
}: UsePermissionActionProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
    const [form, setForm] = useState<Permission>({ id: 0, name: "", permissionCategoryId:0});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});

    const resetForm = () => {
        setForm({ id: 0, name: "", permissionCategoryId:0});
        setServerErrors({});
        setSelectedPermission(null);
    };

    const handleOpenAdd = () => {
        resetForm();
        setIsModalOpen(true);
    }

    const handleOpenEdit = (permission: Permission) => {
        resetForm();
        setSelectedPermission(permission);
        setForm({ id: permission.id, name: permission.name, permissionCategoryId:permission.permissionCategoryId });
        setIsModalOpen(true);
    };

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        setIsSubmitting(true);
        setServerErrors({});

        const action = selectedPermission?.id
            ? updatePermission(selectedPermission.id, form)
            : addPermission(form);

        const res = await action;
        setIsSubmitting(false);

        if (res.success) {
            toast.success(selectedPermission
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
        selectedPermission: selectedPermission,
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