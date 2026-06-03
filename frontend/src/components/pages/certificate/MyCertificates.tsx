import { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { Award, FileText } from 'lucide-react';
import { isAxiosError } from 'axios';
import { Link } from 'react-router-dom';
import type { Certificate } from '../../../types/Certificate';
import { CertificateCard } from '../../ui/user/CertificateCard';


export function MyCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingId, setViewingId] = useState<number | null>(null);

  useEffect(() => {
    async function loadCertificates() {
      try {
        const response = await api.get('/certificate/me'); 
        const data = response.data.data.data || response.data;
        setCertificates(data);
      } catch (error) {
        console.error("Erro ao carregar certificados:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCertificates();
  }, []);

  const handleViewCertificate = async (certificateId: number) => {
    setViewingId(certificateId);
    try {
      const response = await api.get(`/certificate/${certificateId}/view`);

      const pdfBase64 = response.data.data.pdf_base64;

      if(!pdfBase64) {
        throw new Error('PDF não encontrado na resposta.')
      }

      const base64Response = await fetch(`data:application/pdf;base64,${pdfBase64}`);
      const blob = await base64Response.blob();

      const fileURL = window.URL.createObjectURL(blob);
      
      window.open(fileURL, '_blank')
    } catch (error) {
      console.error(error);
      if (isAxiosError(error) && error.response?.status === 404) {
        alert("O certificado deste evento ainda não está disponível.");
      } else {
        alert("Erro ao tentar visualizar o certificado. Tente novamente.");
      }
    } finally {
      setViewingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans pb-20">
      <div className="max-w-6xl mx-auto space-y-8">

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 text-blue-600 p-2.5 rounded-xl">
              <Award size={24} />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">Meus Certificados</h1>
          </div>
          <p className="text-slate-500">
            Acesse e baixe os certificados dos eventos em que sua presença foi confirmada.
          </p>
        </header>

        {certificates.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-12 flex flex-col items-center justify-center text-center">
            <div className="bg-slate-50 p-6 rounded-full mb-6 border border-slate-100">
              <FileText size={48} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Nenhum certificado disponível</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
              Você ainda não possui certificados liberados. Lembre-se que o certificado só é gerado após o organizador confirmar o seu check-in no dia do evento.
            </p>
            <Link 
              to="/my-events" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all active:scale-95 shadow-md shadow-blue-100"
            >
              Ver meus eventos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((record) => (
              <CertificateCard
                record={record}
                onViewCertificate={handleViewCertificate}
                viewingId={viewingId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

