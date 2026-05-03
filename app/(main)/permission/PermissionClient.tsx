"use client";
import { Plus, Pencil, Trash2, Save, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import DataTable from "@/src/components/DataTable";
import Input from "@/src/components/Input";
import Button from "@/src/components/Button";
import FormShell from "@/src/components/FormShell";
import { usePermission } from "@/src/hooks/permission/usePermission";
import { UsePermissionActions } from "@/src/hooks/permission/usePermissionAction";
import AsyncSelect from "@/src/components/AsyncSelect";
import { UseItemActions } from "@/src/hooks/item/useItemAction";

export default function PermissionPage() {
  const {
    permission,
    loading,
    error,
    meta,
    setPage,
    setPageSize,
    setSearch,
    search,
    addPermission,
    updatePermission,
    deletePermission,
  } = usePermission();

  const {
    form,
    setForm,
    isModalOpen,
    setIsModalOpen,
    selectedPermission,
    isSubmitting,
    serverErrors,
    setServerErrors,
    handleOpenAdd,
    handleOpenEdit,
    handleSave,
  } = UsePermissionActions({ addPermission, updatePermission });

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus permission ini?")) {
      const res = await deletePermission(id);
      if (res.success) {
        toast.success("Data permission berhasil dihapus.");
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

      {/* ERROR ALERT */}
      {error && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-medium">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* DATATABLE */}
      <DataTable
        data={permission} // Pastikan state-nya sekarang bernama permission
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
            label: "Nama Permission",
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
                {item.permissionCategory.name ?? "-"}
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
                  {item.permissionCategoryName || "Tanpa Kategori"}
                </p>
              </div>
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

      {/* FORM MODAL */}
      <FormShell
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedPermission ? "EDIT PERMISSION" : "TAMBAH PERMISSION"}
      >
        <form onSubmit={handleSave} className="space-y-6 pt-2">
          {/* FIELD 1: NAMA PERMISSION */}
          <Input
            label="Nama Permission"
            required
            type="text"
            placeholder="Contoh: View Dashboard..."
            value={form.name}
            error={serverErrors?.Name?.[0]}
            onChange={(e) => {
              setForm({ ...form, name: e.target.value });
              if (serverErrors?.Name)
                setServerErrors({ ...serverErrors, Name: [] });
            }}
          />

          {/* FIELD 2: KATEGORI PERMISSION */}
          <AsyncSelect
            label="Kategori Permission"
            apiEndpoint="/api/permissioncategory" // Pastikan endpoint ini sesuai dengan API C# lu
            value={form.permissionCategoryId ?? 0}
            error={serverErrors?.PermissionCategoryId?.[0]}
            onChange={(val) => {
              setForm({ ...form, permissionCategoryId: Number(val) });
              if (serverErrors?.PermissionCategoryId)
                setServerErrors({ ...serverErrors, PermissionCategoryId: [] });
            }}
          />

          {/* TOMBOL AKSI */}
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
              {isSubmitting ? (
                <span className="animate-pulse">Menyimpan...</span>
              ) : (
                <>
                  <Save size={18} /> Simpan Data
                </>
              )}
            </button>
          </div>
        </form>
      </FormShell>
    </div>
  );
}
