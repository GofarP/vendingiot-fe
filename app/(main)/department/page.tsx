"use client";
import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Save, Building2 } from "lucide-react";

// Import Komponen Kita
import DataTable from "@/src/components/DataTable";
import Input from "@/src/components/Input";
import Button from "@/src/components/Button";
import FormShell from "@/src/components/FormShell";

export default function DepartmentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);

  // Simulasi Ambil Data dari API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setData([
        {
          id: 1,
          name: "Information Technology",
          description: "Maintenance server IoT dan pengembangan cloud.",
        },
        {
          id: 2,
          name: "Finance & Accounting",
          description: "Laporan audit transaksi harian dan penggajian.",
        },
        {
          id: 3,
          name: "Operational",
          description: "Restocking produk dan perbaikan fisik mesin vending.",
        },
        {
          id: 4,
          name: "Human Resource",
          description: "Manajemen data karyawan dan rekrutmen teknisi.",
        },
        {
          id: 5,
          name: "Legal & Corporate",
          description: "Pengurusan izin usaha dan kontrak kerjasama.",
        },
        {
          id: 6,
          name: "Marketing",
          description: "Strategi promosi dan analisis pasar regional.",
        },
      ]);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* HEADER HALAMAN */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase  tracking-tighter leading-none">
            Department <span className="text-blue-600">List</span>
          </h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2">
            List Of Department
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          icon={<Plus size={20} />}
          className="w-full md:w-auto"
        >
          Tambah Data
        </Button>
      </div>

      {/* THE SMART DATATABLE */}
      <DataTable
        data={data}
        isLoading={loading}
        initialItemsPerPage={5}
        columns={[
          {
            label: "No",
            render: (_, i) => (
              <span className="text-gray-400 font-mono text-xs">{i + 1}</span>
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
              <span className="text-gray-500 text-xs leading-relaxed">
                {item.description}
              </span>
            ),
          },
          {
            label: "Actions",
            render: () => (
              <div className="flex gap-1">
                <button className="p-2 text-yellow-500 hover:bg-yellow-50 rounded-xl transition-all">
                  <Pencil size={15} />
                </button>
                <button className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all">
                  <Trash2 size={15} />
                </button>
              </div>
            ),
          },
        ]}
        renderMobileCard={(item) => (
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-4">
              <h4 className="font-black text-gray-900 uppercase italic tracking-tight">
                {item.name}
              </h4>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed italic border-l-4 border-blue-100 pl-4 py-1">
              {item.description}
            </p>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1 text-yellow-500"
                icon={<Pencil size={14} />}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                className="flex-1"
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
        title="Tambah Departemen"
      >
        <div className="space-y-8 py-2">
          <Input
            label="Nama Departemen"
            placeholder="Contoh: IT Support"
            required
            description="Nama divisi yang akan muncul di sistem."
          />
          <Input
            label="Deskripsi"
            placeholder="Jelaskan fungsi departemen..."
            description="Opsional, maksimal 200 karakter."
          />

          <div className="pt-6 flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsModalOpen(false)}
            >
              Batal
            </Button>
            <Button className="flex-1" icon={<Save size={18} />}>
              Simpan Data
            </Button>
          </div>
        </div>
      </FormShell>
    </div>
  );
}
