import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronRight, ChevronLeft, Save, Check, Image as ImageIcon, X, AlertTriangle } from "lucide-react";
import { AddressFields } from "../address/AddressFields";
import type { Category } from "../../../types/Category";
import { api } from "../../../services/api";

const eventSchema = z.object({
  name: z.string().min(3, "Nome é obrigatório"),
  description: z.string().min(10, "Descrição muito curta"),
  start_date_time: z.string().min(1, "Data de início é obrigatória"),
  end_date_time: z.string().min(1, "Data de término é obrigatória"),
  registration_deadline: z.string().min(1, "Prazo de inscrição é obrigatório"),
  category_id: z.coerce.number().min(1, "Selecione uma categoria válida"),
  speaker: z.string().min(3, "Nome do palestrante é obrigatório"),
  capacity: z.coerce.number().min(1, "Mínimo 1 pessoa"),
  hours: z.coerce.number().min(1, "Mínimo 1 hora"),
  price: z.coerce.number().min(0, "Preço inválido"),
  is_external: z.boolean().default(false),
  references_id: z.coerce.number().nullable().optional(),
  address: z.object({
    street_zipcode: z.string().min(8, "CEP inválido"),
    street_name: z.string().min(3, "Rua é obrigatória"),
    house_number: z.string().min(1, "Número é obrigatório"),
    neighborhood: z.string().min(3, "Bairro é obrigatório"),
    city_name: z.string().min(2, "Cidade é obrigatória"),
    state: z.string().length(2, "Use a sigla (ex: MG)"),
    complement: z.string().optional(),
    reference_point: z.string().optional(),
  }),
});

export type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  initialData?: Partial<EventFormData>;
  onSubmit: (data: EventFormData, bannerFile?: File, setError?: any) => void; 
  isSubmitting: boolean;
  buttonText: string;
}

const DRAFT_KEY = "@Eventos:CreateEventDraft";
const TOTAL_STEPS = 3;

