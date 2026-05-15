import { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import type { Event } from '../../../types/Event'; 

export function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await api.get('/events');
        
        const dataList = response.data.data ? response.data.data : response.data;
        console.log("Data: ", dataList);
        
        setEvents(dataList);
      } catch (err) {
        console.error(err);
        setError('Não foi possível carregar os dados. Verifique sua conexão.');
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Eventos
        </h1>
        {/* Um botão visual para o futuro formulário de criação */}
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition">
          + Novo
        </button>
      </div>

      {/* 1. Estado de Carregamento */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <p className="text-blue-600 font-semibold text-lg animate-pulse">Buscando dados no banco...</p>
        </div>
      )}

      {/* 2. Estado de Erro */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* 3. Estado Vazio (Nenhum dado cadastrado) */}
      {!loading && !error && events.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
          <span className="text-4xl">📭</span>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhum registro encontrado</h3>
          <p className="text-gray-500 mt-1">Comece criando o seu primeiro projeto ou evento!</p>
        </div>
      )}

      {/* 4. Lista de Cartões (Grid) */}
      {!loading && !error && events.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2 truncate">
                  {event.name}
                </h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {event.description}
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                    {/* Se tiver categoria ou status, coloque aqui */}
                    Status/Categoria
                  </span>
                  <span className="text-gray-500 font-medium">
                    📅 {event.start_date_time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}