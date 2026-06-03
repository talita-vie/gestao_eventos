import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { AlertTriangle } from "lucide-react";

interface PasswordFieldsProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export function PasswordFields({ register, errors }: PasswordFieldsProps) {
  return (
    <>
      <div className="p-8 space-y-6">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 ml-1">
            Senha Antiga *
          </label>
          <input
            type="password"
            {...register("old_password")}
            placeholder="Digite sua senha atual"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          {errors.old_password && (
            <p className="text-red-500 text-xs ml-1">
              {errors.old_password.message as string}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">
              Nova Senha *
            </label>
            <input
              type="password"
              {...register("new_password")}
              placeholder="Mínimo 8 caracteres"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            {errors.new_password && (
              <p className="text-red-500 text-xs ml-1">
                {errors.new_password.message as string}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">
              Confirmar Nova Senha *
            </label>
            <input
              type="password"
              {...register("confirm_password")}
              placeholder="Repita a nova senha"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            {errors.confirm_password && (
              <p className="text-red-500 text-xs ml-1">
                {errors.confirm_password.message as string}
              </p>
            )}
          </div>
        </div>
      </div>

      {errors.root && (
        <div className="px-8 pb-4">
          <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-3 border border-red-200 shadow-sm">
            <AlertTriangle size={20} className="shrink-0 mt-0.5 text-red-500" />
            <p className="text-sm font-medium">
              {errors.root.message as string}
            </p>
          </div>
        </div>
      )}
    </>
  );
}