import { ArrowLeft, Camera, DollarSign, User } from 'lucide-react';
import type { Event } from '../../../../types/Event';
import type { StatusEvent } from '../../../../types/enums';

interface EventDetailsHeroProps {
  event: Event;
  isOrganizer: boolean;
  isTrashed: boolean;
  onBack: () => void;
  onEditBanner: () => void;
  statusLabels: Record<StatusEvent, string>;
  formatPrice: (price: string) => string;
}

export function EventDetailsHero({
  event,
  isOrganizer,
  isTrashed,
  onBack,
  onEditBanner,
  statusLabels,
  formatPrice,
}: EventDetailsHeroProps) {
  const bannerUrl = event.banner_path ? `http://localhost:8000/storage/${event.banner_path}` : null;

  return (
    <div className="relative w-full pt-8 md:pt-12 pb-24 px-6 md:px-10 text-left bg-[#00215E]">
      {bannerUrl && (
        <div className="absolute inset-0 z-0">
          <img
            src={bannerUrl}
            alt="Banner Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0"></div>
        </div>
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex justify-between items-start mb-8 gap-4">
          <button
            onClick={onBack}
            className="text-blue-200 hover:text-white transition-colors flex items-center gap-2 text-sm font-semibold cursor-pointer shrink-0"
          >
            <ArrowLeft size={18} /> Voltar
          </button>

          {isOrganizer && !isTrashed && (
            <button
              onClick={onEditBanner}
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
  );
}
