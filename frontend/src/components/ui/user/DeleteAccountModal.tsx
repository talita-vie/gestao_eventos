import { AlertTriangle, X } from "lucide-react";

interface DeleteAccountModalProps {
  isOpen: boolean;
  isDeleting: boolean;
  deletePassword: string;
  deleteError: string;
  onPasswordChange: (value: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteAccountModal({
  isOpen,
  isDeleting,
  deletePassword,
  deleteError,
  onPasswordChange,
  onConfirm,
  onClose,
}: DeleteAccountModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
            <AlertTriangle size={32} />
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <h3 className="text-2xl font-bold text-slate-800 mb-2">Excluir Conta?</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          Tem certeza absoluta que deseja excluir sua conta? Você perderá acesso
          imediato a todas as suas inscrições e certificados.
        </p>

        <div className="mb-8 space-y-2">
          <label className="text-sm font-semibold text-slate-700 ml-1">
            Digite sua senha para confirmar *
          </label>
          <input
            type="password"
            value={deletePassword}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="Sua senha atual"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
          />
          {deleteError && (
            <p className="text-red-500 text-sm font-medium ml-1 mt-1">{deleteError}</p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 py-3.5 rounded-xl font-bold text-slate-600 bg-white border-2 border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-3.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95 flex justify-center items-center cursor-pointer disabled:opacity-70"
          >
            {isDeleting ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Sim, excluir"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}