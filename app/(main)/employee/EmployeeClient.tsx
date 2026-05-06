"use client"
import { Plus, Pencil, Trash2, Save, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { useEffect } from "react";
import DataTable from "@/src/components/DataTable";
import Input from "@/src/components/Input";
import Button from "@/src/components/Button";
import FormShell from "@/src/components/FormShell";

import { useEmployee } from "@/src/hooks/employee/useEmployee";
import { useEmployeeActions } from "@/src/hooks/employee/useEmployeeAction";
import ImageUpload from "@/src/components/ImageUpload";
import AsyncSelect from "@/src/components/AsyncSelect";

export default function EmployeePage() {
    const {
        employee,
        loading,
        error,
        meta,
        setPage,
        setPageSize,
        setSearch,
        search,
        addEmployee,
        updateEmployee,
        deleteEmployee
    } = useEmployee();

    const {
        form,
        setForm,
        isModalOpen,
        setIsModalOpen,
        selectedEmployee,
        isSubmitting,
        serverErrors,
        setServerErrors,
        handleOpenAdd,
        handleOpenEdit,
        handleSave,
    } = useEmployeeActions({ addEmployee, updateEmployee });

    const handleDelete = async (id: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus karyawan ini?")) {
            const res = await deleteEmployee(id);
            if (res.success) {
                toast.success("Data karyawan berhasil dihapus");
            } else {
                toast.error(res.message);
            }
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter leading-none">
                        Employee <span className="text-blue-600">List</span>
                    </h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2">
                        Management of employee
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
                data={employee}
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
                        label: "Employee",
                        render: (item) => (
                            <div className="flex items-center gap-3">
                                {/* Avatar/Photo Section */}
                                {item.photoUrl ? (
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_API_URL}${item.photoUrl}`}
                                        alt={item.fullName}
                                        className="w-8 h-8 rounded-full object-cover border border-gray-100"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600 uppercase">
                                        {item.fullName?.substring(0, 2)}
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <b className="text-gray-900 tracking-tight leading-none">{item.fullName}</b>
                                </div>
                            </div>
                        ),
                    },
                    {
                        label: "Email Address",
                        render: (item) => (
                            <span className="text-gray-600 text-xs font-medium">
                                {item.email}
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
                    <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-5">
                        <div className="flex items-center gap-4">
                            {/* Mobile Avatar */}
                            {item.photoUrl ? (
                                <img
                                    src={item.photoUrl}
                                    alt={item.fullName}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-50"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-sm font-black text-blue-500">
                                    {item.fullName?.substring(0, 2).toUpperCase()}
                                </div>
                            )}
                            <div className="flex flex-col">
                                <h4 className="font-black text-gray-900 uppercase italic tracking-tight leading-none">
                                    {item.fullName}
                                </h4>
                                <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">
                                    {item.email}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button
                                variant="outline"
                                className="flex-1 text-yellow-500 bg-yellow-100 border-none h-12 rounded-2xl"
                                onClick={() => handleOpenEdit(item)}
                                icon={<Pencil size={14} />}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="danger"
                                className="flex-1 h-12 rounded-2xl"
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
                title={selectedEmployee ? "Edit Employee" : "Tambah Employee"}

            >
                <form
                    onSubmit={handleSave}
                    className="relative flex flex-col h-[550px] overflow-hidden"
                >
                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 overscroll-contain custom-scrollbar">
                        <div className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 flex justify-center shadow-inner">
                            <ImageUpload
                                value={
                                    form.photo ?
                                    URL.createObjectURL(form.photo)
                                    :form.photoUrl
                                    ? `${process.env.NEXT_PUBLIC_API_URL}${form.photoUrl}`
                                    :""
                                }
                                onChange={(file) => {
                                    setForm({ ...form, photo: file });
                                    if (serverErrors?.Photo) setServerErrors({ ...serverErrors, Photo: [] });
                                }}
                                error={serverErrors?.Photo?.[0]}
                            />
                        </div>

                        <div className="grid gap-5">
                            <Input
                                label="Full Name"
                                placeholder="Masukkan nama lengkap"
                                required
                                value={form.fullName}
                                error={serverErrors?.FullName?.[0]}
                                onChange={(e) => {
                                    setForm({ ...form, fullName: e.target.value });
                                    if (serverErrors?.FullName) setServerErrors({ ...serverErrors, FullName: [] });
                                }}
                            />

                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="email@vending.com"
                                required
                                value={form.email}
                                error={serverErrors?.Email?.[0]}
                                onChange={(e) => {
                                    setForm({ ...form, email: e.target.value });
                                    if (serverErrors?.Email) setServerErrors({ ...serverErrors, Email: [] });
                                }}
                            />

                            <Input
                                label="Password"
                                type="password"
                                placeholder={selectedEmployee ? "Kosongkan jika tidak berubah" : "Minimal 6 karakter"}
                                value={form.password || ""}
                                error={serverErrors?.Password?.[0]}
                                onChange={(e) => {
                                    setForm({ ...form, password: e.target.value });
                                    if (serverErrors?.Password) setServerErrors({ ...serverErrors, Password: [] });
                                }}
                            />
                            <AsyncSelect
                                label="Employee Role"
                                apiEndpoint="/api/role"
                                value={form.roleId ?? 0}
                                initialLabel={selectedEmployee?.role?.name || ""}
                                onChange={(val) => {
                                    setForm({ ...form, roleId: String(val) });
                                    if (serverErrors?.RoleId)
                                        setServerErrors({ ...serverErrors, roleId: [] });
                                }}
                                error={serverErrors?.RoleId?.[0]}
                            />
                        </div>
                    </div>

                    <div className="flex-none px-6 py-6 bg-white border-t border-gray-100 flex gap-3 shadow-[0_-15px_30px_-15px_rgba(0,0,0,0.05)]">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 rounded-2xl h-12 font-bold uppercase tracking-wider text-[10px]"
                            disabled={isSubmitting}
                            onClick={() => setIsModalOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 rounded-2xl h-12 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 font-bold uppercase tracking-wider text-[10px]"
                            icon={<Save size={16} />}
                            isLoading={isSubmitting}
                        >
                            {selectedEmployee ? "Update" : "Simpan"}
                        </Button>
                    </div>
                </form>
            </FormShell>

        </div>
    );
}