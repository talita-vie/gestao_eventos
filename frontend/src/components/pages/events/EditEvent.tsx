import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../../services/api';
import { isAxiosError } from 'axios';
import { ArrowLeft } from 'lucide-react';
import { EventForm, type EventFormData } from '../../ui/events/EventForm';

export function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
 
  const [initialData, setInitialData] = useState<EventFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
 
  useEffect(() => {
    async function loadEvent() {
      try {
        const response = await api.get(`/events/${id}`);
        const event = response.data.data || response.data;

        const formatToInput = (dateStr: string) => {
          if (!dateStr) return '';
          return dateStr.replace(' ', 'T').substring(0, 16);
        };

        setInitialData({
          name: event.name,
          description: event.description,
          speaker: event.speaker,
          capacity: event.capacity,
          hours: event.hours,
          price: event.price,
          category_id: event.category_id,
          start_date_time: formatToInput(event.start_date_time),
          end_date_time: formatToInput(event.end_date_time),
          registration_deadline: formatToInput(event.registration_deadline),
          is_external: !!event.is_external,
          address: {
            street_zipcode: event.address?.street_zipcode || '',
            street_name: event.address?.street_name || '',
            house_number: event.address?.house_number || '',
            neighborhood: event.address?.neighborhood || '',
            city_name: event.address?.city_name || '',
            state: event.address?.state || '',
            complement: event.address?.complement || '',
            reference_point: event.address?.reference_point || '',
          }
        });
       
      } catch (error) {
        console.error("Erro ao carregar evento:", error);
        alert("Não foi possível carregar os dados.");
        navigate('/my-events');
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [id, navigate]);

  const handleUpdateEvent = async (data: EventFormData, bannerFile?: File, setError?: any) => {
    setIsSubmitting(true);

    try {
      await api.put(`/organizer/event/${id}`, data);

      if (bannerFile) {
        const formData = new FormData();
        formData.append('banner', bannerFile);

        await api.post(`/organizer/events/${id}/banner`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      alert('Evento atualizado com sucesso!');
      navigate('/my-events');

    } catch (error) {
      console.error(error);
      
      if (isAxiosError(error) && error.response) {
        const status = error.response.status;
        const responseData = error.response.data;

        if (status === 422 && responseData.errors && setError) {
          Object.keys(responseData.errors).forEach((field) => {
            setError(field as keyof EventFormData, {
              type: 'manual',
              message: responseData.errors[field][0],
            });
          });

          setError('root', {
            type: 'manual',
            message: 'Alguns dados estão inválidos. Verifique os campos destacados.',
          });
        } else if (setError) {
          setError('root', {
            type: 'manual',
            message: responseData.message || 'Erro ao atualizar evento. Tente novamente.',
          });
        }
      } else if (setError) {
        setError('root', { type: 'manual', message: 'Erro de conexão com o servidor.' });
      }

    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-slate-500 font-medium">Carregando dados do evento...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
       
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Editar Evento</h1>
            <p className="text-slate-500 mt-1">Atualize as informações do seu evento abaixo.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sessionStorage.removeItem('@Eventos:CreateEventDraft');
                navigate(-1);
              }}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <ArrowLeft size={28} />
            </button>
          </div>
        </header>

        {initialData && (
          <EventForm
            initialData={initialData}
            onSubmit={handleUpdateEvent}
            isSubmitting={isSubmitting}
            buttonText="Salvar Alterações"
          />
        )}

      </div>
    </div>
  );
}

