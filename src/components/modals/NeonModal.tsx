import { ReactNode } from "react";

interface NeonModalProps {
  children: ReactNode;
  isActive: boolean;
  onClose: () => void;
  bgColor?: string;
  width?: string;
  height?: string;
}

const NeonModal: React.FC<NeonModalProps> = ({
  children,
  isActive,
  onClose,
  bgColor = "bg-slate-950/90",
  width = "lg:w-1/3",
  height = "h-[90vh]",
}) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 z-50 flex items-center justify-center p-2 overflow-y-auto backdrop-blur-lg ${
        isActive ? "" : "hidden"
      }`}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative overflow-y-auto mx-2 sm:mx-8 transform border border-teal-500 rounded-xl shadow-xl transition-all duration-300 ${height} ${width} ${bgColor}`}
      >
        {children}
      </div>
    </div>
  );
};

export default NeonModal;
