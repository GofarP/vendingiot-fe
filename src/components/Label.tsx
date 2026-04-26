interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  description?: string; // Teks tambahan di bawah label
  className?: string;
}

export default function Label({ children, htmlFor, required, description, className = "" }: LabelProps) {
  return (
    <div className={`flex flex-col gap-0.5 mb-1 ${className}`}>
      <label 
        htmlFor={htmlFor}
        className="text-[13px] font-bold text-gray-800 flex items-center gap-1 tracking-wide"
      >
        {children}
        {required && <span className="text-red-500" title="Wajib diisi">*</span>}
      </label>
      
      {description && (
        <span className="text-[11px] text-gray-400 font-medium leading-tight">
          {description}
        </span>
      )}
    </div>
  );
}