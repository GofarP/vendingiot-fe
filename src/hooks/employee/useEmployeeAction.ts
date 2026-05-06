"use client"
import { useState } from "react"
import { toast } from "sonner"
import { Employee } from "@/src/services/employeeServices"
import { ActionResponse } from "@/src/types/common";
import { Role } from "@/src/services/roleServices";

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
        photo: null,
        password: "",
        roleId: "",
        role: undefined
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});

    const resetForm = () => {
        setForm({
            id: 0, fullName: "",
            userName: "",
            email: "",
            password: "",
            roleId: "",
            role: undefined,
            photoUrl: "",
            photo: null
        });
        setServerErrors({});
        setSelectedEmployee(null);
    }

    const handleOpenAdd = () => {
        resetForm();
        setIsModalOpen(true);
    }

    const handleOpenEdit = (employee: Employee) => {
        resetForm();
        setSelectedEmployee(employee);
        setForm({
            id: employee.id,
            fullName: employee.fullName || "",
            userName: employee.userName || "",
            email: employee.email || "",
            password: "", 
            roleId: employee.role?.id || "",
            photoUrl: employee.photoUrl || "",
            photo: null
        });

        console.log(employee);

        setIsModalOpen(true);
    };

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        setIsSubmitting(true);
        setServerErrors({});

        const photo = form.photo || undefined;

        console.log(form);

        const action = selectedEmployee?.id
            ? updateEmployee(selectedEmployee.id, form, photo)
            : addEmployee(form, photo);

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

    return {
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