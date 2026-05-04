"use client";
import {
  Plus,
  Trash2,
  AlertCircle,
  LucideEye,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";

// UI Components
import DataTable from "@/src/components/DataTable";
import Button from "@/src/components/Button";
import FormShell from "@/src/components/FormShell";
import Input from "@/src/components/Input";
import AsyncSelect from "@/src/components/AsyncSelect";
import Pagination from "@/src/components/Pagination";

// Modular Components
import VendingItemGrid from "@/src/components/VendingItemGrid";

// Hooks & Services
import { useVendingItem } from "@/src/hooks/vending-item/useVendingItem";
import { useVendingItemAction } from "@/src/hooks/vending-item/useVendingItemAction";
import { VendingMachineWithStock } from "@/src/services/vendingItemServices";

export default function VendingItemClient() {
  const {
    vendingMachines,
    machineItems,
    loading,
    error,
    meta,
    id,
    machineCode,
    setId,
    setPage,
    setPageSize,
    setSearch,
    search,
    removeItemFromMachine,
    assignItemToMachine,
    restock,
  } = useVendingItem();

  const selectedMachine = vendingMachines.find((m) => m.id === id);

  const {
    form,
    setForm,
    isModalOpen,
    setIsModalOpen,
    isSubmitting,
    serverErrors,
    handleOpenAdd,
    handleSave,
  } = useVendingItemAction({
    assignItemToMachine,
    removeItemFromMachine,
    restockItem: restock,
  });

  const handleDelete = async (targetId: number) => {
    if (
      confirm(id > 0 ? "Hapus item dari mesin?" : "Hapus data stok mesin ini?")
    ) {
      const res = await removeItemFromMachine(targetId);
      if (res.success) toast.success(res.message);
      else toast.error(res.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-3">
          {id > 0 && (
            <button
              onClick={() => setId(0)}
              className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-500"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter leading-none">
              Vending{" "}
              <span className="text-blue-600">
                {id > 0 ? "Inventory" : "Stock"}
              </span>
            </h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2">
              {id > 0
                ? `Detail Barang Mesin #${selectedMachine?.machineCode}`
                : "Ringkasan Stok Seluruh Mesin"}
            </p>
          </div>
        </div>
        <Button
          onClick={() => handleOpenAdd(0)}
          icon={<Plus size={20} />}
          className="w-full md:w-auto"
        >
          {id > 0 ? "Tambah Barang ke Mesin" : "Assign Item Baru"}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-medium">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* MAIN CONTENT */}
      {id > 0 ? (
        <VendingItemGrid
          data={machineItems}
          isLoading={loading}
          searchValue={search}
          onSearch={setSearch}
          onRestock={(itemId) => restock(itemId, 10)}
          onDelete={handleDelete}
        />
      ) : (
        <DataTable
          data={vendingMachines}
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
              render: (item: VendingMachineWithStock) => (
                <div className="flex flex-col">
                  <b className="text-gray-900 tracking-tight">{item.name}</b>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">
                    {item.machineCode}
                  </span>
                </div>
              ),
            },
            {
              label: "Ringkasan Inventaris",
              render: (item: VendingMachineWithStock) => (
                <div className="flex flex-col gap-1">
                  <span className="text-blue-600 font-black text-xs uppercase">
                    {item.totalItemTypes} Tipe Barang
                  </span>
                  <div className="text-[11px] text-gray-500 font-medium">
                    {item.totalStock} Unit • {item.totalCategories} Kategori
                  </div>
                </div>
              ),
            },
            {
              label: "Actions",
              render: (item: VendingMachineWithStock) => (
                <div className="flex gap-1 pr-4">
                  <button
                    onClick={() => setId(item.id)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl"
                    title="Lihat isi mesin"
                  >
                    <LucideEye size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ),
            },
          ]}
          renderMobileCard={(item: VendingMachineWithStock) => (
            <div className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="font-black text-gray-900 uppercase italic tracking-tight">
                    {item.machineCode}
                  </h4>
                  <p className="text-[10px] font-bold text-blue-500 uppercase">
                    {item.name}
                  </p>
                </div>
                <button
                  onClick={() => setId(item.id)}
                  className="p-2 text-blue-600 bg-blue-50 rounded-xl"
                >
                  <LucideEye size={18} />
                </button>
              </div>
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl">
                <div className="flex flex-col gap-1">
                  <span className="text-blue-600 font-black text-xs uppercase">
                    {item.totalItemTypes} Tipe
                  </span>
                  <div className="text-[11px] text-gray-500 font-medium">
                    {item.totalStock} Total Stok
                  </div>
                </div>
              </div>
              <button
                className="w-full flex justify-center items-center gap-2 bg-red-50 text-red-600 py-3 rounded-xl text-sm font-bold"
                onClick={() => handleDelete(item.id)}
              >
                <Trash2 size={16} /> Hapus Data
              </button>
            </div>
          )}
        />
      )}

      {/* PAGINATION */}
      {meta.totalPages > 1 && (
        <Pagination
          currentPage={meta.currentPage}
          totalPages={meta.totalPages}
          onPageChange={setPage}
          totalItems={meta.totalCount}
          itemsPerPage={meta.pageSize}
        />
      )}

      {/* MODAL */}
      <FormShell
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="ASSIGN ITEM KE MESIN"
      >
        <form onSubmit={handleSave} className="space-y-6 pt-2">
          <AsyncSelect
            label="Pilih Mesin"
            apiEndpoint="/api/vendingmachine"
            value={form.vendingMachineId ?? 0}
            error={serverErrors?.VendingMachineId?.[0]}
            onChange={(val) =>
              setForm({ ...form, vendingMachineId: Number(val) })
            }
          />
          <AsyncSelect
            label="Pilih Barang"
            apiEndpoint="/api/item"
            value={form.itemId ?? 0}
            error={serverErrors?.ItemId?.[0]}
            onChange={(val) => setForm({ ...form, itemId: Number(val) })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Kapasitas"
              type="number"
              value={form.capacity}
              onChange={(e) =>
                setForm({ ...form, capacity: Number(e.target.value) })
              }
            />
            <Input
              label="Stok"
              type="number"
              value={form.quantity}
              onChange={(e) =>
                setForm({ ...form, quantity: Number(e.target.value) })
              }
            />
          </div>
          <div className="pt-6 flex gap-4">
            <Button
              variant="primary"
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
            >
              Batal
            </Button>
            <Button type="submit" isLoading={isSubmitting} className="flex-1">
              Simpan
            </Button>
          </div>
        </form>
      </FormShell>
    </div>
  );
}
