"use client"
import React, { useState } from "react";
import { Plus, Pencil, Trash2, Save, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import DataTable from "@/src/components/DataTable";
import Input from "@/src/components/Input";
import Button from "@/src/components/Button";
import FormShell from "@/src/components/FormShell";
import { PermissionSelector } from "@/src/components/PermissionSelector";
import { useRole } from "@/src/hooks/role/useRole";
import { UseRoleActions } from "@/src/hooks/role/useRoleAction";
import { roleService } from "@/src/services/roleServices";

export default function RolePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { role, loading, meta, setPage, setPageSize, refresh } = useRole(searchQuery);
  const actions = UseRoleActions(refresh);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus role ini?")) return;
    const res = await roleService.delete(id);
    if (res.success) { toast.success("Data berhasil dihapus"); refresh(); }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-2">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-blue-900 uppercase italic tracking-tighter leading-none">Role Management</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-2 pl-1">Authority Control Center</p>
          </div>
        </div>
        <Button onClick={actions.handleOpenAdd} icon={<Plus size={20} />} className="w-full md:w-auto rounded-[1.5rem] px-8 h-14 shadow-xl shadow-blue-100 transition-transform hover:scale-105 font-bold uppercase text-xs">Tambah Role</Button>
      </header>

      <main className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden mx-2">
        <DataTable
          data={role} isLoading={loading} meta={meta} onPageChange={setPage} onPageSizeChange={setPageSize}
          onSearchChange={setSearchQuery} searchValue={searchQuery}
          columns={[
            { label: "No", render: (_, i) => <span className="text-gray-400 font-mono text-xs pl-6">{((meta.currentPage - 1) * meta.pageSize) + (i + 1)}</span> },
            { label: "Role Name", render: (item) => <b className="text-gray-900 text-sm font-bold tracking-tight uppercase italic">{item.name}</b> },
            {
              label: "Permissions",
              render: (item) => {
                const count = item.permissions?.length || 0;
                return (
                  <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">
                    {count} Akses Terpilih
                  </span>
                );
              }
            },
            {
              label: "Actions", render: (item) => (
                <div className="flex gap-2 pr-6">
                  <button onClick={() => actions.handleOpenEdit(item)} className="p-3 text-blue-600 hover:bg-blue-50 rounded-2xl transition-all shadow-sm bg-white border border-gray-50"><Pencil size={16} /></button>
                  <button onClick={() => item.id && handleDelete(item.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all shadow-sm bg-white border border-gray-50"><Trash2 size={16} /></button>
                </div>
              )
            }
          ]}
          renderMobileCard={(item) => (
            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 space-y-5 shadow-sm">
              <div className="flex justify-between items-center">
                <h4 className="font-black text-blue-900 uppercase italic text-lg leading-none">{item.name}</h4>
                <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full shadow-lg shadow-blue-200">
                  <span className="text-white text-[10px] font-black italic">
                    {item.permissionIds?.length || 0}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 rounded-xl h-12 text-[10px] font-black uppercase tracking-widest" onClick={() => actions.handleOpenEdit(item)} icon={<Pencil size={14} />}>Edit</Button>
                <Button variant="danger" className="flex-1 rounded-xl h-12 text-[10px] font-black uppercase tracking-widest" onClick={() => item.id && handleDelete(item.id)} icon={<Trash2 size={14} />}>Hapus</Button>
              </div>
            </div>
          )}
        />
      </main>

      <FormShell isOpen={actions.isModalOpen} onClose={() => actions.setIsModalOpen(false)} title={actions.selectedRole ? "Edit Role" : "Tambah Role"}>
        <form onSubmit={actions.handleSave} className="flex flex-col h-[650px] overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8 custom-scrollbar">
            <Input label="Nama Role" required value={actions.form.name} error={actions.serverErrors.Name?.[0]}
              onChange={e => { actions.setForm({ ...actions.form, name: e.target.value }); actions.setServerErrors({ ...actions.serverErrors, Name: [] }) }}
            />
            <PermissionSelector selectedIds={actions.form.permissionIds} onChange={ids => actions.setForm({ ...actions.form, permissionIds: ids })} />
          </div>
          <footer className="p-6 bg-white border-t border-gray-100 flex gap-4 shadow-[0_-15px_30px_-15px_rgba(0,0,0,0.05)]">
            <Button type="button" variant="outline" className="flex-1 rounded-2xl h-12 font-bold uppercase text-[10px]" onClick={() => actions.setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" className="flex-1 rounded-2xl h-12 bg-blue-600 text-white shadow-lg shadow-blue-100 font-bold uppercase text-[10px]" icon={<Save size={18} />} isLoading={actions.isSubmitting}>Simpan Perubahan</Button>
          </footer>
        </form>
      </FormShell>
    </div>
  );
}