import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { EventDetailsHero } from '../../ui/events/event_details/EventDetailsHero';
import { EventDetailsLeftContent } from '../../ui/events/event_details/EventDetailsLeftContent';
import { EventDetailsSidebar } from '../../ui/events/event_details/EventDetailsSidebar';
import { EventDetailsModal } from '../../ui/events/event_details/EventDetailsModal';
import { useEventDetails } from '../../../hooks/event_details/useEventDetails';

export function EventDetails() {
  const {
    event,
    loading,
    error,
    modalType,
    setModalType,
    isOrganizer,
    isTrashed,
    statusError,
    isSubmitting,
    isDeleting,
    isRestoring,
    isActionSubmitting,
    bannerFile,
    previewUrl,
    fileInputRef,
    handleBannerSelect,
    handleSaveBanner,
    handleDeleteBanner,
    openEditBanner,
    handleEventStatusAction,
    handleRestoreEvent,
    handleSubscribe,
    handleUnsubscribe,
    handleDeleteEvent,
    resetBannerState,
    formatDate,
    formatPrice,
    formatTime,
    statusLabels,
  } = useEventDetails();

  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <AlertCircle size={48} className="text-slate-400 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Oops!</h2>
        <p className="text-slate-600 mb-6 text-center max-w-sm">{error}</p>
        <Link to="/" className="text-blue-600 font-semibold hover:underline">
          Voltar para a página inicial
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      <EventDetailsHero
        event={event}
        isOrganizer={isOrganizer}
        isTrashed={isTrashed}
        onBack={() => navigate(-1)}
        onEditBanner={openEditBanner}
        statusLabels={statusLabels}
        formatPrice={formatPrice}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-4 relative z-20">
        {isTrashed && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 md:p-6 mb-8 rounded-r-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start gap-4 text-left">
              <AlertCircle size={28} className="shrink-0 mt-1 text-red-600" />
              <div>
                <h3 className="font-bold text-lg text-red-800">Este evento está na lixeira</h3>
                <p className="text-red-700 mt-1">Ele foi excluído pelo organizador. Não está visível para o público e novas inscrições foram bloqueadas.</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-9 items-start">
          <div className="lg:col-span-8 space-y-9">
            <EventDetailsLeftContent
              event={event}
              isOrganizer={isOrganizer}
              isTrashed={isTrashed}
              statusError={statusError}
              isActionSubmitting={isActionSubmitting}
              handleEventStatusAction={handleEventStatusAction}
              onOpenCancelEvent={() => setModalType('cancel_event')}
              onEditEvent={() => navigate(`/event/${event.id}/edit`)}
              onOpenDelete={() => setModalType('delete')}
            />
          </div>

          <EventDetailsSidebar
            event={event}
            isOrganizer={isOrganizer}
            isTrashed={isTrashed}
            isDeleting={isDeleting}
            onOpenSubscribe={() => setModalType('subscribe')}
            onOpenUnsubscribe={() => setModalType('unsubscribe')}
            onNavigateParticipants={() => navigate(`/organizer/events/${event.id}/participants`)}
            onOpenDelete={() => setModalType('delete')}
            onEditEvent={() => navigate(`/event/${event.id}/edit`)}
            onOpenRestore={() => setModalType('restore')}
            formatDate={formatDate}
            formatTime={formatTime}
          />
        </div>
      </div>

      <EventDetailsModal
        event={event}
        modalType={modalType}
        onClose={() => setModalType(null)}
        statusError={statusError}
        isSubmitting={isSubmitting}
        isDeleting={isDeleting}
        isRestoring={isRestoring}
        isActionSubmitting={isActionSubmitting}
        previewUrl={previewUrl}
        bannerFile={bannerFile}
        fileInputRef={fileInputRef}
        handleBannerSelect={handleBannerSelect}
        handleSaveBanner={handleSaveBanner}
        handleDeleteBanner={handleDeleteBanner}
        handleSubscribe={handleSubscribe}
        handleUnsubscribe={handleUnsubscribe}
        handleDeleteEvent={handleDeleteEvent}
        handleRestoreEvent={handleRestoreEvent}
        handleEventStatusAction={handleEventStatusAction}
        resetBannerState={resetBannerState}
        formatPrice={formatPrice}
        formatDate={formatDate}
      />
    </div>
  );
}
