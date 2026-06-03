import { useEffect, useState } from "react";
import { api } from "../../../services/api";
import { Link } from "react-router-dom";
import { Ticket, Crown, Trash2 } from "lucide-react";
import type { Event } from "../../../types/Event";
import { isAxiosError } from "axios";
import { CardEvents } from "../../ui/events/CardEvents";

type PaginatedState = {
  data: Event[];
  currentPage: number;
  lastPage: number;
  total: number;
};

const initialState: PaginatedState = {
  data: [],
  currentPage: 1,
  lastPage: 1,
  total: 0,
};

export function MyEvents() {
  const [activeTab, setActiveTab] = useState<"participant" | "organizer" | "trashed">(
    "participant"
  );

  const [participating, setParticipating] = useState<PaginatedState>(initialState);
  const [organized, setOrganized] = useState<PaginatedState>(initialState);
  const [trashed, setTrashed] = useState<PaginatedState>(initialState);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const extractPagination = (response: any) => {
    const responseData = response.data.data;

    return {
      data: responseData.data || [],
      currentPage: responseData.current_page || 1,
      lastPage: responseData.last_page || 1,
      total: responseData.total || 0,
    };
  };

  useEffect(() => {
    async function loadInitialEvents() {
      try {
        setLoading(true);
        try {
          const registrationsRes = await api.get("/registrations-me?page=1");
          setParticipating(extractPagination(registrationsRes));
        } catch (regError) {
          console.error("Erro ao carregar inscrições:", regError);
          setParticipating(initialState);
        }
        try {
          const organizedRes = await api.get("/organizer/events/me?page=1");
          setOrganized(extractPagination(organizedRes));
        } catch (orgError) {
          if (isAxiosError(orgError) && orgError.response?.status === 403) {
            console.log("Usuário não é um organizador. Definindo lista como vazia.");
          } else {
            console.error("Outro erro ao carregar eventos organizados:", orgError);
          }
          setOrganized(initialState);
        }

        try {
          const trashedRes = await api.get("/organizer/events/trashed?page=1"); 
          setTrashed(extractPagination(trashedRes));
        } catch (trashError) {
          if (isAxiosError(trashError) && trashError.response?.status === 403) {
          } else {
            console.error("Erro ao carregar lixeira:", trashError);
          }
          setTrashed(initialState);
        }

      } catch (globalError) {
        console.error("Erro crítico no carregamento inicial:", globalError);
      } finally {
        setLoading(false);
      }
    }

    loadInitialEvents();
  }, []);

  const handleLoadMore = async () => {
    const currentState = activeTab === "participant" 
      ? participating 
      : activeTab === "organizer" 
        ? organized 
        : trashed;

    const endpoint = activeTab === "participant" 
      ? "registrations-me" 
      : activeTab === "organizer" 
        ? "/organizer/events/me" 
        : "/organizer/events/trashed";

    const nextPage = currentState.currentPage + 1;

    try {
      setLoadingMore(true);
      const response = await api.get(`${endpoint}?page=${nextPage}`);
      const newPaginatedData = extractPagination(response);
      console.log(newPaginatedData)

      if (activeTab === "participant") {
        setParticipating((prev) => ({
          ...newPaginatedData,
          data: [...prev.data, ...newPaginatedData.data],
        }));
      } else if (activeTab === "organizer") {
        setOrganized((prev) => ({
          ...newPaginatedData,
          data: [...prev.data, ...newPaginatedData.data],
        }));
      } else {
        setTrashed((prev) => ({
          ...newPaginatedData,
          data: [...prev.data, ...newPaginatedData.data],
        }));
      }
    } catch (error) {
      console.error("Erro ao carregar mais eventos", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const currentState = activeTab === "participant" 
    ? participating 
    : activeTab === "organizer" 
      ? organized 
      : trashed;

  const currentEvents = currentState.data;
  const hasMore = currentState.currentPage < currentState.lastPage;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Meus Eventos</h1>
          <p className="text-slate-500 mt-1">
            Gerencie suas inscrições e eventos criados.
          </p>
        </div>

        <div className="flex flex-wrap border-b border-slate-200 mb-8 gap-x-2">
          <button
            onClick={() => setActiveTab("participant")}
            className={`flex items-center gap-2 py-4 px-4 md:px-6 font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "participant"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Ticket size={18} />
            Inscrições
            <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full ml-1">
              {participating.total}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("organizer")}
            className={`flex items-center gap-2 py-4 px-4 md:px-6 font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "organizer"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Crown size={18} />
            Organizados
            <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full ml-1">
              {organized.total}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("trashed")}
            className={`flex items-center gap-2 py-4 px-4 md:px-6 font-semibold border-b-2 transition-all cursor-pointer ml-auto ${
              activeTab === "trashed"
                ? "border-red-600 text-red-600"
                : "border-transparent text-slate-400 hover:text-red-500"
            }`}
          >
            <Trash2 size={18} />
            Lixeira
            {trashed.total > 0 && (
              <span className="bg-red-50 text-red-600 text-xs px-2 py-0.5 rounded-full ml-1 font-bold">
                {trashed.total}
              </span>
            )}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {currentEvents.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <span className="text-4xl block mb-4">
                  {activeTab === "participant" ? "🎟️" : activeTab === "organizer" ? "📁" : "🗑️"}
                </span>
                <h3 className="text-lg font-bold text-slate-800">
                  {activeTab === "trashed" ? "Lixeira Vazia" : "Nenhum evento por aqui"}
                </h3>
                <p className="text-slate-500 mt-1 mx-auto text-sm">
                  {activeTab === "participant"
                    ? "Você ainda não se inscreveu em nenhum evento. Explore a página inicial!"
                    : activeTab === "organizer"
                    ? "Você ainda não criou nenhum evento no sistema."
                    : "Você não possui eventos excluídos no momento."}
                </p>
                {activeTab === "participant" && (
                  <Link
                    to="/"
                    className="inline-block mt-4 text-sm font-bold text-blue-600 hover:underline"
                  >
                    Ver eventos disponíveis →
                  </Link>
                )}
              </div>
            )}

            {currentEvents.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentEvents.map((event) => (
                  <CardEvents key={event.id} event={event} />
                ))}
              </div>
            )}

            {hasMore && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 px-8 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {loadingMore ? (
                    <>
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      Carregando...
                    </>
                  ) : (
                    "Carregar mais eventos"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

