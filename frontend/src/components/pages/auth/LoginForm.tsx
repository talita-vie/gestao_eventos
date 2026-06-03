import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { ArrowRight, Lock, Mail, LogIn, Eye, EyeOff } from "lucide-react";

import { api } from "../../../services/api";

import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

import { isAxiosError } from "axios";
import { useState } from "react";

const loginSchema = z.object({
  email: z.email("Digite um e-mail válido"),
  password: z.string().min(1, "A senha é obrigatória"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setAuthenticated } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    try {
      const response = await api.post("/login", data);

      const token = response.data.data.token;
      const user = response.data.data.user;

      if (token) {
        localStorage.setItem("@Eventos:token", token);
        localStorage.setItem("@Eventos:user", JSON.stringify(user));

        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setAuthenticated(true);
      }

      navigate("/");
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const responseData = error.response.data;

        let errorMessage = "E-mail ou senha incorretos.";

        if (responseData.errors && responseData.errors.length > 0) {
          errorMessage = responseData.errors[0];
        }

        setError("root", {
          message: errorMessage,
        });
      } else {
        setError("root", {
          message: "Não foi possível conectar ao servidor.",
        });
      }
    }
  }

  return (
    <div className="min-h-screen flex selection:bg-blue-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-5/12 bg-blue-600 flex-col justify-center items-center p-12 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 opacity-50"></div>

        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>

        <div className="bg-white/20 p-6 rounded-2xl mb-8 backdrop-blur-sm shadow-xl border border-white/20 z-10">
          <LogIn size={48} strokeWidth={1.5} />
        </div>

        <h1 className="text-4xl font-bold mb-4 tracking-tight z-10">
          Bem-vindo de volta!
        </h1>

        <p className="text-lg text-blue-50/90 max-w-sm leading-relaxed z-10">
          Faça login para acessar a plataforma e continuar gerenciando seus
          eventos.
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
                Entrar na conta
              </h2>

              <p className="text-slate-500 text-sm">
                Digite seus dados para continuar.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
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

              {/* Password */}
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
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="••••••••"
                    {...register("password")}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />

                  <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">
                    Lembrar-me
                  </span>
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              {/* API Error */}
              {errors.root && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3 text-center">
                  {errors.root.message}
                </div>
              )}

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold py-3.5 rounded-xl transition-all duration-300 flex justify-center items-center gap-2 group shadow-lg shadow-blue-200 active:scale-[0.98]"
                >
                  {isSubmitting ? "Entrando..." : "Entrar"}

                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                Não possui uma conta?{" "}
                <Link
                  to="/register"
                  className="font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Cadastre-se
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
