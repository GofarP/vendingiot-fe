"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Role } from "@/src/services/roleServices";
import { ActionResponse } from "@/src/types/common";



interface UseRoleActionProps {
  addRole: (payload: Role) => Promise<ActionResponse>;
  updateRole: (id: number, payload: Role) => Promise<ActionResponse>;
}

export function UseRoleActions({
  addRole: addDepartment,
  updateRole: updateDepartment
}: UseRoleActionProps) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [form, setForm] = useState<Role>({ name: ""});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});

  const resetForm = () => {
    setForm({ id: 0, name: "" });
    setServerErrors({});
    setSelectedRole(null);
  };


  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (role: Role) => {
    resetForm();
    setSelectedRole(role);
    setForm({ id: role.id, name: role.name});
    setIsModalOpen(true);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setIsSubmitting(true);
    setServerErrors({});

    const action = selectedRole?.id
      ? updateDepartment(selectedRole.id, form)
      : addDepartment(form);

    const res = await action;
    setIsSubmitting(false);

    if (res.success) {
      toast.success(selectedRole
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
    selectedRole: selectedRole,
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