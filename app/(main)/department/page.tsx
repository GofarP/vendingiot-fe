"use client";
import React, { useState } from "react";
import { Plus, Pencil, Trash2, Save, Building2, AlertCircle } from "lucide-react";

import DataTable from "@/src/components/DataTable";
import Input from "@/src/components/Input";
import Button from "@/src/components/Button";
import FormShell from "@/src/components/FormShell";

import { useDepartment } from "@/src/hooks/useDepartment";
import { Department } from "@/src/services/departmentServices";
import { toast } from "sonner";

export default function DepartmentPage() {
  const {
    department,
    loading,
    error,
    meta,
    setPage,
    setPageSize,
    setSearch,
    search,
    addDepartment,
    updateDepartment,
    deleteDepartment
  } = useDepartment();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [form, setForm] = useState<Department>({ name: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});

  const resetForm = () => {
    setForm({ name: "", description: "" });
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
    setForm({ name: dept.name, description: dept.description });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    setServerErrors({});

    const action = selectedDept?.id
      ? updateDepartment(selectedDept.id, form)
      : addDepartment(form);

    const res = await action;
    setIsSubmitting(false);

    if (res.success) {
      setIsModalOpen(false);
      resetForm();
      toast.success(selectedDept
        ? `Berhasil memperbarui ${form.name}`
        : `Berhasil menambahkan ${form.name} ke sistem`
      );
    } else {
      if (res.errors) {
        setServerErrors(res.errors);
      } else {
        toast.error(res.message || "Terjadi kesalahan pada server.");
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus departemen ini?")) {
      const res = await deleteDepartment(id);
      if (!res.success) alert(res.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter leading-none">
            Department <span className="text-blue-600">List</span>
          </h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2">
            Management of VendingIoT Divisions
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          icon={<Plus size={20} />}
          className="w-full md:w-auto"
        >
          Tambah Data
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-medium">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* THE SMART DATATABLE */}
      <DataTable
        data={department}
        isLoading={loading}
        meta={meta}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSearchChange={setSearch}
        searchValue={search}
        columns={[
          {
            label: "No",
            render: (_, i) => (
              <span className="text-gray-400 font-mono text-xs pl-4">{i + 1}</span>
            ),
          },
          {
            label: "Department Name",
            render: (item) => (
              <div className="flex items-center gap-3">
                
                <b className="text-gray-900 tracking-tight">{item.name}</b>
              </div>
            ),
          },
          {
            label: "Description",
            render: (item) => (
              <span className="text-gray-500 text-xs leading-relaxed line-clamp-1">
                {item.description || "-"}
              </span>
            ),
          },
          {
            label: "Actions",
            render: (item) => (
              <div className="flex gap-1 pr-4">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 text-yellow-500 hover:bg-yellow-50 rounded-xl transition-all"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => item.id && handleDelete(item.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ),
          },
        ]}
        renderMobileCard={(item) => (
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-4">
          
              <h4 className="font-black text-gray-900 uppercase italic tracking-tight leading-none">
                {item.name}
              </h4>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed italic border-l-4 border-blue-100 pl-4 py-1">
              {item.description || "Tidak ada deskripsi."}
            </p>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleOpenEdit(item)}
                icon={<Pencil size={14} />}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={() => item.id && handleDelete(item.id)}
                icon={<Trash2 size={14} />}
              >
                Hapus
              </Button>
            </div>
          </div>
        )}
      />

      <FormShell
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedDept ? "Edit Departemen" : "Tambah Departemen"}
      >
        <div className="space-y-8 py-2">
          <Input
            label="Nama Departemen"
            placeholder="Contoh: IT Support"
            required
            value={form.name}
            error={serverErrors.Name?.[0]}
            onChange={(e) => {
              setForm({ ...form, name: e.target.value });
              if (serverErrors.Name) setServerErrors({ ...serverErrors, Name: [] });
            }}
            description="Nama divisi resmi yang terdaftar."
          />

          <Input
            label="Deskripsi"
            placeholder="Jelaskan fungsi departemen..."
            value={form.description}
            error={serverErrors.Description?.[0]}
            onChange={(e) => {
              setForm({ ...form, description: e.target.value });
              if (serverErrors.Description) setServerErrors({ ...serverErrors, Description: [] });
            }}
            description="Isikan deskripsi"
          />

          <div className="pt-6 flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              disabled={isSubmitting}
              onClick={() => setIsModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              className="flex-1"
              icon={<Save size={18} />}
              onClick={handleSave}
              isLoading={isSubmitting}
            >
              Simpan Data
            </Button>
          </div>
        </div>
      </FormShell>
    </div>
  );
}