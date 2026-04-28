"use client";
import { Plus, Pencil, Trash2, Save, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { useEffect } from "react";
import DataTable from "@/src/components/DataTable";
import Input from "@/src/components/Input";
import Button from "@/src/components/Button";
import FormShell from "@/src/components/FormShell";

import { useDepartment } from "@/src/hooks/department/useDepartment";
import { useDepartmentActions } from "@/src/hooks/department/useDepartmentAction";

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
    deleteDepartment,
  } = useDepartment();

  const {
    form,
    setForm,
    isModalOpen,
    setIsModalOpen,
    selectedDept,
    isSubmitting,
    serverErrors,
    setServerErrors,
    handleOpenAdd,
    handleOpenEdit,
    handleSave,
  } = useDepartmentActions({ addDepartment, updateDepartment });

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus departemen ini?")) {
      const res = await deleteDepartment(id);
      if (res.success) {
        toast.success("Data departemen berhasil dihapus.");
      } else {
        toast.error(res.message);
      }
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
              <span className="text-gray-400 font-mono text-xs pl-4">
                {i + 1}
              </span>
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
            <p className="text-xs text-gray-500 border-l-4 border-blue-100 pl-4 py-1">
              {item.description || "Tidak ada deskripsi."}
            </p>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1 text-yellow-500 bg-yellow-100"
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
        <form onSubmit={handleSave} className="space-y-8 py-2">
          <Input
            label="Nama Departemen"
            placeholder="Contoh: IT Support"
            required
            value={form.name}
            error={serverErrors.Name?.[0]}
            onChange={(e) => {
              setForm({ ...form, name: e.target.value });
              if (serverErrors.Name)
                setServerErrors({ ...serverErrors, Name: [] });
            }}
          />

          <Input
            label="Deskripsi"
            placeholder="Jelaskan fungsi departemen..."
            value={form.description}
            error={serverErrors.Description?.[0]}
            onChange={(e) => {
              setForm({ ...form, description: e.target.value });
              if (serverErrors.Description)
                setServerErrors({ ...serverErrors, Description: [] });
            }}
          />

          <div className="pt-6 flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              disabled={isSubmitting}
              onClick={() => setIsModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="flex-1"
              icon={<Save size={18} />}
              isLoading={isSubmitting}
            >
              Simpan Data
            </Button>
          </div>
        </form>
      </FormShell>
    </div>
  );
}
