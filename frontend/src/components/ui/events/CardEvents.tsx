import { ArrowRight, Calendar, MapPin, User } from "lucide-react";
import { Link } from "react-router-dom";
import type { Event } from "../../../types/Event";

interface EventCardProps {
  event: Event;
}

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
    .format(date)
    .replace("de", "")
    .replace(":", "h");
};

const formatPrice = (price: string) => {
  const numPrice = parseFloat(price);
  if (numPrice === 0)
    return <span className="text-green-600 font-bold">Gratuito</span>;
  return (
    <span className="text-slate-800 font-bold">
      R$ {numPrice.toFixed(2).replace(".", ",")}
    </span>
  );
};

export function CardEvents({ event }: EventCardProps) {
  return (
    <div
      key={event.id}
      className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden group hover:shadow-[0_20px_50px_rgba(8,112,184,0.07)] hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      {/* 1. Banner do Evento */}
      <div className="relative h-48 bg-slate-200 overflow-hidden">
        {event.banner_path ? (
          <img
            src={`http://localhost:8000/storage/${event.banner_path}`}
            alt={event.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          // Fallback para eventos sem banner (Um gradiente bonito)
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-50 flex items-center justify-center">
            <span className="text-4xl">🎟️</span>
          </div>
        )}
        {/* Etiqueta de Preço por cima da imagem */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm shadow-sm">
          {formatPrice(event.price)}
        </div>
      </div>

      {/* 2. Conteúdo do Card */}
      <div className="p-6 flex flex-col flex-grow">
        <h2
          className="text-xl font-bold text-slate-800 mb-2 line-clamp-1"
          title={event.name}
        >
          {event.name}
        </h2>

        <p className="text-slate-500 text-sm mb-5 line-clamp-2 flex-grow">
          {event.description}
        </p>

        {/* Informações Rápidas (Data, Local, Organizador) */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center text-sm text-slate-600">
            <Calendar size={16} className="text-blue-500 mr-2 shrink-0" />
            <span>{formatDateTime(event.start_date_time)}</span>
          </div>

          {event.address?.city_name && (
            <div className="flex items-center text-sm text-slate-600">
              <MapPin size={16} className="text-blue-500 mr-2 shrink-0" />
              <span>
                {event.address.city_name} - {event.address.state}
              </span>
            </div>
          )}

          <div className="flex items-center text-sm text-slate-600">
            <User size={16} className="text-blue-500 mr-2 shrink-0" />
            <span className="truncate">
              Org: {event.user?.name || "Não informado"}
            </span>
          </div>
        </div>

        <Link
          to={`/event/${event.id}`}
          className="w-full inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-blue-50 text-blue-600 font-semibold py-3 rounded-xl transition-colors duration-300"
        >
          Visualizar detalhes
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
