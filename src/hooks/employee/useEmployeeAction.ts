"use client"
import { useState } from "react"
import { toast } from "sonner"
import { Employee } from "@/src/services/employeeServices"
import { ActionResponse } from "@/src/types/common";

interface UseEmployeeActionProps {
    addEmployee: (payload: Employee, photo?: File) => Promise<ActionResponse>;
    updateEmployee: (id: number, payload: Employee, photo?: File) => Promise<ActionResponse>;
}

export function useEmployeeActions({
    addEmployee,
    updateEmployee
}: UseEmployeeActionProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [form, setForm] = useState<Employee>({
        id: 0,
        fullName: "",
        userName: "",
        email: "",
        photoUrl: "",
        photo: null
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});

    const resetForm = () => {
        setForm({
            id: 0, fullName: "",
            userName: "",
            email: "",
            photoUrl: "",
            photo: null
        })
    }

    const handleOpenAdd = () => {
        resetForm();
        setIsModalOpen(true);
    }

    const handleOpenEdit = (employee: Employee) => {
        resetForm();
        setSelectedEmployee(employee);
        setForm({
            id: 0, fullName: "",
            userName: "",
            email: "",
            photoUrl: "",
            photo: null
        })

        setIsModalOpen(true);
    };

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        setIsSubmitting(true);
        setServerErrors({});

        const action = selectedEmployee?.id
            ? updateEmployee(selectedEmployee.id, form)
            : addEmployee(form);

        const res = await action;
        setIsSubmitting(false);

        if (res.success) {
            toast.success(selectedEmployee
                ? `Berhasil memperbarui data employee`
                : `Berhasil menambahkan data employee`
            );

            setIsModalOpen(false);
            resetForm();
        }
        else {
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
        selectedEmployee,
        isSubmitting,
        serverErrors,
        setForm,
        setIsModalOpen,
        setServerErrors,
        handleOpenAdd,
        handleOpenEdit,
        handleSave
    };

}