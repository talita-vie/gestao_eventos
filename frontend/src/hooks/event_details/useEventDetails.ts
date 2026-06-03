import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { isAxiosError } from 'axios';
import type { Event } from '../../types/Event';
import type { StatusEvent } from '../../types/enums';

export type EventDetailsModalType = 'subscribe' | 'unsubscribe' | 'delete' | 'cancel_event' | 'restore' | 'edit_banner' | null;

const statusLabels: Record<StatusEvent, string> = {
  draft: 'Rascunho',
  published: 'Publicado',
  paused: 'Pausado',
  canceled: 'Cancelado',
  finished: 'Finalizado',
};

const actionStatusMap: Record<'publish' | 'paused' | 'canceled' | 'finish', StatusEvent> = {
  publish: 'published',
  paused: 'paused',
  canceled: 'canceled',
  finish: 'finished',
};

export function useEventDetails() {
  const { id } = useParams();
  const eventId = id ?? '';
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);

  const [modalType, setModalType] = useState<EventDetailsModalType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isActionSubmitting, setIsActionSubmitting] = useState(false);

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!eventId) {
      setError('Evento inválido.');
      setLoading(false);
      return;
    }

    async function fetchEventDetails() {
      try {
        const response = await api.get(`/events/${eventId}`);
        const eventData = response.data.data ? response.data.data : response.data;
        setEvent(eventData);
      } catch (err) {
        setError('Evento não encontrado ou indisponível.');
      } finally {
        setLoading(false);
      }
    }

    fetchEventDetails();
  }, [eventId]);

  const userStorage = localStorage.getItem('@Eventos:user');
  const currentUser = userStorage ? JSON.parse(userStorage) : null;
  const isOrganizer = currentUser?.id === event?.user?.id;
  const isTrashed = !!event?.deleted_at;

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR');
  const formatTime = (dateString: string) => new Date(dateString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const formatPrice = (price: string) => parseFloat(price) === 0 ? 'Gratuito' : `R$ ${parseFloat(price).toFixed(2).replace('.', ',')}`;

  const handleBannerSelect = (file: File | null) => {
    if (!file) return;

    setStatusError(null);

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setStatusError('Formato inválido. Use PNG, JPG, JPEG ou WEBP.');
      setBannerFile(null);
      setPreviewUrl(null);
      return;
    }

    setBannerFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const resetBannerState = () => {
    setBannerFile(null);
    setPreviewUrl(null);
    setStatusError(null);
  };

  const openEditBanner = () => {
    if (!event) return;
    setPreviewUrl(event.banner_path ? `http://localhost:8000/storage/${event.banner_path}` : null);
    setStatusError(null);
    setModalType('edit_banner');
  };

  const handleSaveBanner = async () => {
    if (!bannerFile || !eventId) return;

    setIsActionSubmitting(true);
    setStatusError(null);

    try {
      const formData = new FormData();
      formData.append('banner', bannerFile);

      await api.post(`/organizer/events/${eventId}/banner`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Banner atualizado com sucesso!');
      setModalType(null);
      resetBannerState();

      const response = await api.get(`/events/${eventId}`);
      setEvent(response.data.data || response.data);
    } catch (error) {
      console.error(error);
      if (isAxiosError(error) && error.response) {
        setStatusError(error.response.data.message || 'Erro ao atualizar o banner.');
      } else {
        setStatusError('Não foi possível conectar ao servidor para enviar a imagem.');
      }
    } finally {
      setIsActionSubmitting(false);
    }
  };

  const handleDeleteBanner = async () => {
    if (!eventId) return;

    setIsActionSubmitting(true);
    setStatusError(null);

    try {
      await api.delete(`/organizer/events/${eventId}/banner-delete`);
      alert('Capa removida com sucesso!');
      setModalType(null);
      resetBannerState();

      const response = await api.get(`/events/${eventId}`);
      setEvent(response.data.data || response.data);
    } catch (error) {
      console.error(error);
      if (isAxiosError(error) && error.response) {
        setStatusError(error.response.data.message || 'Erro ao remover a capa do evento.');
      } else {
        setStatusError('Não foi possível conectar ao servidor para remover a imagem.');
      }
    } finally {
      setIsActionSubmitting(false);
    }
  };

  const handleEventStatusAction = async (action: 'publish' | 'paused' | 'canceled' | 'finish') => {
    if (!event) return;

    setIsActionSubmitting(true);
    setStatusError(null);
    try {
      await api.patch(`/organizer/events/${event.id}/${action}`);
      setEvent({ ...event, status: actionStatusMap[action] });
      const actionLabel = action === 'publish' ? 'publicado' : action === 'paused' ? 'pausado' : action === 'canceled' ? 'cancelado' : 'finalizado';
      alert(`Evento ${actionLabel} com sucesso.`);
    } catch (error) {
      console.error('Erro ao alterar status do evento:', error);
      if (isAxiosError(error) && error.response) {
        setStatusError(error.response.data.errors || 'Erro ao atualizar o status do evento.');
      } else {
        setStatusError('Não foi possível conectar ao servidor.');
      }
    } finally {
      setIsActionSubmitting(false);
    }
  };

  const handleRestoreEvent = async () => {
    if (!event) return;

    setIsRestoring(true);
    setStatusError(null);

    try {
      await api.patch(`/organizer/events/${event.id}/restore`);
      setModalType(null);
      alert('Evento restaurado com sucesso! Você foi redirecionado para Meus Eventos.');
      navigate('/my-events');
    } catch (error) {
      console.error('Erro ao restaurar evento:', error);
      alert('Erro crítico ao restaurar evento. Tente novamente via painel.');
    } finally {
      setIsRestoring(false);
    }
  };

  const handleSubscribe = async () => {
    if (!eventId) return;

    setIsSubmitting(true);
    try {
      await api.post(`/events/${eventId}/registrations`);
      setModalType(null);
      if (event) setEvent({ ...event, is_subscribed: true });
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        alert(error.response.data.message || 'Erro ao realizar inscrição.');
      } else {
        alert('Erro de conexão.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!event?.registration_id) return;

    setIsSubmitting(true);
    try {
      await api.delete(`/registrations/${event.registration_id}`);
      setModalType(null);
      setEvent({ ...event, is_subscribed: false });
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        alert(error.response.data.message || 'Erro ao cancelar inscrição.');
      } else {
        alert('Erro de conexão.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!event?.id) return;

    setIsDeleting(true);
    try {
      await api.delete(`/organizer/event/${event.id}`);
      setModalType(null);
      alert('Evento excluído com sucesso.');
      navigate('/my-events');
    } catch (error) {
      console.error('Erro ao excluir evento:', error);
      alert('Erro ao excluir evento.');
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    event,
    loading,
    error,
    statusError,
    modalType,
    setModalType,
    isOrganizer,
    isTrashed,
    isSubmitting,
    isDeleting,
    isRestoring,
    isActionSubmitting,
    bannerFile,
    previewUrl,
    fileInputRef,
    handleBannerSelect,
    handleSaveBanner,
    handleDeleteBanner,
    openEditBanner,
    handleEventStatusAction,
    handleRestoreEvent,
    handleSubscribe,
    handleUnsubscribe,
    handleDeleteEvent,
    resetBannerState,
    formatDate,
    formatPrice,
    formatTime,
    statusLabels,
  } as const;
}
