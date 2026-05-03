"use client";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import DataTable from "@/src/components/DataTable";
import Button from "@/src/components/Button";
import FormShell from "@/src/components/FormShell";
import Input from "@/src/components/Input";
import AsyncSelect from "@/src/components/AsyncSelect";

import { useVendingItem } from "@/src/hooks/vending-item/useVendingItem";
import { useVendingItemAction } from "@/src/hooks/vending-item/useVendingItemAction";

export default function VendingItemClient() {
  const {
    vendingItem,
    loading,
    error,
    meta,
    setPage,
    setPageSize,
    setSearch,
    search,
    removeItemFromMachine,
    assignItemToMachine,
    restock,
  } = useVendingItem();

  // 2. Ambil state form dari action hook (lempar fungsi mutasi ke dalamnya)
  const {
    form,
    setForm,
    isModalOpen,
    setIsModalOpen,
    isSubmitting,
    serverErrors,
    setServerErrors,
    handleOpenAdd,
    handleSave,
  } = useVendingItemAction({
    assignItemToMachine,
    removeItemFromMachine,
    restockItem: restock,
  });

  // 3. Fungsi hapus item dari mesin
  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus item ini dari mesin?")) {
      const res = await removeItemFromMachine(id);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter leading-none">
            Vending <span className="text-blue-600">Stock</span>
          </h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2">
            Manajemen Stok Barang di Mesin
          </p>
        </div>
        <Button
          onClick={() => handleOpenAdd(0)} 
          icon={<Plus size={20} />}
          className="w-full md:w-auto"
        >
          Assign Item Baru
        </Button>
      </div>

      {/* ERROR ALERT */}
      {error && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-medium">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* DATATABLE */}
      <DataTable
        data={vendingItem}
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
                {((meta?.currentPage || 1) - 1) * (meta?.pageSize || 10) + i + 1}
              </span>
            ),
          },
          {
            label: "Mesin & Barang",
            render: (item: any) => (
              <div className="flex flex-col">
                <b className="text-gray-900 tracking-tight">
                  {item.item?.name || `Item ID: #${item.itemId}`}
                </b>
                <span className="text-[10px] text-blue-500 font-bold uppercase tracking-tighter">
                  {item.vendingMachine?.name || `Machine ID: #${item.vendingMachineId}`}
                </span>
              </div>
            ),
          },
          {
            label: "Kapasitas Maksimal",
            render: (item: any) => (
              <span className="text-gray-700 font-bold text-sm">
                {item.capacity} PCS
              </span>
            ),
          },
          {
            label: "Stok Tersedia",
            render: (item: any) => (
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-lg text-[10px] font-black ${
                    item.quantity > (item.capacity * 0.2) // Merah jika stok di bawah 20% kapasitas
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {item.quantity} PCS
                </span>
              </div>
            ),
          },
          {
            label: "Actions",
            render: (item: any) => (
              <div className="flex gap-1 pr-4">
                <button
                  onClick={() => item.id && handleDelete(item.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  title="Hapus dari mesin"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ),
          },
        ]}
        /* TAMPILAN MOBILE CARD YANG KELUPAAN TADI */
        renderMobileCard={(item: any) => (
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h4 className="font-black text-gray-900 uppercase italic tracking-tight leading-none">
                  {item.item?.name || `Item ID: #${item.itemId}`}
                </h4>
                <p className="text-[10px] font-bold text-blue-500 tracking-widest uppercase">
                  {item.vendingMachine?.name || `Machine ID: #${item.vendingMachineId}`}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl">
              <span className="text-xs font-bold text-gray-400 uppercase">
                Stok / Kapasitas
              </span>
              <span 
                className={`text-sm font-black ${
                  item.quantity > (item.capacity * 0.2)
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {item.quantity} / {item.capacity} PCS
              </span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                className="flex-1 w-full flex justify-center items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 py-3 rounded-xl text-sm font-bold transition-all"
                onClick={() => item.id && handleDelete(item.id)}
              >
                <Trash2 size={16} /> Hapus Item
              </button>
            </div>
          </div>
        )}
      />

      {/* MODAL FORM ASSIGN ITEM */}
      <FormShell
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="ASSIGN ITEM KE MESIN"
      >
        <form onSubmit={handleSave} className="space-y-6 pt-2">
          {/* PILIH MESIN */}
          <AsyncSelect
            label="Pilih Mesin"
            required
            apiEndpoint="/api/vendingmachine" // Pastikan endpoint C# lu benar
            value={form.vendingMachineId ?? 0}
            error={serverErrors?.VendingMachineId?.[0]}
            onChange={(val) => {
              setForm({ ...form, vendingMachineId: Number(val) });
              if (serverErrors?.VendingMachineId)
                setServerErrors({ ...serverErrors, VendingMachineId: [] });
            }}
          />

          {/* PILIH BARANG */}
          <AsyncSelect
            label="Pilih Barang (Item)"
            required
            apiEndpoint="/api/item" // Pastikan endpoint C# lu benar
            value={form.itemId ?? 0}
            error={serverErrors?.ItemId?.[0]}
            onChange={(val) => {
              setForm({ ...form, itemId: Number(val) });
              if (serverErrors?.ItemId)
                setServerErrors({ ...serverErrors, ItemId: [] });
            }}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Kapasitas Maks"
              required
              type="number"
              placeholder="0"
              value={form.capacity}
              error={serverErrors?.Capacity?.[0]}
              onChange={(e) => {
                setForm({ ...form, capacity: Number(e.target.value) });
                if (serverErrors?.Capacity)
                  setServerErrors({ ...serverErrors, Capacity: [] });
              }}
            />

            <Input
              label="Stok Awal"
              required
              type="number"
              placeholder="0"
              value={form.quantity}
              error={serverErrors?.Quantity?.[0]}
              onChange={(e) => {
                setForm({ ...form, quantity: Number(e.target.value) });
                if (serverErrors?.Quantity)
                  setServerErrors({ ...serverErrors, Quantity: [] });
              }}
            />
          </div>

          {/* TOMBOL */}
          <div className="pt-6 flex gap-4 mt-auto">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl bg-blue-600 text-sm font-bold text-white flex items-center justify-center gap-2 hover:bg-blue-700 transition-all disabled:opacity-70"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Data"}
            </button>
          </div>
        </form>
      </FormShell>
    </div>
  );
}