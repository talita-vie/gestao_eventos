import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ArrowRight,
  IdCard,
  Lock,
  Mail,
  RefreshCw,
  User,
  UserPlus,
} from "lucide-react";

import { api } from "../../../services/api";
import { useNavigate, Link } from "react-router-dom";
import { isAxiosError } from "axios";

const registerSchema = z.object({
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    cpf: z.string().min(11, "O CPF deve ser válido"),
    email: z.string().email("Digite um e-mail válido"),
    password: z.string().min(8, "A senha deve conter pelo menos 8 caracteres"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "As senhas não coincidem",
    path: ["password_confirmation"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });


  async function onSubmit(data: RegisterFormData) {
    try {
      const response = await api.post("/register", data);

      console.log(response.data);

      alert("Conta criada com sucesso!");

      navigate("/login");
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const responseData = error.response.data;
        console.log(responseData)
      
        let errorMensage = 'E-mail ou senha incorretos.';
      
        if (responseData.message) {
          errorMensage = responseData.message;
        }
      
          setError('root', { message: errorMensage });
        } else {
          setError('root', {message: 'Não foi possivel conectar ao servidor.'});
        }
    }
  }

  return (
    <div className="min-h-screen flex selection:bg-blue-100">
      {/* Left Sidebar */}
      <div className="hidden md:flex md:w-5/12 bg-blue-600 flex-col justify-center items-center p-12 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 opacity-50"></div>

        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>

        <div className="bg-white/20 p-6 rounded-2xl mb-8 backdrop-blur-sm shadow-xl border border-white/20 z-10">
          <UserPlus size={48} strokeWidth={1.5} />
        </div>

        <h1 className="text-4xl font-bold mb-4 tracking-tight z-10">
          Bem-vindo!
        </h1>

        <p className="text-lg text-blue-50/90 max-w-sm leading-relaxed z-10">
          Junte-se a nós para acessar todos os recursos exclusivos da plataforma
          SecureAuth.
        </p>
      </div>

      {/* Main */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 md:p-12 bg-slate-50 relative overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <header className="md:hidden mb-8 text-center">
            <h1 className="text-3xl font-bold text-blue-600">SecureAuth</h1>
          </header>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] p-8 md:p-10 border border-slate-100">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Crie a sua conta
              </h2>

              <p className="text-slate-500 text-sm">
                Preencha os dados abaixo para começar.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {/* Nome */}
              <div>
                <label
                  className="text-sm font-semibold text-slate-700 block mb-1.5 ml-1"
                  htmlFor="name"
                >
                  Nome Completo
                </label>

                <div className="group relative">
                  <User
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                    size={18}
                  />

                  <input
                    type="text"
                    id="name"
                    placeholder="Ex: João Silva"
                    {...register("name")}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* CPF */}
              <div>
                <label
                  className="text-sm font-semibold text-slate-700 block mb-1.5 ml-1"
                  htmlFor="cpf"
                >
                  CPF
                </label>

                <div className="group relative">
                  <IdCard
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                    size={18}
                  />

                  <input
                    type="text"
                    id="cpf"
                    placeholder="000.000.000-00"
                    {...register("cpf")}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                {errors.cpf && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.cpf.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  className="text-sm font-semibold text-slate-700 block mb-1.5 ml-1"
                  htmlFor="email"
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
                    id="email"
                    placeholder="seu@email.com"
                    {...register("email")}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Senha */}
              <div>
                <label
                  className="text-sm font-semibold text-slate-700 block mb-1.5 ml-1"
                  htmlFor="password"
                >
                  Senha
                </label>

                <div className="group relative">
                  <Lock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                    size={18}
                  />

                  <input
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    {...register("password")}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirmar senha */}
              <div>
                <label
                  className="text-sm font-semibold text-slate-700 block mb-1.5 ml-1"
                  htmlFor="password_confirmation"
                >
                  Confirmar Senha
                </label>

                <div className="group relative">
                  <RefreshCw
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                    size={18}
                  />

                  <input
                    type="password"
                    id="password_confirmation"
                    placeholder="••••••••"
                    {...register("password_confirmation")}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                {errors.password_confirmation && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password_confirmation.message}
                  </p>
                )}
              </div>

              {errors.root && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red 600 text-sm rounded-lg text-center font-medium">
                  {errors.root.message}
                </div>
              )}

              {/* Botão */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold py-3.5 rounded-xl transition-all duration-300 flex justify-center items-center gap-2 group shadow-lg shadow-blue-200 active:scale-[0.98]"
                >
                  {isSubmitting ? "Cadastrando..." : "Cadastrar"}

                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </form>

            {/* Login */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                Já tem uma conta?{" "}
                <Link
                  to="/login"
                  className="font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Faça login
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-10 flex flex-col md:flex-row justify-between items-center text-[11px] text-slate-400 px-2 space-y-4 md:space-y-0">
            <p>© 2024 SecureAuth Inc. Todos os direitos reservados.</p>

            <div className="flex gap-4">
              <a href="#" className="hover:text-blue-500 transition-colors">
                Privacidade
              </a>

              <a href="#" className="hover:text-blue-500 transition-colors">
                Termos
              </a>

              <a href="#" className="hover:text-blue-500 transition-colors">
                Suporte
              </a>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
