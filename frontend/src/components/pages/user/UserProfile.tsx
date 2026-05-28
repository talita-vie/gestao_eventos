import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../../../services/api';
import { User, MapPin, AlertTriangle, Save, Trash2, X, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { educationLevelOptions } from '../../../types/enums';
import { maskCPF, maskPhone } from '../../../utils/masks';
import { AddressFields } from '../../ui/address/AddressFields';

// ==========================================
// 1. SCHEMAS DE VALIDAÇÃO (ZOD)
// ==========================================
const personalSchema = z.object({
  name: z.string().min(3, 'O nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  cpf: z.string().min(11, 'CPF inválido'),
  phone: z.string().optional(),
  institution: z.string().optional(),
  education_level: z.string().optional(),
});
type PersonalFormData = z.infer<typeof personalSchema>;

const addressSchema = z.object({
  street_zipcode: z.string().min(8, 'CEP inválido'),
  street_name: z.string().min(3, 'Rua é obrigatória'),
  house_number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro é obrigatório'),
  city_name: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Use a sigla do estado (ex: MG)'),
  reference_point: z.string().optional(),
});
type AddressFormData = z.infer<typeof addressSchema>;

const passwordSchema = z.object({
  old_password: z.string().min(1, 'A senha antiga é obrigatória'),
  new_password: z.string().min(8, 'A nova senha deve ter no mínimo 8 caracteres'),
  confirm_password: z.string()
}).refine((data) => data.new_password === data.confirm_password, {
  message: "As senhas não coincidem",
  path: ["confirm_password"],
});
type PasswordFormData = z.infer<typeof passwordSchema>;

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export function UserProfile() {
  const navigate = useNavigate();
 
  const [loadingInitial, setLoadingInitial] = useState(true);
 
  // Estados do Modal de Exclusão
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');

  // Instâncias de formulário separadas
  const personalForm = useForm<PersonalFormData>({ resolver: zodResolver(personalSchema) });
  const { setError, clearErrors } = personalForm;

  const addressForm = useForm<AddressFormData>({ resolver: zodResolver(addressSchema) });
  const passwordForm = useForm<PasswordFormData>({ resolver: zodResolver(passwordSchema) });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await api.get('/profile/me');
        const userData = response.data.data || response.data;
       
        personalForm.reset({
          name: userData.name || '',
          email: userData.email || '',
          cpf: userData.cpf || '',
          phone: userData.phone || '',
          institution: userData.institution || '',
          education_level: userData.education_level || '',
        });

        addressForm.reset({
          street_zipcode: userData.address?.street_zipcode || '',
          street_name: userData.address?.street_name || '',
          house_number: userData.address?.house_number || '',
          complement: userData.address?.complement || '',
          neighborhood: userData.address?.neighborhood || '',
          city_name: userData.address?.city_name || '',
          state: userData.address?.state || '',
          reference_point: userData.address?.reference_point || '',
        });
      } catch (error) {
        console.error('Erro ao carregar perfil', error);
        alert('Não foi possível carregar seus dados.');
      } finally {
        setLoadingInitial(false);
      }
    }
    fetchProfile();
  }, [personalForm, addressForm]);

  const onPersonalSubmit = async (data: PersonalFormData) => {
    clearErrors('root');

    try {
      const dataSubmit = {
        ...data,
        cpf: data.cpf.replace(/\D/g, '')
      }
      await api.put('/profile/update-info', dataSubmit);
      alert('Dados pessoais atualizados com sucesso!');
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const status = error.response.status;
        const responseData = error.response.data;

        if (status === 422 && responseData.errors) {
          if (responseData.errors.email) {
            setError('email', {type: 'manual', message: 'Este e-mail não pode ser utilizado.'})
          }
          if (responseData.errors.cpf) {
            setError('cpf', {type: 'manual', message: 'Este cpf não pode ser utilizado.'})
          }

          setError('root', {
            type: 'manual',
            message: 'Alguns dados não podem ser utilizados. Verifique os campos destacados.'
          });
        } else {
          setError('root', {
            type: 'manual',
            message: responseData.message || 'Erro ao atualizar. Tente novamente mais tarde.'
          });
        }
      } else {
        setError('root', {
            type: 'manual',
            message:'Erro de conexão ao salvar.'
          });
      }
    }
  };

  const onAddressSubmit = async (data: AddressFormData) => {
    try {
      await api.put('/profile/update-address', data);
      alert('Endereço atualizado com sucesso!');
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        alert(error.response.data.message || 'Erro ao atualizar endereço.');
      } else {
        alert('Erro de conexão ao salvar.');
      }
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    passwordForm.clearErrors('root');

    try {
      await api.patch('/profile/update-password', {
        current_password: data.old_password,
        password: data.new_password,
        password_confirmation: data.confirm_password
      });

      alert('Senha alterada com sucesso!');
      passwordForm.reset();
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const status = error.response.status;
        const responseData = error.response.data;

        if (status === 422 && responseData.errors) {
         
          if (responseData.errors.current_password) {
            passwordForm.setError('old_password', {
              type: 'manual',
              message: responseData.errors.current_password[0] || 'Senha atual incorreta.'
            });
          }
 
          if (responseData.errors.password) {
            passwordForm.setError('new_password', {
              type: 'manual',
              message: responseData.errors.password[0] || 'A nova senha não cumpre os requisitos.'
            });
          }

          passwordForm.setError('root', {
            type: 'manual',
            message: 'Não foi possível alterar a senha. Verifique os campos destacados.'
          });

        } else {
          passwordForm.setError('root', {
            type: 'manual',
            message: responseData.message || 'Erro ao alterar a senha. Tente novamente.'
          });
        }
      } else {
        passwordForm.setError('root', { type: 'manual', message: 'Erro de conexão ao salvar.' });
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteError('Por favor, digite sua senha para confirmar.');
      return;
    }

    setIsDeleting(true);
    setDeleteError('');

    try {
      await api.delete('/profile/delete', {
        data: { password: deletePassword }
      });
     
      localStorage.removeItem('@Eventos:token');
      localStorage.removeItem('@Eventos:user');
      alert('Sua conta foi excluída com sucesso.');
      navigate('/login');
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        setDeleteError(error.response.data.message || 'Senha incorreta ou erro ao excluir.');
      } else {
        setDeleteError('Erro de conexão ao tentar excluir.');
      }
      setIsDeleting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setDeletePassword('');
    setDeleteError('');
  };

  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans pb-20">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Meu Perfil</h1>
          <p className="text-slate-500 mt-1">Gerencie suas informações pessoais, endereço e segurança.</p>
        </div>

        <form 
          onSubmit={personalForm.handleSubmit(onPersonalSubmit)} 
          className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
        >
          <div className="bg-slate-50 px-8 py-5 border-b border-slate-100 flex items-center gap-3">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
              <User size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Dados Pessoais</h2>
          </div>
          
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Nome Completo *</label>
              <input {...personalForm.register('name')} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              {personalForm.formState.errors.name && <p className="text-red-500 text-xs ml-1">{personalForm.formState.errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">E-mail *</label>
              <input {...personalForm.register('email')} type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              {personalForm.formState.errors.email && <p className="text-red-500 text-xs ml-1">{personalForm.formState.errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">CPF *</label>
              <input {...personalForm.register('cpf', {
                onChange: (e) => {
                  e.target.value = maskCPF(e.target.value);
                }
              })}
              disabled
              placeholder='000.000.000-00'
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              {personalForm.formState.errors.cpf && <p className="text-red-500 text-xs ml-1">{personalForm.formState.errors.cpf.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Telefone</label>
              <input {...personalForm.register('phone', {
                onChange: (e) => {
                  e.target.value = maskPhone(e.target.value);
                }
              })}
               placeholder="(00) 00000-0000" 
               className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Instituição</label>
              <input {...personalForm.register('institution')} placeholder="Ex: Universidade XYZ" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Nível de Escolaridade
              </label>

              <select
                {...personalForm.register('education_level')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">
                  Selecione um nível
                </option>

                {educationLevelOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

          </div>
            {personalForm.formState.errors.root && (
              <div className="px-8 pb-4">
                <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-3 border border-red-200 shodow-sm">
                  <AlertTriangle size={20} className='shrink-0 mt-0.5 text-red-500' />
                  <p className="text-sm font-medium">
                    {personalForm.formState.errors.root.message}
                  </p>
                </div>
              </div>
            )}

          <div className="bg-slate-50/50 px-8 py-5 border-t border-slate-100 flex justify-end">
            <button 
              type="submit" 
              disabled={personalForm.formState.isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2 cursor-pointer"
            >
              {personalForm.formState.isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <><Save size={18} /> Salvar Dados Pessoais</>
              )}
            </button>
          </div>
        </form>

        <form 
          onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
          className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
        >
          <div className="bg-slate-50 px-8 py-5 border-b border-slate-100 flex items-center gap-3">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
              <Key size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Alterar Senha</h2>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Senha Antiga *</label>
              <input 
                type="password" 
                {...passwordForm.register('old_password')} 
                placeholder="Digite sua senha atual"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
              />
              {passwordForm.formState.errors.old_password && (
                <p className="text-red-500 text-xs ml-1">{passwordForm.formState.errors.old_password.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Nova Senha *</label>
                <input 
                  type="password" 
                  {...passwordForm.register('new_password')} 
                  placeholder="Mínimo 8 caracteres"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                />
                {passwordForm.formState.errors.new_password && (
                  <p className="text-red-500 text-xs ml-1">{passwordForm.formState.errors.new_password.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Confirmar Nova Senha *</label>
                <input 
                  type="password" 
                  {...passwordForm.register('confirm_password')} 
                  placeholder="Repita a nova senha"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                />
                {passwordForm.formState.errors.confirm_password && (
                  <p className="text-red-500 text-xs ml-1">{passwordForm.formState.errors.confirm_password.message}</p>
                )}
              </div>
            </div>
          </div>

          {passwordForm.formState.errors.root && (
              <div className="px-8 pb-4">
                <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-3 border border-red-200 shodow-sm">
                  <AlertTriangle size={20} className='shrink-0 mt-0.5 text-red-500' />
                  <p className="text-sm font-medium">
                    {passwordForm.formState.errors.root.message}
                  </p>
                </div>
              </div>
            )}

          <div className="bg-slate-50/50 px-8 py-5 border-t border-slate-100 flex justify-end">
            <button 
              type="submit" 
              disabled={passwordForm.formState.isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2 cursor-pointer"
            >
              {passwordForm.formState.isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <><Save size={18} /> Atualizar Senha</>
              )}
            </button>
          </div>
        </form>

        <form 
          onSubmit={addressForm.handleSubmit(onAddressSubmit)}
          className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
        >
          <div className="bg-slate-50 px-8 py-5 border-b border-slate-100 flex items-center gap-3">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
              <MapPin size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Endereço</h2>
          </div>
          
          <AddressFields
          register={addressForm.register}
          errors={addressForm.formState.errors} 
          watch={addressForm.watch}
          setValue={addressForm.setValue}
          />

          <div className="bg-slate-50/50 px-8 py-5 border-t border-slate-100 flex justify-end">
            <button 
              type="submit" 
              disabled={addressForm.formState.isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2 cursor-pointer"
            >
              {addressForm.formState.isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <><Save size={18} /> Salvar Endereço</>
              )}
            </button>
          </div>
        </form>

        <hr className="my-12 border-slate-200" />

        <div className="bg-red-50/50 rounded-3xl border border-red-100 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-red-600 flex items-center gap-2 mb-1">
              <AlertTriangle size={20} /> Zona de Perigo
            </h3>
            <p className="text-red-800/70 text-sm">
              Ao deletar sua conta, todos os seus eventos, inscrições e dados pessoais serão apagados permanentemente. Esta ação não pode ser desfeita.
            </p>
          </div>
          <button 
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="shrink-0 bg-white border-2 border-red-200 text-red-600 hover:bg-red-600 hover:text-white font-bold py-3 px-6 rounded-xl transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Trash2 size={18} />
            Excluir minha conta
          </button>
        </div>

      </div>

      {/* ========================================== */}
      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO           */}
      {/* ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                <AlertTriangle size={32} />
              </div>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>
            
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Excluir Conta?</h3>
            <p className="text-slate-600 mb-6 leading-relaxed text-sm">
              Tem certeza absoluta que deseja excluir sua conta? Você perderá acesso imediato a todas as suas inscrições e certificados.
            </p>

            <div className="mb-8 space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Digite sua senha para confirmar *
              </label>
              <input 
                type="password" 
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Sua senha atual"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
              />
              {deleteError && (
                <p className="text-red-500 text-sm font-medium ml-1 mt-1">{deleteError}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={handleCloseModal} 
                disabled={isDeleting}
                className="flex-1 py-3.5 rounded-xl font-bold text-slate-600 bg-white border-2 border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                onClick={handleDeleteAccount} 
                disabled={isDeleting}
                className="flex-1 py-3.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95 flex justify-center items-center cursor-pointer disabled:opacity-70"
              >
                {isDeleting ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Sim, excluir'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}