import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Link } from 'react-router-dom';
import type { Event } from '../../types/Event';
import { CardEvents } from '../ui/events/CardEvents';

export function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await api.get('/events');
        const dataList = response.data.data ? response.data.data : response.data;

        setEvents(dataList);
      } catch (err) {
        console.error(err);
        setError('Não foi possível carregar os eventos.');
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Eventos Disponíveis</h1>
            <p className="text-slate-500 mt-1">Descubra e participe dos melhores projetos e eventos.</p>
          </div>
          <Link 
            to="/new-event" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            + Criar Evento
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-center font-medium">
            {error}
          </div>
        )}

        {!loading && !error && (
          events.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <span className="text-4xl block mb-4">
                  🎟️
                </span>
                <h3 className="text-lg font-bold text-slate-800 mb-5">
                  Nenhum evento por aqui
                </h3>
                <p className="text-slate-500 mt-1 mx-auto text-sm">
                  AInda não há eventos disponíveis ou publicados no sistema. <br></br>
                  Volte mais tarde ou seja o primeiro a criar um evento!
                </p>
              </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <CardEvents key={event.id} event={event} />
            ))}
          </div>
          )
          
        )}

      </div>
    </div>
  );
}