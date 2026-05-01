"use client"
import { useState } from "react";
import { toast } from "sonner";
import { PermissionCategory } from "@/src/services/permissionCategoryServices";
import { ActionResponse } from "@/src/types/common";
import { VendingMachine } from "@/src/services/vendingMachineServices";


interface UseVendingMachine {
    addVendingMachine: (payload: VendingMachine) => Promise<ActionResponse>;
    updateVendingMachine: (id: number, payload: VendingMachine) => Promise<ActionResponse>;
}

export function UseVendingMachineAction({
    addVendingMachine,
    updateVendingMachine
}: UseVendingMachine) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVendingMachine, setSelectedVendingMachine] = useState<VendingMachine | null>(null);
    const [form, setForm] = useState<VendingMachine>({ id: 0, machineCode: "", name: "", location: "", isActive: true, lastRestock: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});


    const resetForm = () => {
        setForm({ id: 0, machineCode: "", name: "", location: "", isActive: true, lastRestock: "" });
        setServerErrors({});
        setSelectedVendingMachine(null);
    };

    const handleOpenAdd = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleOpenEdit = (vendingMachine: VendingMachine) => {
        resetForm();
        setSelectedVendingMachine(vendingMachine);
        setForm({ id: vendingMachine?.id, name: vendingMachine?.name, location: vendingMachine?.location, isActive: vendingMachine?.isActive, lastRestock: vendingMachine?.lastRestock });
        setIsModalOpen(true);
    };


    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        setIsSubmitting(true);
        setServerErrors({});

        const action = selectedVendingMachine?.id
            ? updateVendingMachine(selectedVendingMachine.id, form)
            : addVendingMachine(form);

        const res = await action;
        setIsSubmitting(false);

        if (res.success) {
            toast.success(selectedVendingMachine
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

    return {
        form,
        isModalOpen,
        selectedVendingMachine,
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