import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { api } from "../../../services/api";

import { isAxiosError } from "axios";

import { ChevronLeft, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const forgotPasswordSchema = z.object({
  email: z.email("Digite um e-mail válido"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;


export function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordFormData) {
    try {
      await api.post("/forgot-password", data);

      alert("Link de recuperação enviado para seu e-mail.");

      reset();
    } catch (error) {
      console.error(error);

      if (isAxiosError(error) && error.response) {
        const responseData = error.response.data;

        let errorMessage = "Não foi possível enviar o link de recuperação.";

        if (responseData.errors && responseData.errors.length > 0) {
          errorMessage = responseData.errors[0];
        }

        setError("root", {
          message: errorMessage,
        });
      } else {
        setError("root", {
          message: "Erro ao conectar com o servidor.",
        });
      }
    }
  }

  return (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
    <div className="w-full max-w-md">
      <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] p-8 md:p-10 border border-slate-100">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Recuperar Senha
          </h2>

          <p className="text-slate-500 text-sm leading-relaxed">
            Digite seu e-mail e enviaremos um link para você redefinir sua senha.
          </p>
        </div>

        {/* Form */}
        <form
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Email */}
          <div>
            <label
              className="text-sm font-semibold text-slate-700 block mb-1.5 ml-1"
              htmlFor="reset-email"
            >
              E-mail
            </label>

            <div className="group relative">
              <Mail
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                size={18}
              />

              <input
                type="email"
                id="reset-email"
                placeholder="seu@email.com"
                {...register('email')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* API Error */}
          {errors.root && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3 text-center">
              {errors.root.message}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-blue-200 active:scale-[0.98]"
          >
            {isSubmitting
              ? 'Enviando...'
              : 'Enviar link de recuperação'}
          </button>

          {/* Back */}
          <div className="flex justify-center pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors group"
            >
              <ChevronLeft
                size={18}
                className="group-hover:-translate-x-0.5 transition-transform"
              />

              Voltar para o login
            </Link>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
}
