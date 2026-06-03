import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';
import { isAxiosError } from 'axios';
import { ArrowLeft } from 'lucide-react';
import type { Registration } from '../../../types/Registration';
import { ParticipantStats } from '../../ui/organizer/ParticipantsStatus';
import { ParticipantsList } from '../../ui/organizer/ParticipantsList';

export function EventParticipants() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [participants, setParticipants] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  
  useEffect(() => {
    async function loadParticipants() {
      try {
        const response = await api.get(`/organizer/events/${id}/participants`);
        const data = response.data.data.data || response.data.data;
        setParticipants(data);
      } catch (error) {
        console.error("Erro ao carregar participantes:", error);
      } finally {
        setLoading(false);
      }
    }
    loadParticipants();
  }, [id]);

  const handleToggleCheckIn = async (registrationId: number, currentStatus: boolean) => {
    setUpdatingId(registrationId);
    try {
        if (currentStatus) {
            await api.patch(`/organizer/events/${registrationId}/check-in/delete`);
        } else {
            await api.patch(`/organizer/events/${registrationId}/check-in`);
        }

      setParticipants(prev => 
        prev.map(p => 
          p.id === registrationId 
            ? { ...p, status_checkin: !currentStatus } 
            : p
        )
      );
    } catch (error) {
      console.error(error);
      if (isAxiosError(error) && error.response) {
        alert(error.response.data.message || "Erro ao realizar check-in.");
      } else {
        alert("Erro de conexão com o servidor.");
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredParticipants = participants.filter(participant =>
    participant.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalInscritos = participants.length;
  const totalCheckins = participants.filter(p => p.status_checkin).length;
  const totalPendentes = totalInscritos - totalCheckins;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans pb-20">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <header className="flex items-center justify-between">
          <div className="text-left">
            <button
              onClick={() => navigate(-1)}
              className="text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-2 text-sm font-semibold mb-2 cursor-pointer"
            >
              <ArrowLeft size={16} /> Voltar ao evento
            </button>
            <h1 className="text-3xl font-bold text-slate-800">Controle de Portaria</h1>
            <p className="text-slate-500 mt-1">Gerencie a entrada e faça o check-in dos participantes credenciados.</p>
          </div>
        </header>

        <ParticipantStats
          totalInscritos={totalInscritos}
          totalCheckins={totalCheckins}
          totalPendentes={totalPendentes}
        />

        <ParticipantsList
          participants={filteredParticipants}
          searchTerm={searchTerm}
          updatingId={updatingId}
          onSearchCharge={setSearchTerm}
          onToggleCheckIn={handleToggleCheckIn}
        />
      </div>
    </div>
  );
}

