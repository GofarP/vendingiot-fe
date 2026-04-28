"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Department } from "@/src/services/departmentServices";

interface ActionResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

interface UseDepartmentActionsProps {
  addDepartment: (payload: Department) => Promise<ActionResponse>;
  updateDepartment: (id: number, payload: Department) => Promise<ActionResponse>;
}

export function useDepartmentActions({ 
  addDepartment, 
  updateDepartment 
}: UseDepartmentActionsProps) {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [form, setForm] = useState<Department>({ name: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});

  const resetForm = () => {
    setForm({id:0, name: "", description: "" });
    setServerErrors({});
    setSelectedDept(null);
  };


  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dept: Department) => {
    resetForm();
    setSelectedDept(dept);
    setForm({ id:dept.id, name: dept.name, description: dept.description });
    setIsModalOpen(true);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    setIsSubmitting(true);
    setServerErrors({});

    const action = selectedDept?.id
      ? updateDepartment(selectedDept.id, form)
      : addDepartment(form);

    const res = await action;
    setIsSubmitting(false);

    if (res.success) {
      // Notifikasi Sukses
      toast.success(selectedDept 
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
    // States
    form,
    isModalOpen,
    selectedDept,
    isSubmitting,
    serverErrors,
    
    setForm,
    setIsModalOpen,
    setServerErrors,
    
    handleOpenAdd,
    handleOpenEdit,
    handleSave,
    resetForm,
  };
}