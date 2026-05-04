import React from "react";
import { X } from "lucide-react";

export interface VendingItemDetail {
  id: number;
  vendingMachineId: number;
  quantity: number;
  capacity: number;
  price: number;
  itemName: string;
  categoryName: string;
}

interface VendingItemCardProps {
  item: VendingItemDetail;
  onRestock: (id: number) => void;
  onDelete: (id: number) => void;
}

const VendingItemCard: React.FC<VendingItemCardProps> = ({
  item,
  onRestock,
  onDelete,
}) => {
  return (
    <div className="group relative bg-white rounded-[2.5rem] border border-blue-400 p-6 shadow-sm flex flex-col items-center text-center transition-all hover:shadow-md">
      <button>
        <X size={24} strokeWidth={3} />
      </button>
      <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center overflow-hidden">
        <div className="w-full h-full bg-slate-300" />
      </div>

      <div className="space-y-1 mb-6 w-full">
        <h3 className="text-xl font-bold text-gray-900 leading-tight truncate">
          {item.itemName}
        </h3>
        <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">
          {item.categoryName}
        </p>
        <div className="pt-2">
          <p className="text-sm font-black text-blue-600">
            Rp {item.price.toLocaleString("id-ID")}
          </p>
          <p className="text-[10px] font-bold text-gray-500 uppercase">
            Stok: {item.quantity} / {item.capacity}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 w-full">
        <button
          onClick={() => onRestock(item.id)}
          className="bg-[#FFCC00] hover:bg-yellow-500 text-gray-900 py-3 rounded-2xl text-sm font-black transition-all active:scale-95"
        >
          Restock
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="bg-[#FF4D4D] hover:bg-red-600 text-white py-3 rounded-2xl text-sm font-black transition-all active:scale-95"
        >
          Delete
        </button>
      </div>
    </div>
  );
};
export default VendingItemCard;
