import { useState } from "react";
import { toast } from "sonner";
import { Role, roleService } from "@/src/services/roleServices";

export function UseRoleActions(refreshTable: () => void) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
  const [form, setForm] = useState<Role>({ name: "", permissionIds: [] });

  const handleOpenAdd = () => {
    setForm({ name: "", permissionIds: [] })
    setServerErrors({});
    setSelectedRole(null);
    setIsModalOpen(true);
  }

  const handleOpenEdit = (item: Role) => {
    setForm({
      id: item.id,
      name: item.name,
      permissionIds: item.permissionIds || []
    });
    setServerErrors({});
    setSelectedRole(item);
    setIsModalOpen(true);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const action = selectedRole?.id ? roleService.update(selectedRole.id, form) : roleService.create(form);
    const res = await action;
    if (res.success) {
      toast.success("Data berhasil disimpan")
      setIsModalOpen(false);
      refreshTable();
    } else {
      if (res.errors) setServerErrors(res.errors);
      toast.error(res.message || "Gagal menyimpan data");
    }
    setIsSubmitting(false);
  };

    return { form, setForm, isModalOpen, setIsModalOpen, isSubmitting, serverErrors, setServerErrors, handleOpenAdd, handleOpenEdit, handleSave, selectedRole };


}