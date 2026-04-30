"use client"
import { Plus, Pencil, Trash2, Save, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { useEffect } from "react";
import DataTable from "@/src/components/DataTable";
import Input from "@/src/components/Input";
import Button from "@/src/components/Button";
import FormShell from "@/src/components/FormShell";
import { useItem } from "@/src/hooks/item/useItem";
import { UseItemActions } from "@/src/hooks/item/useItemAction";
import AsyncSelect from "@/src/components/AsyncSelect";


export default function ItemPage() {
    const {
        item,
        loading,
        error,
        meta,
        setPage,
        setPageSize,
        setSearch,
        search,
        addItem,
        updateItem,
        deleteItem,
    } = useItem();

    const {
        form,
        setForm,
        isModalOpen,
        setIsModalOpen,
        selectedItem,
        isSubmitting,
        serverErrors,
        setServerErrors,
        handleOpenAdd,
        handleOpenEdit,
        handleSave,
    } = UseItemActions({ addItem, updateItem });

    const handleDelete = async (id: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus category ini?")) {
            const res = await deleteItem(id);
            if (res.success) {
                toast.success("Data category berhasil dihapus.");
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
                        Item <span className="text-blue-600">List</span>
                    </h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2">
                        Management of item
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
                data={item} // Pastikan variabel 'item' adalah array hasil fetch dari backend
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
                                {/* Logika penomoran dinamis berdasarkan pagination */}
                                {((meta?.currentPage || 1) - 1) * (meta?.pageSize || 10) + i + 1}
                            </span>
                        ),
                    },
                    {
                        label: "Nama Barang",
                        render: (item) => (
                            <div className="flex flex-col">
                                <b className="text-gray-900 tracking-tight">{item.name}</b>
                                <span className="text-[10px] text-blue-500 font-bold uppercase tracking-tighter">
                                    ID: #{item.id}
                                </span>
                            </div>
                        ),
                    },
                    {
                        label: "Kategori",
                        render: (item) => (
                            <span className="text-gray-500 text-xs font-medium">
                                {/* Perbaikan: Menghapus backtick yang terselip */}
                                {item.itemCategoryName ?? "-"}
                            </span>
                        ),
                    },
                    {
                        label: "Harga",
                        render: (item) => (
                            <span className="text-gray-700 font-bold text-sm">
                                Rp {item.price?.toLocaleString('id-ID') || "0"}
                            </span>
                        ),
                    },
                    {
                        label: "Stok",
                        render: (item) => (
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded-lg text-[10px] font-black ${(item.quantity || 0) > 10
                                    ? 'bg-green-100 text-green-600'
                                    : 'bg-red-100 text-red-600'
                                    }`}>
                                    {item.quantity || 0} PCS
                                </span>
                            </div>
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
                                    {item.itemCategoryName || 'Tanpa Kategori'}
                                </p>
                            </div>
                            <span className="text-sm font-black text-gray-900">
                                Rp {item.price?.toLocaleString('id-ID')}
                            </span>
                        </div>

                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl">
                            <span className="text-xs font-bold text-gray-400 uppercase">Stok Tersedia</span>
                            <span className="text-sm font-black text-gray-700">{item.quantity} PCS</span>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button
                                variant="outline"
                                className="flex-1 text-yellow-500 bg-yellow-100 border-none"
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
                title={selectedItem ? "EDIT ITEM" : "TAMBAH ITEM"}
            >
                <form onSubmit={handleSave} className="space-y-6 pt-2">
                    {/* FIELD 1: NAMA ITEM */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 flex items-center gap-1">
                            Nama Barang <span className="text-red-500">*</span>
                        </label>
                        <div>
                            <input
                                type="text"
                                
                                placeholder="Contoh: Pocari Sweat 500ml..."
                                value={form.name}
                                onChange={(e) => {
                                    setForm({ ...form, name: e.target.value });
                                    if (serverErrors?.Name) setServerErrors({ ...serverErrors, Name: [] });
                                }}
                                className={`w-full bg-gray-50 focus:bg-white rounded-2xl px-5 py-4 text-sm font-bold outline-none transition-all border-2 ${serverErrors?.Name ? 'border-red-300 focus:border-red-500' : 'border-transparent focus:border-blue-500'
                                    }`}
                            />
                            {serverErrors?.Name && (
                                <p className="text-[10px] text-red-500 font-bold ml-4 mt-2 italic">{serverErrors.Name[0]}</p>
                            )}
                        </div>
                    </div>

                    <AsyncSelect
                        label="Kategori Barang"
                        apiEndpoint="/api/itemcategory"
                        value={form.itemCategoryId ?? 0}
                        onChange={(val) => {
                            setForm({ ...form, itemCategoryId: Number(val) });
                            if (serverErrors?.ItemCategoryId) setServerErrors({ ...serverErrors, ItemCategoryId: [] });
                        }}
                        error={serverErrors?.ItemCategoryId?.[0]}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        {/* FIELD 3: PRICE */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">
                                Harga (Rp)
                            </label>
                            <input
                                type="number"
                                placeholder="0"
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                                className="w-full bg-gray-50 focus:bg-white border-2 border-transparent focus:border-blue-500 rounded-2xl px-5 py-4 text-sm font-bold outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">
                                Stok/Qty
                            </label>
                            <input
                                type="number"
                                placeholder="0"
                                value={form.quantity}
                                onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                                className="w-full bg-gray-50 focus:bg-white border-2 border-transparent focus:border-blue-500 rounded-2xl px-5 py-4 text-sm font-bold outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* TOMBOL AKSI */}
                    <div className="pt-8 flex gap-4 mt-auto">
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 py-4 rounded-2xl border-2 border-gray-100 text-[10px] font-black text-gray-400 hover:bg-gray-50 transition-all uppercase tracking-widest disabled:opacity-50"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-4 rounded-2xl bg-blue-600 text-[10px] font-black text-white shadow-xl shadow-blue-100 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all uppercase tracking-widest disabled:opacity-70"
                        >
                            {isSubmitting ? (
                                <span className="animate-pulse">Menyimpan...</span>
                            ) : (
                                <>
                                    <Save size={14} /> Simpan Data
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </FormShell>
        </div>
    );

}
