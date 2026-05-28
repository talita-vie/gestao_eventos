import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { api } from '../../../services/api';

// 1. O MOTOR DE VALIDAÇÃO (ZOD)
const resetSchema = z.object({
  password: z.string().min(8, 'A nova senha deve ter pelo menos 8 caracteres'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type ResetFormData = z.infer<typeof resetSchema>;

// 2. EXPORTAÇÃO CORRETA PARA O NOSSO ROTEADOR
export function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Pegamos os parâmetros vitais da URL
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  console.log(email)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema)
  });

  // 3. A COMUNICAÇÃO REAL COM O LARAVEL
  const onSubmit = async (data: ResetFormData) => {
    if (!token || !email) {
      setError('root', { message: 'Link de recuperação inválido ou expirado.' });
      return;
    }

    try {
      await api.post('/reset-password', {
        email: email,
        token: token,
        password: data.password,
        password_confirmation: data.confirmPassword // Laravel espera esse nome
      });
      
      // Se deu certo, mostramos a tela verde linda do Stitch!
      setIsSuccess(true);
      
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        setError('root', { message: error.response.data.message || 'Erro ao redefinir a senha. Tente novamente.' });
      } else {
        setError('root', { message: 'Erro de conexão com o servidor.' });
      }
    }
  };

  // TELA DE SUCESSO DO STITCH (Mantida intacta, só ajustamos a navegação)
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] p-8 md:p-10 border border-slate-100 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
              <CheckCircle2 className="text-green-500" size={40} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Sucesso!</h2>
          <p className="text-slate-500 text-sm mb-8">Sua senha foi redefinida com sucesso. Você já pode acessar sua conta.</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-blue-200 active:scale-[0.98] cursor-pointer"
          >
            Ir para o Login
          </button>
        </div>
      </div>
    );
  }

  // TELA DO FORMULÁRIO
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] p-8 md:p-10 border border-slate-100">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Nova Senha
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Crie uma nova senha segura para a conta:<br/>
              <span className="font-semibold text-blue-600">{email}</span>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            
            {/* Input Nova Senha */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 block ml-1">
                Nova Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className={`w-full bg-slate-50 border ${errors.password ? 'border-red-400' : 'border-slate-200'} rounded-xl px-4 py-3 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1 ml-1">{errors.password.message}</p>}
            </div>

            {/* Input Confirmar Senha */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 block ml-1">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                  className={`w-full bg-slate-50 border ${errors.confirmPassword ? 'border-red-400' : 'border-slate-200'} rounded-xl px-4 py-3 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono`}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1 ml-1">{errors.confirmPassword.message}</p>}
            </div>

            {/* CAIXA DE ERRO DA API (Root Error) */}
            {errors.root && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center font-medium">
                {errors.root.message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-blue-200 active:scale-[0.98] cursor-pointer"
            >
              {isSubmitting ? 'Redefinindo...' : 'Redefinir Senha'}
            </button>
            
            <div className="text-center mt-4">
              <Link to="/login" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
                Voltar para o Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}