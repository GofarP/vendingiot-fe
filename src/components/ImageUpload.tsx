import React, { useState, useRef } from "react";
import { Camera, X, UploadCloud } from "lucide-react";

interface ImageUploadProps {
  value?: string; // Untuk menampilkan foto lama (URL)
  onChange: (file: File | null) => void;
  error?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, error }) => {
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onChange(file);
    }
  };

  const handleClear = () => {
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 w-full">
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative group cursor-pointer
          w-32 h-32 md:w-40 md:h-40
          rounded-[2.5rem] border-2 border-dashed
          transition-all duration-300 overflow-hidden
          flex items-center justify-center
          ${preview ? "border-blue-400" : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"}
          ${error ? "border-red-400 bg-red-50" : ""}
        `}
      >
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="text-white" size={24} />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            <UploadCloud size={32} className="mb-2 opacity-50" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Pilih Foto</span>
          </div>
        )}
      </div>

      {preview && (
        <button
          type="button"
          onClick={handleClear}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-red-500 hover:text-red-600 transition-colors"
        >
          <X size={14} /> Hapus Foto
        </button>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {error && <p className="text-[10px] font-bold text-red-500 uppercase italic">{error}</p>}
    </div>
  );
};

export default ImageUpload;