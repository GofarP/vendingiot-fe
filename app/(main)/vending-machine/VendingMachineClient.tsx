"use client";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  AlertCircle,
  MapPin,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

import DataTable from "@/src/components/DataTable";
import Input from "@/src/components/Input";
import Button from "@/src/components/Button";
import FormShell from "@/src/components/FormShell";

import { useVendingMachine } from "@/src/hooks/vendingmachine/useVendingMachine";
import { useVendingMachineAction } from "@/src/hooks/vendingmachine/useVendingMachineAction";

export default function DepartmentPage() {
  const {
    vendingMachine,
    loading,
    error,
    meta,
    setPage,
    setPageSize,
    setSearch,
    search,
    addVendingMachine,
    updateVendingMachine,
    deleteVendingMachine,
  } = useVendingMachine();

  const {
    form,
    setForm,
    isModalOpen,
    setIsModalOpen,
    selectedVendingMachine,
    isSubmitting,
    serverErrors,
    setServerErrors,
    handleOpenAdd,
    handleOpenEdit,
    handleSave,
  } = useVendingMachineAction({ addVendingMachine, updateVendingMachine });

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus mesin ini?")) {
      const res = await deleteVendingMachine(id);
      if (res.success) {
        toast.success("Data mesin berhasil dihapus.");
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
            Vending Machine <span className="text-blue-600">List</span>
          </h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2">
            Management of Vending Machine
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
        data={vendingMachine}
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
                {((meta?.currentPage || 1) - 1) * (meta?.pageSize || 10) +
                  i +
                  1}
              </span>
            ),
          },
          {
            label: "Mesin",
            render: (item) => (
              <div className="flex flex-col">
                <b className="text-gray-900 tracking-tight leading-none">
                  {item.name}
                </b>
                <span className="text-[10px] text-blue-500 font-bold uppercase tracking-tighter mt-1">
                  Code: {item.machineCode || "-"}
                </span>
              </div>
            ),
          },
          {
            label: "Lokasi",
            render: (item) => (
              <div className="flex items-center gap-1.5 text-gray-500">
                <MapPin size={12} className="text-gray-400" />
                <span className="text-xs font-medium">
                  {item.location || "-"}
                </span>
              </div>
            ),
          },
          {
            label: "Status",
            render: (item) => (
              <span
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                  item.isActive
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {item.isActive ? "Active" : "Inactive"}
              </span>
            ),
          },
          {
            label: "Last Restock",
            render: (item) => (
              <span className="text-gray-500 text-xs font-mono">
                {item.lastRestock
                  ? new Date(item.lastRestock).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "Belum pernah"}
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
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h4 className="font-black text-gray-900 uppercase italic tracking-tight leading-none">
                  {item.name}
                </h4>
                <p className="text-[10px] font-bold text-blue-500 tracking-widest uppercase">
                  {item.machineCode}
                </p>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                  item.isActive
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {item.isActive ? "● Active" : "● Inactive"}
              </span>
            </div>

            <div className="space-y-2 border-l-4 border-gray-50 pl-4 py-1">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <MapPin size={12} />
                <span>{item.location || "Lokasi tidak diatur"}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar size={12} />
                <span>
                  Restock:{" "}
                  {item.lastRestock
                    ? new Date(item.lastRestock).toLocaleDateString("id-ID")
                    : "-"}
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1 text-yellow-500 bg-yellow-50 border-none"
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
        title={
          selectedVendingMachine
            ? "EDIT VENDING MACHINE"
            : "TAMBAH VENDING MACHINE"
        }
      >
        <form onSubmit={handleSave} className="space-y-6 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Machine Code"
              placeholder="Contoh: VM-001"
              required
              value={form.machineCode}
              error={serverErrors.MachineCode?.[0]}
              onChange={(e) => {
                setForm({ ...form, machineCode: e.target.value });
                if (serverErrors.MachineCode)
                  setServerErrors({ ...serverErrors, MachineCode: [] });
              }}
            />

            <Input
              label="Nama Mesin"
              placeholder="Contoh: Mesin Lantai 1"
              required
              value={form.name}
              error={serverErrors.Name?.[0]}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                if (serverErrors.Name)
                  setServerErrors({ ...serverErrors, Name: [] });
              }}
            />
          </div>

          <Input
            label="Lokasi Penempatan"
            placeholder="Contoh: Lobby Utama, Kantin..."
            value={form.location}
            error={serverErrors.Location?.[0]}
            onChange={(e) => {
              setForm({ ...form, location: e.target.value });
              if (serverErrors.Location)
                setServerErrors({ ...serverErrors, Location: [] });
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">
                Terakhir Restock
              </label>
              <input
                type="datetime-local"
                value={form.lastRestock ?? ""}
                onChange={(e) =>
                  setForm({ ...form, lastRestock: e.target.value })
                }
                className="w-full bg-gray-50 focus:bg-white border-2 border-transparent focus:border-blue-500 rounded-2xl px-5 py-4 text-sm font-bold outline-none transition-all text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">
                Status Aktif
              </label>
              <div className="flex items-center h-[58px] bg-gray-50 rounded-2xl px-6">
                <label className="flex items-center gap-3 cursor-pointer w-full">
                  <input
                    type="checkbox"
                    checked={form.isActive ?? false}
                    onChange={(e) =>
                      setForm({ ...form, isActive: e.target.checked })
                    }
                    className="w-5 h-5 rounded-lg accent-blue-600 cursor-pointer"
                  />
                  <span
                    className={`text-xs font-black uppercase tracking-widest ${
                      form.isActive ? "text-blue-600" : "text-gray-400"
                    }`}
                  >
                    {form.isActive ? "Active" : "Inactive"}
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-8 flex gap-4 mt-auto">
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
