import {
  User,
  MapPin,
  AlertTriangle,
  Save,
  Trash2,
  Key,
} from "lucide-react";
import { AddressFields } from "../../ui/address/AddressFields";
import { PersonalFields } from "../../ui/user/PersonalFields";
import { PasswordFields } from "../../ui/user/PasswordFields";
import { DeleteAccountModal } from "../../ui/user/DeleteAccountModal";
import { useUserProfile } from "../../../hooks/user/useUserProfile";

export function UserProfile() {
  const {
    personalForm,
    addressForm,
    passwordForm,
    loadingInitial,
    isModalOpen,
    isDeleting,
    deletePassword,
    deleteError,
    setIsModalOpen,
    setDeletePassword,
    handleDeleteAccount,
    handleCloseModal,
    onPersonalSubmit,
    onPasswordSubmit,
    onAddressSubmit
  } = useUserProfile();

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
          <p className="text-slate-500 mt-1">
            Gerencie suas informações pessoais, endereço e segurança.
          </p>
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

          <PersonalFields
            register={personalForm.register}
            errors={personalForm.formState.errors}
          />

          <div className="bg-slate-50/50 px-8 py-5 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={personalForm.formState.isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2 cursor-pointer"
            >
              {personalForm.formState.isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save size={18} /> Salvar Dados Pessoais
                </>
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

          <PasswordFields
            register={passwordForm.register}
            errors={passwordForm.formState.errors}
          />

          <div className="bg-slate-50/50 px-8 py-5 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={passwordForm.formState.isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2 cursor-pointer"
            >
              {passwordForm.formState.isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save size={18} /> Atualizar Senha
                </>
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
                <>
                  <Save size={18} /> Salvar Endereço
                </>
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
              Ao deletar sua conta, todos os seus eventos, inscrições e dados
              pessoais serão apagados permanentemente. Esta ação não pode ser
              desfeita.
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

      <DeleteAccountModal
        isOpen={isModalOpen}
        isDeleting={isDeleting}
        deletePassword={deletePassword}
        deleteError={deleteError}
        onPasswordChange={setDeletePassword}
        onConfirm={handleDeleteAccount}
        onClose={handleCloseModal}
      />
    </div>
  );
}
