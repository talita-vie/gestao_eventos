// src/components/ui/forms/AddressFields.tsx
import type { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { maskCEP } from '../../../utils/masks';
import { BRAZIL_STATES } from '../../../constants/states';
import { useEffect } from 'react';

interface AddressFieldsProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  prefix?:string;
}

export function AddressFields({ register, errors, watch, setValue, prefix = '' }: AddressFieldsProps) {
  
  const cepValue = watch(`${prefix}street_zipcode`);

  useEffect(() => {
    async function fetchAddress() {
      if(!cepValue) return;

      const cleanCep = cepValue.replace(/\D/g, '');
      
      if (cleanCep.length === 8) {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json`);
          const data = await response.json();

          if (!data.erro) {
            // Usando o setValue repassado pelas props
            setValue(`${prefix}street_name`, data.logradouro, { shouldValidate: true});
            setValue(`${prefix}neighborhood`, data.bairro, { shouldValidate: true});
            setValue(`${prefix}city_name`, data.localidade, { shouldValidate: true});
            setValue(`${prefix}state`, data.uf, { shouldValidate: true});

            document.getElementById('house_number_input')?.focus();
          } else {
            console.warn('CEP não encontrado na base dos correios.');
          }
        } catch (error){
          console.error('Erro ao buscar o CEP: ', error);
        }
      }
    }
    fetchAddress();
  }, [cepValue, setValue, prefix]);

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-12 gap-6">
      <div className="col-span-1 md:col-span-4 space-y-1.5">
        <label className="text-sm font-semibold text-slate-700 ml-1">CEP *</label>
        <input
          {...register(`${prefix}street_zipcode`, {
            onChange: (e) => {
              e.target.value = maskCEP(e.target.value);
            }
          })}
          placeholder="00000-000"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
        {errors.street_zipcode && (
          <p className="text-red-500 text-xs ml-1">{errors.street_zipcode.message as string}</p>
        )}
      </div>

      <div className="col-span-1 md:col-span-8 space-y-1.5">
        <label className="text-sm font-semibold text-slate-700 ml-1">Logradouro (Rua, Av) *</label>
        <input
          {...register(`${prefix}street_name`)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
        {errors.street_name && (
          <p className="text-red-500 text-xs ml-1">{errors.street_name.message as string}</p>
        )}
      </div>

      <div className="col-span-1 md:col-span-5 space-y-1.5">
        <label className="text-sm font-semibold text-slate-700 ml-1">Bairro *</label>
        <input
          {...register(`${prefix}neighborhood`)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
        {errors.neighborhood && (
          <p className="text-red-500 text-xs ml-1">{errors.neighborhood.message as string}</p>
        )}
      </div>

      <div className="col-span-1 md:col-span-5 space-y-1.5">
        <label className="text-sm font-semibold text-slate-700 ml-1">Cidade *</label>
        <input
          {...register(`${prefix}city_name`)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
        {errors.city_name && (
          <p className="text-red-500 text-xs ml-1">{errors.city_name.message as string}</p>
        )}
      </div>

      <div className="col-span-1 md:col-span-2 space-y-1.5">
        <label className="text-sm font-semibold text-slate-700 ml-1">UF *</label>
        <select
          {...register(`${prefix}state`)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        >
          <option value="">UF</option>
          {BRAZIL_STATES.map((state) => (
            <option key={state.value} value={state.value}>
              {state.label}
            </option>
          ))}
        </select>
        {errors.state && (
          <p className="text-red-500 text-xs ml-1">{errors.state.message as string}</p>
        )}
      </div>

      
      <div className="col-span-1 md:col-span-4 space-y-1.5">
        <label className="text-sm font-semibold text-slate-700 ml-1">Número *</label>
        <input
          id="house_number_input"
          {...register(`${prefix}house_number`)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
        {errors.house_number && (
          <p className="text-red-500 text-xs ml-1">{errors.house_number.message as string}</p>
        )}
      </div>

      <div className="col-span-1 md:col-span-8 space-y-1.5">
        <label className="text-sm font-semibold text-slate-700 ml-1">Complemento</label>
        <input
          {...register(`${prefix}complement`)}
          placeholder="Ex: Apto 101, Casa B"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
      </div>

      <div className="col-span-1 md:col-span-12 space-y-1.5">
        <label className="text-sm font-semibold text-slate-700 ml-1">Ponto de Referência</label>
        <input
          {...register('reference_point')}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
      </div>
    </div>
  );
}

