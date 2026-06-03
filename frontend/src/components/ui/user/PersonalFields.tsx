import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { maskCPF, maskPhone } from "../../../utils/masks";
import { educationLevelOptions } from "../../../types/enums";

interface PersonalFieldsProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export function PersonalFields({ register, errors }: PersonalFieldsProps) {
  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700 ml-1">Nome Completo *</label>
        <input
          {...register("name")}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
        {errors.name && (
          <p className="text-red-500 text-xs ml-1">{errors.name.message as string}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700 ml-1">E-mail *</label>
        <input
          {...register("email")}
          type="email"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
        {errors.email && (
          <p className="text-red-500 text-xs ml-1">{errors.email.message as string}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700 ml-1">CPF *</label>
        <input
          {...register("cpf", {
            onChange: (e) => { e.target.value = maskCPF(e.target.value); }
          })}
          disabled
          placeholder="000.000.000-00"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
        {errors.cpf && (
          <p className="text-red-500 text-xs ml-1">{errors.cpf.message as string}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700 ml-1">Telefone</label>
        <input
          {...register("phone", {
            onChange: (e) => { e.target.value = maskPhone(e.target.value); }
          })}
          placeholder="(00) 00000-0000"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700 ml-1">Instituição</label>
        <input
          {...register("institution")}
          placeholder="Ex: Universidade XYZ"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700 ml-1">Nível de Escolaridade</label>
        <select
          {...register("education_level")}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        >
          <option value="">Selecione um nível</option>
          {educationLevelOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {errors.root && (
        <div className="col-span-2 bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
          <p className="text-sm font-medium">{errors.root.message as string}</p>
        </div>
      )}
    </div>
  );
}