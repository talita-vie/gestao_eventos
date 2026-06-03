// src/components/ui/events/ParticipantStats.tsx
import { Users, UserCheck, Clock } from "lucide-react";

interface ParticipantStatsProps {
  totalInscritos: number;
  totalCheckins: number;
  totalPendentes: number;
}

export function ParticipantStats({
  totalInscritos,
  totalCheckins,
  totalPendentes,
}: ParticipantStatsProps) {
  return (
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
  );
}