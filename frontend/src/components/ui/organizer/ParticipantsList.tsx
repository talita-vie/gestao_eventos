import { Check, Clock, Loader2, Search, UserCheck, UserX } from "lucide-react";
import type { Registration } from "../../../types/Registration";

interface ParticipantListProps {
  participants: Registration[];
  searchTerm: string;
  updatingId: number | null;
  onSearchCharge: (value: string) => void;
  onToggleCheckIn: (id: number, currentStatus: boolean) => void;
}

export function ParticipantsList({
    participants,
    searchTerm,
    updatingId,
    onSearchCharge,
    onToggleCheckIn
}: ParticipantListProps) {
    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Buscar por nome ou e-mail..."
                value={searchTerm}
                onChange={(e) => onSearchCharge(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner text-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {participants.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                    <th className="px-6 py-4">Participante</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {participants.map((participant) => (
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
                            onClick={() => onToggleCheckIn(participant.id, participant.status_checkin)}
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
    )
}