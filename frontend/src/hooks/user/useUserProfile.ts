import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";

const personalSchema = z.object({
  name: z.string().min(3, "O nome é obrigatório"),
  email: z.email("E-mail inválido"),
  cpf: z.string().min(11, "CPF inválido"),
  phone: z.string().optional(),
  institution: z.string().optional(),
  education_level: z.string().optional(),
});
type PersonalFormData = z.infer<typeof personalSchema>;

const addressSchema = z.object({
  street_zipcode: z.string().min(8, "CEP inválido"),
  street_name: z.string().min(3, "Rua é obrigatória"),
  house_number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, "Bairro é obrigatório"),
  city_name: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().length(2, "Use a sigla do estado (ex: MG)"),
  reference_point: z.string().optional(),
});
type AddressFormData = z.infer<typeof addressSchema>;

const passwordSchema = z.object({
    old_password: z.string().min(1, "A senha antiga é obrigatória"),
    new_password: z.string().min(8, "A nova senha deve ter no mínimo 8 caracteres"),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "As senhas não coincidem",
    path: ["confirm_password"],
  });
type PasswordFormData = z.infer<typeof passwordSchema>;

export function useUserProfile() {
    const navigate = useNavigate();

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const personalForm = useForm<PersonalFormData>({
    resolver: zodResolver(personalSchema),
  });
  const { setError, clearErrors } = personalForm;

  const addressForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await api.get("/profile/me");
        const userData = response.data.data || response.data;

        personalForm.reset({
          name: userData.name || "",
          email: userData.email || "",
          cpf: userData.cpf || "",
          phone: userData.phone || "",
          institution: userData.institution || "",
          education_level: userData.education_level || "",
        });

        addressForm.reset({
          street_zipcode: userData.address?.street_zipcode || "",
          street_name: userData.address?.street_name || "",
          house_number: userData.address?.house_number || "",
          complement: userData.address?.complement || "",
          neighborhood: userData.address?.neighborhood || "",
          city_name: userData.address?.city_name || "",
          state: userData.address?.state || "",
          reference_point: userData.address?.reference_point || "",
        });

      } catch (error) {
        console.error("Erro ao carregar perfil", error);
        alert("Não foi possível carregar seus dados.");
      } finally {
        setLoadingInitial(false);
        window.scrollTo(0, 0);
      }
    }
    fetchProfile();
  }, []);

  const onPersonalSubmit = async (data: PersonalFormData) => {
    clearErrors("root");

    try {
      const dataSubmit = {
        ...data,
        cpf: data.cpf.replace(/\D/g, ""),
      };
      await api.put("/profile/update-info", dataSubmit);
      alert("Dados pessoais atualizados com sucesso!");
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const status = error.response.status;
        const responseData = error.response.data;

        if (status === 422 && responseData.errors) {
          if (responseData.errors.email) {
            setError("email", {
              type: "manual",
              message: "Este e-mail não pode ser utilizado.",
            });
          }
          if (responseData.errors.cpf) {
            setError("cpf", {
              type: "manual",
              message: "Este cpf não pode ser utilizado.",
            });
          }

          setError("root", {
            type: "manual",
            message:
              "Alguns dados não podem ser utilizados. Verifique os campos destacados.",
          });
        } else {
          setError("root", {
            type: "manual",
            message:
              responseData.message ||
              "Erro ao atualizar. Tente novamente mais tarde.",
          });
        }
      } else {
        setError("root", {
          type: "manual",
          message: "Erro de conexão ao salvar.",
        });
      }
    }
  };

  const onAddressSubmit = async (data: AddressFormData) => {
    try {
      await api.put("/profile/update-address", data);
      alert("Endereço atualizado com sucesso!");
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        alert(error.response.data.message || "Erro ao atualizar endereço.");
      } else {
        alert("Erro de conexão ao salvar.");
      }
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    passwordForm.clearErrors("root");

    try {
      await api.patch("/profile/update-password", {
        current_password: data.old_password,
        password: data.new_password,
        password_confirmation: data.confirm_password,
      });

      alert("Senha alterada com sucesso!");
      passwordForm.reset();
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const status = error.response.status;
        const responseData = error.response.data;

        if (status === 422 && responseData.errors) {
          if (responseData.errors.current_password) {
            passwordForm.setError("old_password", {
              type: "manual",
              message:
                responseData.errors.current_password[0] ||
                "Senha atual incorreta.",
            });
          }

          if (responseData.errors.password) {
            passwordForm.setError("new_password", {
              type: "manual",
              message:
                responseData.errors.password[0] ||
                "A nova senha não cumpre os requisitos.",
            });
          }

          passwordForm.setError("root", {
            type: "manual",
            message:
              "Não foi possível alterar a senha. Verifique os campos destacados.",
          });
        } else {
          passwordForm.setError("root", {
            type: "manual",
            message:
              responseData.message ||
              "Erro ao alterar a senha. Tente novamente.",
          });
        }
      } else {
        passwordForm.setError("root", {
          type: "manual",
          message: "Erro de conexão ao salvar.",
        });
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteError("Por favor, digite sua senha para confirmar.");
      return;
    }

    setIsDeleting(true);
    setDeleteError("");

    try {
      await api.delete("/profile/delete", {
        data: { password: deletePassword },
      });

      localStorage.removeItem("@Eventos:token");
      localStorage.removeItem("@Eventos:user");
      alert("Sua conta foi excluída com sucesso.");
      navigate("/login");
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        setDeleteError(
          error.response.data.message || "Senha incorreta ou erro ao excluir.",
        );
      } else {
        setDeleteError("Erro de conexão ao tentar excluir.");
      }
      setIsDeleting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setDeletePassword("");
    setDeleteError("");
  };

  return {
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
  }
}