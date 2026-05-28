import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';

import { ArrowLeft } from 'lucide-react';
import { EventForm, type EventFormData } from '../../ui/events/EventForm';
import { isAxiosError } from 'axios';

export function CreateEvent() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateEvent = async (data: EventFormData, bannerFile?: File, setError?: any) => {
    setIsSubmitting(true);

    try {
      const response = await api.post('/events', data);

      const newEventId = response.data.data?.id || response.data?.id;

      if (bannerFile && newEventId) {
        const formData = new FormData();
        formData.append('banner', bannerFile);

        await api.post(`organizer/events/${newEventId}/banner`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      alert('Evento criado com sucesso!');
      navigate('/my-events');
    } catch (error) {
      
      if (isAxiosError(error) && error.response) {
        const status = error.response.status;
        const responseData = error.response.data;
      
        if (status === 422 && responseData.errors) {
          Object.keys(responseData.errors).forEach((field) => {
            setError(field as keyof EventFormData, {
              type: 'manual',
              message: responseData.errors[field][0],
            });
          });

          setError('root', { 
            type: 'manual', 
            message: 'Alguns dados estão inválidos. Verifique os campos destacados.' ,
          });
        } else {
          if (setError) {
            setError('root', { 
              type: 'manual', 
              message: responseData.message || 'Erro ao criar evento. Tente novamente mais tarde.' ,
            });
          }
        }
      } else {
        setError('root', { 
          type: 'manual', 
          message: 'Erro de conexão com o servidor.' ,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Criar Novo Evento</h1>
            <p className="text-slate-500 mt-1">Preencha os detalhes para publicar seu evento.</p>
          </div>
          <button 
            onClick={() => {
                sessionStorage.removeItem('@Eventos:CreateEventDraft');
                navigate(-1)
            }} 
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ArrowLeft size={28} />
          </button>
        </header>

        <EventForm 
          onSubmit={handleCreateEvent} 
          isSubmitting={isSubmitting} 
          buttonText="Publicar Evento" 
        />

      </div>
    </div>
  );
}