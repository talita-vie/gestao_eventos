import { AlertCircle, CheckCircle2, Edit, MapPin, Pause, RotateCcw, Users, XCircle } from 'lucide-react';
import type { Event } from '../../../../types/Event';

interface EventDetailsSidebarProps {
  event: Event;
  isOrganizer: boolean;
  isTrashed: boolean;
  isDeleting: boolean;
  onOpenSubscribe: () => void;
  onOpenUnsubscribe: () => void;
  onNavigateParticipants: () => void;
  onOpenDelete: () => void;
  onEditEvent: () => void;
  onOpenRestore: () => void;
  formatDate: (date: string) => string;
  formatTime: (date: string) => string;
}

export function EventDetailsSidebar({
  event,
  isOrganizer,
  isTrashed,
  isDeleting,
  onOpenSubscribe,
  onOpenUnsubscribe,
  onNavigateParticipants,
  onOpenDelete,
  onEditEvent,
  onOpenRestore,
  formatDate,
  formatTime,
}: EventDetailsSidebarProps) {
  return (
    <div className="lg:col-span-4 space-y-6">
      {isTrashed ? (
        <div className="w-full bg-slate-100 text-slate-500 font-bold py-4 rounded-2xl text-center border border-slate-200 flex items-center justify-center gap-2 text-base shadow-sm cursor-not-allowed">
          <XCircle size={20} />
          Evento Indisponível
        </div>
      ) : isOrganizer ? (
        <button
          onClick={onNavigateParticipants}
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
            onClick={onOpenUnsubscribe}
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
          onClick={onOpenSubscribe}
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
              <MapPin size={18} />
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
              <Pause size={18} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Inscrições encerram em</p>
              <p className="text-sm font-bold text-red-600 mt-1">{formatDate(event.registration_deadline)} às {formatTime(event.registration_deadline)}</p>
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
        <div className="text-4xl font-black text-blue-700">{event.available_vacancies}</div>
      </div>

      {isOrganizer && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-left animate-in fade-in zoom-in-95 duration-300">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">{isTrashed ? 'Recuperação de Dados' : 'Gerenciamento Crítico'}</p>

          {isTrashed ? (
            <button
              onClick={onOpenRestore}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-95 cursor-pointer"
            >
              <RotateCcw size={18} />
              Restaurar Evento
            </button>
          ) : (
            <div className="space-y-3">
              <button
                onClick={onEditEvent}
                className="w-full bg-[#F58634] hover:bg-[#e07525] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-95 cursor-pointer"
              >
                <Edit size={18} />
                Editar Evento
              </button>
              <button
                onClick={onOpenDelete}
                disabled={isDeleting}
                className="w-full bg-[#B91C1C] hover:bg-[#991b1b] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-95 cursor-pointer"
              >
                {isDeleting ? <div className="animate-spin"><RotateCcw size={18} /></div> : (
                  <><XCircle size={18} /> Excluir Evento</>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
