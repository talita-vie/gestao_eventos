import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';
import {
  ArrowLeft, Calendar, MapPin, User, Mail,
  Clock, Users, AlertCircle, X, CheckCircle2,
  Edit, Loader2, Globe, Pause, XCircle, Trash2,
  DollarSign, RotateCcw, Camera, ImagePlus
} from 'lucide-react';
import { isAxiosError } from 'axios';
import type { Event } from '../../../types/Event';
import type { StatusEvent } from '../../../types/enums';

export function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);

  const [modalType, setModalType] = useState<'subscribe' | 'unsubscribe' | 'delete' | 'cancel_event' | 'restore' | 'edit_banner' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isActionSubmitting, setIsActionSubmitting] = useState(false);

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    async function fetchEventDetails() {
      try {
        const response = await api.get(`/events/${id}`);
        const eventData = response.data.data ? response.data.data : response.data;
        setEvent(eventData);
      } catch (err) {
        console.error(err);
        setError('Evento não encontrado ou indisponível.');
      } finally {
        setLoading(false);
      }
    }
    fetchEventDetails();
  }, [id]);

  const userStorage = localStorage.getItem('@Eventos:user');
  const currentUser = userStorage ? JSON.parse(userStorage) : null;
  const isOrganizer = currentUser?.id === event?.user?.id;
  const isTrashed = !!event?.deleted_at;

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR');
  const formatTime = (dateString: string) => new Date(dateString).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
  const formatPrice = (price: string) => parseFloat(price) === 0 ? 'Gratuito' : `R$ ${parseFloat(price).toFixed(2).replace('.', ',')}`;

  const handleBannerSelect = (file: File | null) => {
    if (!file) return;
    
    setStatusError(null); 
    
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setStatusError("Formato inválido. Use PNG, JPG, JPEG ou WEBP.");
      setBannerFile(null);
      setPreviewUrl(null);
      return;
    }
    
    setBannerFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSaveBanner = async () => {
    if (!bannerFile) return;
    
    setIsActionSubmitting(true);
    setStatusError(null); 

    try {
      const formData = new FormData();
      formData.append('banner', bannerFile);

      await api.post(`/organizer/events/${id}/banner`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      alert('Banner atualizado com sucesso!');
      setModalType(null);
      setBannerFile(null);
      
      const response = await api.get(`/events/${id}`);
      setEvent(response.data.data || response.data);
      
    } catch (err) {
      console.error(err);
      if (isAxiosError(err) && err.response) {
        setStatusError(err.response.data.message || 'Erro ao atualizar o banner.');
      } else {
        setStatusError('Não foi possível conectar ao servidor para enviar a imagem.');
      }
    } finally {
      setIsActionSubmitting(false);
    }
  };

  const handleDeleteBanner = async () => {
    setIsActionSubmitting(true);
    setStatusError(null);
    try {
      await api.delete(`/organizer/events/${id}/banner-delete`);
      alert('Capa removida com sucesso!');
      
      setModalType(null);
      setPreviewUrl(null);
      
      const response = await api.get(`/events/${id}`);
      setEvent(response.data.data || response.data);
      
    } catch (err) {
      console.error(err);
      if (isAxiosError(err) && err.response) {
        setStatusError(err.response.data.message || 'Erro ao remover a capa do evento.');
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
    } catch (err) {
      console.error('Erro ao alterar status do evento:', err);
      if (isAxiosError(err) && err.response) {
        setStatusError(err.response.data.errors || 'Erro ao atualizar o status do evento.');
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
    } catch (err) {
      console.error('Erro ao restaurar evento:', err);
      alert('Erro crítico ao restaurar evento. Tente novamente via painel.');
    } finally {
      setIsRestoring(false);
    }
  };

  const handleSubscribe = async () => {
    setIsSubmitting(true);
    try {
      await api.post(`/events/${id}/registrations`);
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
    setIsSubmitting(true);
    try {
      await api.delete(`/registrations/${event?.registration_id}`);
      setModalType(null);
      if (event) setEvent({ ...event, is_subscribed: false });
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
    setIsDeleting(true);
    try {
      await api.delete(`/organizer/event/${event?.id}`);
      setModalType(null);
      alert('Evento excluído com sucesso.');
      navigate('/my-events');
    } catch (err) {
      console.error('Erro ao excluir evento:', err);
      alert('Erro ao excluir evento.');
    } finally {
      setIsDeleting(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <AlertCircle size={48} className="text-slate-400 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Oops!</h2>
        <p className="text-slate-600 mb-6 text-center max-w-sm">{error}</p>
        <Link to="/" className="text-blue-600 font-semibold hover:underline flex items-center gap-2">
          <ArrowLeft size={20} /> Voltar para a página inicial
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
     
      <div className="relative w-full pt-8 md:pt-12 pb-24 px-6 md:px-10 text-left bg-[#00215E]">
        {event.banner_path && (
          <div className="absolute inset-0 z-0">
            <img
              src={`http://localhost:8000/storage/${event.banner_path}`}
              alt="Banner Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0"></div>
          </div>
        )}

        <div className="max-w-6xl mx-auto relative z-10">
          
          <div className="flex justify-between items-start mb-8 gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-blue-200 hover:text-white transition-colors flex items-center gap-2 text-sm font-semibold cursor-pointer shrink-0"
            >
              <ArrowLeft size={18} /> Voltar
            </button>

            {isOrganizer && !isTrashed && (
              <button
                onClick={() => {
                  setPreviewUrl(event.banner_path ? `http://localhost:8000/storage/${event.banner_path}` : null);
                  setStatusError(null);
                  setModalType('edit_banner');
                }}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 flex items-center gap-2 cursor-pointer shadow-sm whitespace-nowrap"
              >
                <Camera size={16} />
                Alterar Capa
              </button>
            )}
          </div>
         
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex flex-col items-start flex-1">
              <span className={`inline-block text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 shadow-sm ${isTrashed ? 'bg-red-500' : 'bg-green-500'}`}>
                {isTrashed ? 'Na Lixeira' : statusLabels[event.status]}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                {event.name}
              </h1>
              <p className="flex items-center gap-2 text-blue-200">
                <User size={18} />
                <span className="text-sm font-medium">Palestrante: {event.speaker || 'Não informado'}</span>
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-4 rounded-2xl shrink-0 shadow-xl">
              <div className="bg-green-400/20 p-2 rounded-xl text-green-400">
                <DollarSign size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-blue-200 uppercase tracking-wider font-bold mb-0.5">Investimento</span>
                <span className="text-2xl font-bold leading-none">{formatPrice(event.price)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-4 relative z-20">
        
        {isTrashed && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 md:p-6 mb-8 rounded-r-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start gap-4 text-left">
              <AlertCircle size={28} className="shrink-0 mt-1 text-red-600" />
              <div>
                <h3 className="font-bold text-lg text-red-800">Este evento está na lixeira</h3>
                <p className="text-red-700 mt-1">Ele foi excluído pelo organizador. Não está visível para o público e novas inscrições foram bloqueadas.</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-9 items-start">
         
          <div className="lg:col-span-8 space-y-9">

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-800 mb-6 text-left">Sobre o evento</h2>
              <div className="text-slate-600 leading-relaxed whitespace-pre-wrap text-base text-left">
                {event.description}
              </div>
            </div>

            {isOrganizer && !isTrashed && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 text-left">
                <h2 className="text-lg font-bold text-slate-800">Status do Evento</h2>
                <p className="text-slate-500 text-sm mt-1 mb-6">Gerencie o ciclo de vida e a visibilidade do seu evento.</p>

                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200 mt-6">
                  <button
                    onClick={() => handleEventStatusAction('publish')}
                    disabled={isActionSubmitting || event.status === 'published' || event.status === 'canceled' || event.status === 'finished'}
                    className="flex items-center gap-2 bg-[#006C45] hover:bg-[#005a39] disabled:opacity-50 disabled:bg-slate-300 disabled:text-slate-500 text-white text-sm font-semibold py-2.5 px-5 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Globe size={16} />
                    Publicar evento
                  </button>
                  <button
                    onClick={() => handleEventStatusAction('paused')}
                    disabled={isActionSubmitting || event.status !== 'published'}
                    className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-sm font-semibold py-2.5 px-5 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Pause size={16} />
                    Pausar evento
                  </button>
                  <button
                    onClick={() => setModalType('cancel_event')} 
                    disabled={isActionSubmitting || event.status === 'canceled' || event.status === 'draft' || event.status === 'finished'}
                    className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-sm font-semibold py-2.5 px-5 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <XCircle size={16} />
                    Cancelar evento
                  </button>
                  <button
                    onClick={() => handleEventStatusAction('finish')}
                    disabled={isActionSubmitting || event.status !== 'published'}
                    className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-sm font-semibold py-2.5 px-5 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <CheckCircle2 size={16} />
                    Finalizar evento
                  </button>
                </div>

                {statusError && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm animate-in fade-in slide-in-from-top-1">
                    <AlertCircle size={18} className='shrink-0 mt-0.5 text-red-500' />
                    <p className="font-medium">
                      {statusError}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left shadow-inner">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 shrink-0 shadow-md">
                  <User size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Organizador</p>
                  <h3 className="font-bold text-slate-800 text-lg leading-tight">{event.user?.name || 'Não informado'}</h3>
                  <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
                    <Mail size={14} /> {event.user?.email}
                  </p>
                </div>
              </div>
              <button className="text-blue-600 font-bold text-xs uppercase tracking-wider hover:text-blue-800 transition-colors self-start sm:self-center cursor-pointer">
                Ver Perfil
              </button>
            </div>

          </div>

          <div className="lg:col-span-4 space-y-6">
           
            {isTrashed ? (
              <div className="w-full bg-slate-100 text-slate-500 font-bold py-4 rounded-2xl text-center border border-slate-200 flex items-center justify-center gap-2 text-base shadow-sm cursor-not-allowed">
                <XCircle size={20} />
                Evento Indisponível
              </div>
            ) : isOrganizer ? (
              <button
                onClick={() => navigate(`/organizer/events/${id}/participants`)}
                className="w-full bg-white border border-blue-200 hover:border-blue-400 text-blue-700 rounded-2xl py-4 flex items-center justify-center gap-2 font-bold shadow-sm transition-colors cursor-pointer"
              >
                <Users size={18} />
                Ver Participantes
              </button>
            ) : event.is_subscribed ? (
              <div className="space-y-3">
                <div className="w-full bg-green-50 text-green-700 font-bold py-4 rounded-2xl text-center border border-green-200 flex items-center justify-center gap-2 text-base shadow-sm">
                  <CheckCircle2 size={20} />
                  Inscrição Confirmada!
                </div>
                <button
                  onClick={() => setModalType('unsubscribe')}
                  className="w-full bg-white hover:bg-red-50 text-red-600 border border-slate-200 hover:border-red-200 font-bold py-3.5 rounded-2xl transition-all active:scale-95 text-sm cursor-pointer shadow-sm"
                >
                  Cancelar Inscrição
                </button>
              </div>
            ) : event.available_vacancies <= 0 ? (
              <div className="w-full bg-red-50 text-red-700 font-bold py-4 rounded-2xl text-center border border-red-200 flex items-center justify-center gap-2 text-base shadow-sm cursor-not-allowed">
                  <AlertCircle size={20} />
                  Vagas Esgotadas!
                </div>
            ) : (
              <button
                onClick={() => setModalType('subscribe')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-[0_8px_20px_rgba(37,99,235,0.2)] transition-all active:scale-95 text-lg cursor-pointer"
              >
                Garantir Inscrição
              </button>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 text-left">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Informações</h2>
             
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400">Data e Hora</p>
                    <p className="text-sm font-semibold text-slate-700 mt-1">
                      Início: <span className="font-normal">{formatDate(event.start_date_time)} às {formatTime(event.start_date_time)}</span>
                    </p>
                    <p className="text-sm font-semibold text-slate-700">
                      Término: <span className="font-normal">{formatDate(event.end_date_time)} às {formatTime(event.end_date_time)}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500 shrink-0 border border-red-100">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400">Inscrições encerram em</p>
                    <p className="text-sm font-bold text-red-600 mt-1">
                      {formatDate(event.registration_deadline)} às {formatTime(event.registration_deadline)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 text-left">
              <div className="flex items-center gap-2 mb-6">
                <MapPin size={20} className="text-blue-600" />
                <h2 className="text-lg font-bold text-slate-800">Localização</h2>
              </div>
             
              <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600 space-y-1 mb-5 border border-slate-100 font-mono shadow-inner">
                {event.address ? (
                  <>
                    <p className="font-semibold text-slate-800">{event.address.street_name}, {event.address.house_number}</p>
                    {event.address.complement && <p>Complemento: {event.address.complement}</p>}
                    <p>Bairro: {event.address.neighborhood}</p>
                    <p>{event.address.city_name} - {event.address.state}</p>
                    <p className="text-slate-400 mt-2">CEP: {event.address.street_zipcode}</p>
                  </>
                ) : (
                  <p>Endereço não cadastrado.</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-blue-200 p-6 flex items-center justify-between shadow-[0_4px_12px_rgba(37,99,235,0.05)] animate-pulse-slow">
              <div className="flex items-center gap-2 text-slate-700 font-bold text-left">
                <Users size={20} className="text-blue-600" />
                Vagas Disponíveis
              </div>
              <div className="text-4xl font-black text-blue-700">
                {event.available_vacancies}
              </div>
            </div>

            {isOrganizer && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-left animate-in fade-in zoom-in-95 duration-300">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                  {isTrashed ? 'Recuperação de Dados' : 'Gerenciamento Crítico'}
                </p>
                
                {isTrashed ? (
                  <button
                    onClick={() => setModalType('restore')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-95 cursor-pointer"
                  >
                    <RotateCcw size={18} />
                    Restaurar Evento
                  </button>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate(`/event/${event.id}/edit`)}
                      className="w-full bg-[#F58634] hover:bg-[#e07525] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-95 cursor-pointer"
                    >
                      <Edit size={18} />
                      Editar Evento
                    </button>
                    <button
                      onClick={() => setModalType('delete')}
                      disabled={isDeleting}
                      className="w-full bg-[#B91C1C] hover:bg-[#991b1b] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-95 cursor-pointer"
                    >
                      {isDeleting ? <Loader2 className="animate-spin" size={18} /> : (
                        <><Trash2 size={18} /> Excluir Evento</>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {modalType !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-left">
           
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  modalType === 'subscribe' || modalType === 'restore' || modalType === 'edit_banner' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
                }`}>
                  {modalType === 'subscribe' ? <CheckCircle2 size={28} /> : 
                   modalType === 'restore' ? <RotateCcw size={28} /> : 
                   modalType === 'edit_banner' ? <Camera size={28} /> :
                   <AlertCircle size={28} />}
                </div>
                <button
                  onClick={() => setModalType(null)}
                  className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
             
              {modalType === 'subscribe' ? (
                <>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Confirmar Inscrição</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Você está prestes a se inscrever no evento <strong className="text-slate-800">"{event.name}"</strong>.
                    {parseFloat(event.price) > 0 && " Será necessário realizar o pagamento posteriormente via plataforma."}
                  </p>

                  <div className="bg-slate-50 p-4 rounded-xl mb-8 border border-slate-100 text-sm space-y-2 shadow-inner">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Valor:</span>
                      <span className="font-bold text-slate-800">{formatPrice(event.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Data limite:</span>
                      <span className="font-semibold text-slate-800">{formatDate(event.registration_deadline)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col-reverse md:flex-row gap-3">
                    <button onClick={() => setModalType(null)} disabled={isSubmitting} className="flex-1 px-6 py-3.5 rounded-xl font-bold text-slate-600 bg-white border-2 border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer">
                      Cancelar
                    </button>
                    <button onClick={handleSubscribe} disabled={isSubmitting} className="flex-1 px-6 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-70 flex justify-center items-center cursor-pointer">
                      {isSubmitting ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Confirmar Inscrição'}
                    </button>
                  </div>
                </>
              
              ) : modalType === 'unsubscribe' ? (
                <>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Desistir do Evento?</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Tem certeza que deseja cancelar sua inscrição em <strong className="text-slate-800">"{event.name}"</strong>? Sua vaga será liberada para outras pessoas da fila de espera.
                  </p>

                  <div className="flex flex-col-reverse md:flex-row gap-3 mt-8">
                    <button onClick={() => setModalType(null)} disabled={isSubmitting} className="flex-1 px-6 py-3.5 rounded-xl font-bold text-slate-600 bg-white border-2 border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer">
                      Voltar
                    </button>
                    <button onClick={handleUnsubscribe} disabled={isSubmitting} className="flex-1 px-6 py-3.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95 disabled:opacity-70 flex justify-center items-center cursor-pointer">
                      {isSubmitting ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Sim, Cancelar'}
                    </button>
                  </div>
                </>
              
              ) : modalType === 'delete' ? (
                <>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Excluir Evento?</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Tem certeza que deseja excluir o evento <strong className="text-slate-800">"{event.name}"</strong>? Ele será enviado para a lixeira e ocultado do público, mas você poderá restaurá-lo depois se precisar.
                  </p>

                  <div className="flex flex-col-reverse md:flex-row gap-3 mt-8">
                    <button onClick={() => setModalType(null)} disabled={isDeleting} className="flex-1 px-6 py-3.5 rounded-xl font-bold text-slate-600 bg-white border-2 border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer">
                      Voltar
                    </button>
                    <button onClick={handleDeleteEvent} disabled={isDeleting} className="flex-1 px-6 py-3.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95 disabled:opacity-70 flex justify-center items-center cursor-pointer">
                      {isDeleting ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Sim, Excluir'}
                    </button>
                  </div>
                </>
              
              ) : modalType === 'cancel_event' ? (
                <>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Cancelar Evento?</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Tem certeza que deseja cancelar o evento <strong className="text-slate-800">"{event.name}"</strong>?
                    Isso impedirá novas inscrições e alterará o status do evento imediatamente, notificando os inscritos. Esta ação não pode ser desfeita.
                  </p>

                  <div className="flex flex-col-reverse md:flex-row gap-3 mt-8">
                    <button onClick={() => setModalType(null)} disabled={isActionSubmitting} className="flex-1 px-6 py-3.5 rounded-xl font-bold text-slate-600 bg-white border-2 border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer">
                      Voltar
                    </button>
                    <button onClick={ async () => {
                      // Executa a ação e fecha o modal ao terminar
                      await handleEventStatusAction('canceled');
                      setModalType(null);
                    }}
                    disabled={isActionSubmitting} className="flex-1 px-6 py-3.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95 disabled:opacity-70 flex justify-center items-center cursor-pointer">
                      {isActionSubmitting ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        'Sim, Cancelar Evento'
                      )}  
                    </button>
                  </div>
                </>
              
              ) : modalType === 'restore' ? (
                <>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Restaurar Evento?</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Deseja recuperar o evento <strong className="text-slate-800">"{event.name}"</strong> da lixeira? Ele voltará ao estado exato (Rascunho ou Publicado) em que estava antes da exclusão.
                  </p>

                  <div className="flex flex-col-reverse md:flex-row gap-3 mt-8">
                    <button onClick={() => setModalType(null)} disabled={isRestoring} className="flex-1 px-6 py-3.5 rounded-xl font-bold text-slate-600 bg-white border-2 border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer">
                      Cancelar
                    </button>
                    <button onClick={handleRestoreEvent} disabled={isRestoring} className="flex-1 px-6 py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-95 disabled:opacity-70 flex justify-center items-center cursor-pointer">
                      {isRestoring ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Sim, Restaurar'}
                    </button>
                  </div>
                </>

              
              ) : modalType === 'edit_banner' ? (
                <>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Imagem de Capa</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Escolha uma nova imagem para destacar o seu evento na listagem geral.
                  </p>

                  <input 
                    type="file" 
                    ref={fileInputRef}
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={(e) => handleBannerSelect(e.target.files?.[0] || null)}
                    className="hidden" 
                  />

                  {previewUrl ? (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-50 group">
                      <img src={previewUrl} alt="Preview do Banner" className="w-full h-48 object-cover animate-in fade-in duration-300" />
                      <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-white text-slate-800 font-bold px-5 py-2.5 rounded-xl text-sm transition-transform active:scale-95 cursor-pointer shadow-xl flex items-center gap-2"
                        >
                          <ImagePlus size={16} />
                          Trocar Imagem
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-48 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-blue-400 flex flex-col items-center justify-center gap-3 text-slate-500 transition-all cursor-pointer shadow-inner animate-in fade-in"
                    >
                      <div className="bg-white p-3 rounded-full shadow-sm border border-slate-100">
                        <ImagePlus size={24} className="text-blue-500" />
                      </div>
                      <span className="font-semibold">Clique para enviar uma foto</span>
                      <span className="text-xs text-slate-400">JPG, PNG ou WEBP (Max 5MB)</span>
                    </button>
                  )}

                  {statusError && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm animate-in fade-in slide-in-from-top-1">
                      <AlertCircle size={18} className='shrink-0 mt-0.5 text-red-500' />
                      <p className="font-medium">
                        {statusError}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
                    
                    {event.banner_path && !bannerFile ? (
                      <button
                        onClick={handleDeleteBanner}
                        disabled={isActionSubmitting}
                        className="w-full md:w-auto px-6 py-3.5 rounded-xl font-bold text-red-600 bg-red-50 hover:bg-red-100 shadow-lg border border-red-100 transition-all active:scale-95 disabled:opacity-70 flex justify-center items-center cursor-pointer"
                      >
                        Remover Capa
                      </button>
                    ) : (
                      <div className="hidden md:block w-full md:w-auto"></div> 
                    )}

                    <div className="flex flex-col-reverse md:flex-row gap-3 w-full md:w-auto">
                      <button 
                        onClick={() => {
                          setModalType(null);
                          setBannerFile(null);
                          setPreviewUrl(null);
                          setStatusError(null);
                        }} 
                        disabled={isActionSubmitting} 
                        className="w-full md:w-auto px-6 py-3.5 rounded-xl font-bold text-slate-600 bg-white border-2 border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button 
                        onClick={handleSaveBanner}
                        disabled={isActionSubmitting || !bannerFile} 
                        className="w-full md:w-auto px-6 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-70 flex justify-center items-center cursor-pointer"
                      >
                        {isActionSubmitting ? (
                          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          'Salvar Capa'
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : null}


            </div>
          </div>
        </div>
      )}
    </div>
  );
}

