import { type RefObject } from 'react';
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  ImagePlus,
  RotateCcw,
  X,
} from 'lucide-react';
import type { Event } from '../../../../types/Event';
import type { EventDetailsModalType } from '../../../../hooks/event_details/useEventDetails';

interface EventDetailsModalProps {
  event: Event;
  modalType: EventDetailsModalType;
  onClose: () => void;
  statusError: string | null;
  isSubmitting: boolean;
  isDeleting: boolean;
  isRestoring: boolean;
  isActionSubmitting: boolean;
  previewUrl: string | null;
  bannerFile: File | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleBannerSelect: (file: File | null) => void;
  handleSaveBanner: () => Promise<void>;
  handleDeleteBanner: () => Promise<void>;
  handleSubscribe: () => Promise<void>;
  handleUnsubscribe: () => Promise<void>;
  handleDeleteEvent: () => Promise<void>;
  handleRestoreEvent: () => Promise<void>;
  handleEventStatusAction: (action: 'publish' | 'paused' | 'canceled' | 'finish') => Promise<void>;
  resetBannerState: () => void;
  formatPrice: (price: string) => string;
  formatDate: (date: string) => string;
}

export function EventDetailsModal({
  event,
  modalType,
  onClose,
  statusError,
  isSubmitting,
  isDeleting,
  isRestoring,
  isActionSubmitting,
  previewUrl,
  bannerFile,
  fileInputRef,
  handleBannerSelect,
  handleSaveBanner,
  handleDeleteBanner,
  handleSubscribe,
  handleUnsubscribe,
  handleDeleteEvent,
  handleRestoreEvent,
  handleEventStatusAction,
  resetBannerState,
  formatPrice,
  formatDate,
}: EventDetailsModalProps) {
  if (!modalType) return null;

  const closeModal = () => {
    onClose();
    resetBannerState();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-left">
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              modalType === 'subscribe' || modalType === 'restore' || modalType === 'edit_banner' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
            }`}>
              {modalType === 'subscribe' ? <CheckCircle2 size={28} /> :
               modalType === 'restore' ? <RotateCcw size={28} /> :
               modalType === 'edit_banner' ? <Camera size={28} /> :
               <AlertCircle size={28} />}
            </div>
            <button
              onClick={closeModal}
              className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {modalType === 'subscribe' ? (
            <>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Confirmar Inscrição</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Você está prestes a se inscrever no evento <strong className="text-slate-800">"{event.name}"</strong>.
                {parseFloat(event.price) > 0 && ' Será necessário realizar o pagamento posteriormente via plataforma.'}
              </p>

              <div className="bg-slate-50 p-4 rounded-xl mb-8 border border-slate-100 text-sm space-y-2 shadow-inner">
                <div className="flex justify-between">
                  <span className="text-slate-500">Valor:</span>
                  <span className="font-bold text-slate-800">{formatPrice(event.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Data limite:</span>
                  <span className="font-semibold text-slate-800">{formatDate(event.registration_deadline)}</span>
                </div>
              </div>

              <div className="flex flex-col-reverse md:flex-row gap-3">
                <button onClick={closeModal} disabled={isSubmitting} className="flex-1 px-6 py-3.5 rounded-xl font-bold text-slate-600 bg-white border-2 border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer">
                  Cancelar
                </button>
                <button onClick={handleSubscribe} disabled={isSubmitting} className="flex-1 px-6 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-70 flex justify-center items-center cursor-pointer">
                  {isSubmitting ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Confirmar Inscrição'}
                </button>
              </div>
            </>
          ) : modalType === 'unsubscribe' ? (
            <>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Desistir do Evento?</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Tem certeza que deseja cancelar sua inscrição em <strong className="text-slate-800">"{event.name}"</strong>? Sua vaga será liberada para outras pessoas da fila de espera.
              </p>

              <div className="flex flex-col-reverse md:flex-row gap-3 mt-8">
                <button onClick={closeModal} disabled={isSubmitting} className="flex-1 px-6 py-3.5 rounded-xl font-bold text-slate-600 bg-white border-2 border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer">
                  Voltar
                </button>
                <button onClick={handleUnsubscribe} disabled={isSubmitting} className="flex-1 px-6 py-3.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95 disabled:opacity-70 flex justify-center items-center cursor-pointer">
                  {isSubmitting ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Sim, Cancelar'}
                </button>
              </div>
            </>
          ) : modalType === 'delete' ? (
            <>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Excluir Evento?</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Tem certeza que deseja excluir o evento <strong className="text-slate-800">"{event.name}"</strong>? Ele será enviado para a lixeira e ocultado do público, mas você poderá restaurá-lo depois se precisar.
              </p>

              <div className="flex flex-col-reverse md:flex-row gap-3 mt-8">
                <button onClick={closeModal} disabled={isDeleting} className="flex-1 px-6 py-3.5 rounded-xl font-bold text-slate-600 bg-white border-2 border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer">
                  Voltar
                </button>
                <button onClick={handleDeleteEvent} disabled={isDeleting} className="flex-1 px-6 py-3.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95 disabled:opacity-70 flex justify-center items-center cursor-pointer">
                  {isDeleting ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Sim, Excluir'}
                </button>
              </div>
            </>
          ) : modalType === 'cancel_event' ? (
            <>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Cancelar Evento?</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Tem certeza que deseja cancelar o evento <strong className="text-slate-800">"{event.name}"</strong>?
                Isso impedirá novas inscrições e alterará o status do evento imediatamente, notificando os inscritos. Esta ação não pode ser desfeita.
              </p>

              <div className="flex flex-col-reverse md:flex-row gap-3 mt-8">
                <button onClick={closeModal} disabled={isActionSubmitting} className="flex-1 px-6 py-3.5 rounded-xl font-bold text-slate-600 bg-white border-2 border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer">
                  Voltar
                </button>
                <button onClick={async () => {
                  await handleEventStatusAction('canceled');
                  closeModal();
                }} disabled={isActionSubmitting} className="flex-1 px-6 py-3.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95 disabled:opacity-70 flex justify-center items-center cursor-pointer">
                  {isActionSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    'Sim, Cancelar Evento'
                  )}
                </button>
              </div>
            </>
          ) : modalType === 'restore' ? (
            <>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Restaurar Evento?</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Deseja recuperar o evento <strong className="text-slate-800">"{event.name}"</strong> da lixeira? Ele voltará ao estado exato (Rascunho ou Publicado) em que estava antes da exclusão.
              </p>

              <div className="flex flex-col-reverse md:flex-row gap-3 mt-8">
                <button onClick={closeModal} disabled={isRestoring} className="flex-1 px-6 py-3.5 rounded-xl font-bold text-slate-600 bg-white border-2 border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer">
                  Cancelar
                </button>
                <button onClick={handleRestoreEvent} disabled={isRestoring} className="flex-1 px-6 py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-95 disabled:opacity-70 flex justify-center items-center cursor-pointer">
                  {isRestoring ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Sim, Restaurar'}
                </button>
              </div>
            </>
          ) : modalType === 'edit_banner' ? (
            <>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Imagem de Capa</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Escolha uma nova imagem para destacar o seu evento na listagem geral.
              </p>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={(e) => handleBannerSelect(e.target.files?.[0] || null)}
                className="hidden"
              />

              {previewUrl ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-50 group">
                  <img src={previewUrl} alt="Preview do Banner" className="w-full h-48 object-cover animate-in fade-in duration-300" />
                  <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white text-slate-800 font-bold px-5 py-2.5 rounded-xl text-sm transition-transform active:scale-95 cursor-pointer shadow-xl flex items-center gap-2"
                    >
                      <ImagePlus size={16} />
                      Trocar Imagem
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-48 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-blue-400 flex flex-col items-center justify-center gap-3 text-slate-500 transition-all cursor-pointer shadow-inner animate-in fade-in"
                >
                  <div className="bg-white p-3 rounded-full shadow-sm border border-slate-100">
                    <ImagePlus size={24} className="text-blue-500" />
                  </div>
                  <span className="font-semibold">Clique para enviar uma foto</span>
                  <span className="text-xs text-slate-400">JPG, PNG ou WEBP (Max 5MB)</span>
                </button>
              )}

              {statusError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm animate-in fade-in slide-in-from-top-1">
                  <AlertCircle size={18} className='shrink-0 mt-0.5 text-red-500' />
                  <p className="font-medium">{statusError}</p>
                </div>
              )}

              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
                {event.banner_path && !bannerFile ? (
                  <button
                    onClick={handleDeleteBanner}
                    disabled={isActionSubmitting}
                    className="w-full md:w-auto px-6 py-3.5 rounded-xl font-bold text-red-600 bg-red-50 hover:bg-red-100 shadow-lg border border-red-100 transition-all active:scale-95 disabled:opacity-70 flex justify-center items-center cursor-pointer"
                  >
                    Remover Capa
                  </button>
                ) : (
                  <div className="hidden md:block w-full md:w-auto"></div>
                )}

                <div className="flex flex-col-reverse md:flex-row gap-3 w-full md:w-auto">
                  <button
                    onClick={closeModal}
                    disabled={isActionSubmitting}
                    className="w-full md:w-auto px-6 py-3.5 rounded-xl font-bold text-slate-600 bg-white border-2 border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveBanner}
                    disabled={isActionSubmitting || !bannerFile}
                    className="w-full md:w-auto px-6 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-70 flex justify-center items-center cursor-pointer"
                  >
                    {isActionSubmitting ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      'Salvar Capa'
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
