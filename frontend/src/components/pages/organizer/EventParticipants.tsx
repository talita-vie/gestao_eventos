import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';
import { isAxiosError } from 'axios';
import { 
  ArrowLeft, 
  Search, 
  UserCheck, 
  Check, 
  Users, 
  Clock, 
  UserX,
  Loader2
} from 'lucide-react';
import type { Registration } from '../../../types/Registration';


export function EventParticipants() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [participants, setParticipants] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    console.log(participants)
  }, [participants])
  useEffect(() => {
    async function loadParticipants() {
      try {
        const response = await api.get(`/organizer/events/${id}/participants`);
        const data = response.data.data.data || response.data.data;
        setParticipants(data);
        console.log(data)
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inscritos Totais</p>
              <p className="text-3xl font-black text-slate-800 mt-1">{totalInscritos}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
              <Users size={24} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Check-ins Realizados</p>
              <p className="text-3xl font-black text-green-600 mt-1">{totalCheckins}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-xl text-green-600">
              <UserCheck size={24} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pendentes</p>
              <p className="text-3xl font-black text-amber-500 mt-1">{totalPendentes}</p>
            </div>
            <div className="bg-amber-50 p-3 rounded-xl text-amber-500">
              <Clock size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Buscar por nome ou e-mail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner text-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredParticipants.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                    <th className="px-6 py-4">Participante</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredParticipants.map((participant) => (
                    <tr key={participant.id} className="hover:bg-slate-50/50 transition-colors">

                      <td className="px-6 py-4">
                        <div className="flex flex-col text-left">
                          <span className="font-bold text-slate-800 text-sm">{participant.user?.name}</span>
                          <span className="text-xs text-slate-400 mt-0.5">{participant.user?.email}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {participant.status_checkin ? (
                          <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 font-bold px-3 py-1 rounded-lg text-xs border border-green-100">
                            <Check size={14} strokeWidth={3} />
                            Presença Confirmada
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 font-bold px-3 py-1 rounded-lg text-xs border border-amber-100">
                            <Clock size={14} strokeWidth={3} />
                            Aguardando Chegada
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button 
                            type='button'
                            disabled={updatingId === participant.id}
                            onClick={() => handleToggleCheckIn(participant.id, participant.status_checkin)}
                            className={`px-2 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all active:scale-95 shadow-sm cursor-pointer ${
                                participant.status_checkin
                                ? 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'
                                : 'bg-blue-600 hover:bg-blue-600 text-white shadow-blue-100 shodow-md'
                            }`}
                            >
                        
                            {updatingId === participant.id ? (
                                <Loader2 className='animate-spin' size={14} />
                            ) : participant.status_checkin ? (
                                <>
                                    <UserX size={14} /> Remover Check-in
                                </>
                            ) : (
                                <>
                                    <UserCheck size={14} /> Fazer Check-in
                                </>
                            )}
                        
                          </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <div className="bg-slate-100 text-slate-400 p-4 rounded-full mb-3">
                  <UserX size={32} />
                </div>
                <h3 className="font-bold text-slate-700 text-lg">Nenhum participante encontrado</h3>
                <p className="text-slate-400 text-sm mt-1">Verifique o termo digitado ou aguarde novas inscrições.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

