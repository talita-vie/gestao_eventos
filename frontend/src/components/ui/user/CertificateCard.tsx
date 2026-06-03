import { Award, Calendar, CheckCircle2, Eye, Loader2 } from "lucide-react";
import type { Certificate } from "../../../types/Certificate";

interface CertificateCardProps {
  record: Certificate;
  onViewCertificate: (value: number) => void;
  viewingId: number | null;
}

export function CertificateCard({record, onViewCertificate, viewingId}: CertificateCardProps) {
    return (
        <div 
                key={record.id} 
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md hover:border-blue-200 transition-all group flex flex-col"
              >
                <div className="bg-slate-50 p-6 border-b border-slate-100 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-green-100 text-green-700 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 size={12} strokeWidth={3} /> Emitido
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg leading-snug mb-3 line-clamp-2">
                    {record.event_title_snapshot}
                  </h3>
                  
                  <div className="space-y-2 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-slate-400" />
                      <span>{record.event_start_date_snapshot}</span>
                    </div>
                    {record.event_hours_snapshot && (
                      <div className="flex items-center gap-2">
                        <Award size={14} className="text-slate-400" />
                        <span>Carga Horária: {record.event_hours_snapshot}h</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-white">
                  <button
                    onClick={() => onViewCertificate(record.id)}
                    disabled={viewingId === record.id}
                    className="w-full bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white disabled:opacity-50 disabled:bg-slate-100 disabled:text-slate-400 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    {viewingId === record.id ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Gerando Visualização...
                      </>
                    ) : (
                      <>
                        <Eye size={18} /> Visualizar Certificado
                      </>
                    )}
                  </button>
                </div>
              </div>
    )
}