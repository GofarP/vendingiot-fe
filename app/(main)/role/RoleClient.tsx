"use client";
import React from "react";
import { Save } from "lucide-react";
import FormShell from "@/src/components/FormShell";
import Input from "@/src/components/Input";
import Button from "@/src/components/Button";
import { UseRoleActions } from "@/src/hooks/role/useRoleAction";
import { PermissionGroup } from "@/src/services/roleServices";

// Mock Data (Ganti dengan data dari API lu nanti)
const mockPermissions: PermissionGroup[] = [
  {
    Category: "Management",
    Permissions: [
      { Id: 1, Name: "View Dashboard", Category: "Management" },
      { Id: 2, Name: "Manage Users", Category: "Management" },
    ],
  },
  {
    Category: "Vending Machine",
    Permissions: [
      { Id: 3, Name: "Assign Items", Category: "Vending Machine" },
      { Id: 4, Name: "Restock Machine", Category: "Vending Machine" },
    ],
  },
];

export default function RoleForm({ addRole, updateRole }: any) {
  const {
    form,
    isModalOpen,
    selectedRole,
    isSubmitting,
    serverErrors,
    setForm,
    setIsModalOpen,
    handleOpenAdd,
    handleOpenEdit,
    handleTogglePermission,
    handleSelectAllCategory,
    handleSave,
    setServerErrors,
  } = UseRoleActions({ addRole, updateRole });

  return (
    <FormShell
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title={selectedRole ? "EDIT ROLE" : "TAMBAH ROLE"}
    >
      <form
        onSubmit={handleSave}
        className="relative flex flex-col h-[600px] overflow-hidden"
      >
        {/* AREA SCROLLABLE */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 custom-scrollbar">
          <Input
            label="Nama Role"
            placeholder="Contoh: Super Admin, Operator..."
            required
            value={form.Name}
            error={serverErrors?.Name?.[0]}
            onChange={(e) => {
              setForm({ ...form, Name: e.target.value });
              if (serverErrors?.Name)
                setServerErrors({ ...serverErrors, Name: [] });
            }}
          />

          <div className="space-y-4">
            <h3 className="text-sm font-black text-blue-900 italic uppercase tracking-widest">
              Assign Permissions
            </h3>

            <div className="grid gap-6">
              {mockPermissions.map((group) => {
                const categoryIds = group.Permissions.map((p) => p.Id);
                const isAllSelected = categoryIds.every((id) =>
                  form.PermissionIds.includes(id),
                );

                return (
                  <div
                    key={group.Category}
                    className="bg-gray-50/50 rounded-[2.5rem] border border-gray-100 overflow-hidden"
                  >
                    <div className="px-6 py-4 bg-gray-100/50 flex justify-between items-center border-b border-gray-100">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                        {group.Category}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleSelectAllCategory(categoryIds, !isAllSelected)
                        }
                        className={`text-[9px] font-bold px-3 py-1 rounded-full transition-all ${
                          isAllSelected
                            ? "bg-blue-600 text-white"
                            : "bg-white text-blue-600 border border-blue-100"
                        }`}
                      >
                        {isAllSelected ? "Deselect All" : "Select All"}
                      </button>
                    </div>

                    <div className="p-4 grid grid-cols-1 gap-2">
                      {group.Permissions.map((perm) => (
                        <label
                          key={perm.Id}
                          className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white transition-all cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            className="w-5 h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={form.PermissionIds.includes(perm.Id)}
                            onChange={() => handleTogglePermission(perm.Id)}
                          />
                          <span className="text-sm font-medium text-gray-600 group-hover:text-blue-900">
                            {perm.Name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            {serverErrors?.PermissionIds && (
              <p className="text-xs text-red-500 font-bold mt-2">
                {serverErrors.PermissionIds[0]}
              </p>
            )}
          </div>
        </div>

        {/* STICKY FOOTER */}
        <div className="flex-none px-6 py-8 bg-white border-t border-gray-100 flex gap-4 shadow-[0_-15px_30px_-15px_rgba(0,0,0,0.05)]">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-2xl h-14 font-bold uppercase tracking-wider text-[10px]"
            disabled={isSubmitting}
            onClick={() => setIsModalOpen(false)}
          >
            Batal
          </Button>
          <Button
            type="submit"
            className="flex-1 rounded-2xl h-14 bg-blue-600 shadow-lg shadow-blue-100 font-bold uppercase tracking-wider text-[10px]"
            isLoading={isSubmitting}
            icon={<Save size={18} />}
          >
            Simpan Role
          </Button>
        </div>
      </form>
    </FormShell>
  );
}
