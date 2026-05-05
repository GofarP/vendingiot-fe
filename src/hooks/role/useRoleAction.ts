import { useState } from "react";
import { toast } from "sonner";
import { Role } from "@/src/services/roleServices";
import { ActionResponse } from "@/src/types/common";

interface UseRoleActionProps {
  addRole: (payload: Role) => Promise<ActionResponse>;
  updateRole: (id: string, payload: Role) => Promise<ActionResponse>;
}

export function UseRoleActions({ addRole, updateRole }: UseRoleActionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});

  const [form, setForm] = useState<Role>({
    Name: "",
    PermissionIds: [],
  });

  const resetForm = () => {
    setForm({ Name: "", PermissionIds: [] });
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
    setForm({
      Id: role.Id,
      Name: role.Name,
      PermissionIds: role.PermissionIds || [],
    });
    setIsModalOpen(true);
  };

  const handleTogglePermission = (id: number) => {
    setForm((prev) => ({
      ...prev,
      PermissionIds: prev.PermissionIds.includes(id)
        ? prev.PermissionIds.filter((pId) => pId !== id)
        : [...prev.PermissionIds, id],
    }));

    if (serverErrors.PermissionIds) {
      setServerErrors({ ...serverErrors, PermissionIds: [] });
    }
  };

  const handleSelectAllCategory = (categoryIds: number[], isChecked: boolean) => {
    setForm((prev) => ({
      ...prev,
      PermissionIds: isChecked
        ? Array.from(new Set([...prev.PermissionIds, ...categoryIds]))
        : prev.PermissionIds.filter((id) => !categoryIds.includes(id)),
    }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setServerErrors({});

    const action = selectedRole?.Id
      ? updateRole(selectedRole.Id, form)
      : addRole(form);

    const res = await action;
    setIsSubmitting(false);

    if (res.success) {
      toast.success(selectedRole ? "Role diperbarui" : "Role ditambahkan");
      setIsModalOpen(false);
      resetForm();
    } else {
      if (res.errors) setServerErrors(res.errors);
      toast.error(res.message || "Gagal menyimpan data.");
    }
  };

  return {
    form, isModalOpen, selectedRole, isSubmitting, serverErrors,
    setForm,setServerErrors, setIsModalOpen, handleOpenAdd, handleOpenEdit,
    handleTogglePermission, handleSelectAllCategory, handleSave
  };
}