export function EventForm({
  initialData,
  onSubmit,
  isSubmitting,
  buttonText,
}: EventFormProps) {
  const savedDraft = sessionStorage.getItem(DRAFT_KEY);
  const parsedDraft = savedDraft ? JSON.parse(savedDraft) : null;

  const [step, setStep] = useState(initialData ? 1 : parsedDraft?.step || 1);
  const [furthestStep, setFurthestStep] = useState(
    initialData ? TOTAL_STEPS : parsedDraft?.step || 1,
  );

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    async function loadingCategories() {
      try {
        const response = await api.get('/category');
        const data = response.data.data || response.data;
        setCategories(data);
      } catch (error) {
        console.error('Erro ao carregar as categorias: ', error);
      } finally {
        setLoadingCategories(false);
      }
    }
    loadingCategories();
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    setError,
    clearErrors,
    setValue
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema) as any,
    defaultValues: initialData || parsedDraft?.data || { is_external: false },
  });

  const currentFormData = watch();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bannerFile, setBannerFile] = useState<File | undefined>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const processFile = (file: File | null) => {
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert("Formato inválido. Use PNG, JPG, JPEG ou WEBP.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("A imagem é muito pesada. O tamanho máximo é 5MB.");
      return;
    }

    setBannerFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0] || null;
    processFile(file);
  };

  const handleRemoveImage = () => {
    setBannerFile(undefined);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    if (!initialData) {
      sessionStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ step, data: currentFormData }),
      );
    }
  }, [step, currentFormData, initialData]);

  const getFieldsForStep = (stepNumber: number) => {
    if (stepNumber === 1)
      return ["name", "speaker", "description", "capacity", "hours", "price", "category_id"];
    if (stepNumber === 2)
      return ["start_date_time", "end_date_time", "registration_deadline"];
    return [];
  };

  const handleNextStep = async () => {
    const fieldsToValidate = getFieldsForStep(step);
    const isValid = await trigger(fieldsToValidate as any);

    if (isValid) {
      const next = step + 1;
      setStep(next);
      if (next > furthestStep) setFurthestStep(next);
    }
  };

  const handleTabClick = async (targetStep: number) => {
    if (targetStep > step) {
      const fieldsToValidate = getFieldsForStep(step);
      const isValid = await trigger(fieldsToValidate as any);
      if (!isValid) return;
    }
    setStep(targetStep);
  };

  const handleCancel = () => {
    sessionStorage.removeItem(DRAFT_KEY);
    window.history.back();
  };

  const tabsConfig = [
    { id: 1, title: "Informações Básicas" },
    { id: 2, title: "Agendamento" },
    { id: 3, title: "Localização" },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      {/* HEADER DE ABAS */}
      <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-center overflow-x-auto">
        {tabsConfig.map((tab, index) => {
          const isUnlocked = initialData ? true : tab.id <= furthestStep;
          const isActive = step === tab.id;
          const isCompleted = tab.id < step;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              disabled={!isUnlocked}
              className={`flex items-center gap-2 transition-all shrink-0 ${!isUnlocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-80"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : isCompleted
                      ? "bg-green-500 text-white"
                      : "bg-slate-200 text-slate-500"
                }`}
              >
                {isCompleted ? <Check size={16} strokeWidth={3} /> : tab.id}
              </div>
              <span
                className={`hidden md:block text-sm font-semibold ${isActive ? "text-blue-600" : "text-slate-500"}`}
              >
                {tab.title}
              </span>

              {index < tabsConfig.length - 1 && (
                <div
                  className={`hidden md:block w-8 lg:w-16 h-px mx-4 ${isCompleted ? "bg-green-500" : "bg-slate-300"}`}
                />
              )}
            </button>
          );
        })}
      </div>

      <form
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
        className="p-4 md:p-8"
      >
        
        <div className={step === 1 ? "space-y-6" : "hidden"}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Nome do Evento *</label>
              <input
                {...register("name")}
                placeholder="Ex: Workshop de React"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Palestrante *</label>
              <input
                {...register("speaker")}
                placeholder="Nome de quem vai ministrar"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              {errors.speaker && <p className="text-red-500 text-xs mt-1">{errors.speaker.message}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">Descrição *</label>
            <textarea
              {...register("description")}
              rows={4}
              placeholder="O que os participantes vão aprender?"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Vagas *</label>
              <input
                type="number"
                {...register("capacity")}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Carga Horária *</label>
              <input
                type="number"
                {...register("hours")}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              {errors.hours && <p className="text-red-500 text-xs mt-1">{errors.hours.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Preço *</label>
              <input
                type="number"
                step="0.01"
                {...register("price")}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Categoria *</label>
              <select 
                {...register('category_id')}
                disabled={loadingCategories}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-50"
              >
                <option value=''>
                  {loadingCategories ? 'Carregando...' : 'Selecione'}
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5 col-span-full">
            <label className="text-sm font-semibold text-slate-700 ml-1">Banner do Evento</label>
            <input 
              type="file" 
              ref={fileInputRef}
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={(e) => processFile(e.target.files?.[0] || null)}
              className="hidden" 
            />

            {previewUrl ? (
              <div className="relative group rounded-2xl overflow-hidden border border-slate-100 shadow-inner bg-slate-50">
                <img src={previewUrl} alt="Banner Preview" className="w-full h-48 lg:h-64 object-cover" />
                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white/90 hover:bg-white text-slate-800 text-sm font-bold px-4 py-2 rounded-lg transition-all active:scale-95 cursor-pointer"
                  >
                    Alterar Imagem
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="bg-red-600/90 hover:bg-red-600 text-white p-2 rounded-lg transition-all active:scale-95 cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-full h-48 lg:h-56 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 px-6 text-center transition-all cursor-pointer ${
                  isDragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100/50"
                }`}
              >
                <div className={`p-4 rounded-full transition-colors ${isDragActive ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}>
                  <ImageIcon size={32} />
                </div>
                <div>
                  <p className="font-bold text-slate-700">Clique para fazer upload</p>
                  <p className="text-sm text-slate-500 mt-0.5">ou arraste e solte a imagem aqui</p>
                </div>
                <p className="text-xs text-slate-400 mt-2">Formatos: PNG, JPG, JPEG, WEBP (Máx. 5MB)</p>
              </button>
            )}
          </div>

        </div>

        <div className={step === 2 ? "space-y-6" : "hidden"}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Início *</label>
              <input
                type="datetime-local"
                {...register("start_date_time")}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              {errors.start_date_time && <p className="text-red-500 text-xs mt-1">{errors.start_date_time.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Término *</label>
              <input
                type="datetime-local"
                {...register("end_date_time")}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              {errors.end_date_time && <p className="text-red-500 text-xs mt-1">{errors.end_date_time.message}</p>}
            </div>
          </div>
          <div className="space-y-1.5 max-w-md">
            <label className="text-sm font-semibold text-slate-700 ml-1">Prazo de Inscrição *</label>
            <input
              type="datetime-local"
              {...register("registration_deadline")}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            {errors.registration_deadline && <p className="text-red-500 text-xs mt-1">{errors.registration_deadline.message}</p>}
          </div>
        </div>

        <div className={step === 3 ? "space-y-6" : "hidden"}>
          <AddressFields 
          register={register}
          errors={errors}
          watch={watch}
          setValue={setValue}
          prefix="address."
          />
        </div>

        {errors.root?.message && (
          <div className="mt-8 animate-in fade-in slide-in-from-top-2">
            <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-3 border border-red-200 shadow-sm">
              <AlertTriangle size={20} className="shrink-0 mt-0.5 text-red-500" />
              <p className="text-sm font-medium">{errors.root.message}</p>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between items-center border-t border-slate-100 pt-8">
          <button
            type="button"
            onClick={() => (step > 1 ? setStep(step - 1) : handleCancel())}
            className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-700 transition-colors cursor-pointer"
          >
            <ChevronLeft size={20} />
            {step === 1 ? "Cancelar" : "Voltar"}
          </button>

          {step < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-100 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              Continuar
              <ChevronRight size={20} />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit((data) => {
                sessionStorage.removeItem(DRAFT_KEY);
                clearErrors('root'); // 👈 O pulo do gato! Limpamos o erro aqui.
                onSubmit(data, bannerFile, setError);
              })}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-10 rounded-xl shadow-lg shadow-green-100 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save size={20} />
                  {buttonText}
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

