import { AlertCircle, CheckCircle2, Globe, Mail, Pause, User, XCircle } from 'lucide-react';
import type { Event } from '../../../../types/Event';

interface EventDetailsLeftContentProps {
  event: Event;
  isOrganizer: boolean;
  isTrashed: boolean;
  statusError: string | null;
  isActionSubmitting: boolean;
  handleEventStatusAction: (action: 'publish' | 'paused' | 'canceled' | 'finish') => Promise<void>;
  onOpenCancelEvent: () => void;
  onEditEvent: () => void;
  onOpenDelete: () => void;
}

export function EventDetailsLeftContent({
  event,
  isOrganizer,
  isTrashed,
  statusError,
  isActionSubmitting,
  handleEventStatusAction,
  onOpenCancelEvent,
  onEditEvent,
  onOpenDelete,
}: EventDetailsLeftContentProps) {
  return (
    <>
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
              onClick={onOpenCancelEvent}
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
              <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
              <p className="font-medium">{statusError}</p>
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
    </>
  );
}
