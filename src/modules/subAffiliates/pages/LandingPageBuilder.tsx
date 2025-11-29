/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * LandingPageBuilder
 * 
 * Sub-affiliate landing page customization tool
 * Allows sub-affiliates to customize their partner landing pages
 * with StoryTime components, branding, and content
 */

import { FC, useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  Palette, 
  Type, 
  // Image, 
  Clock, 
  Gift, 
  DollarSign, 
  Users,
  Eye,
  Save,
  Copy,
  Share2
} from "lucide-react";

// Types
interface LandingPageConfig {
  id: string;
  partnerSlug: string;
  name: string;
  title: string;
  subtitle: string;
  description: string;
  avatar?: string;
  coverImage?: string;
  primaryColor: string;
  secondaryColor: string;
  payoutAmount: number;
  totalEarnings: number;
  successStories: number;
  isLive: boolean;
  liveEvent?: {
    title: string;
    startTime: string;
    duration: number;
  };
  giveaway?: {
    title: string;
    description: string;
    prize: string;
    endTime: string;
  };
  ctaText: string;
  ctaLink: string;
  showCountdown: boolean;
  showGiveaway: boolean;
  showPayouts: boolean;
  showEventCounter: boolean;
}

const LandingPageBuilder: FC = () => {
  const { registrationsReport, deal } = useOutletContext<any>();
  const [config, setConfig] = useState<LandingPageConfig>({
    id: "1",
    partnerSlug: "john",
    name: "John Doe",
    title: "Expert Investor & Trading Academy Leader",
    subtitle: "Transforma tu vida financiera con mi metodología única",
    description: "Más de 9 años de experiencia en el mercado financiero. Líder de la academia de trading más grande y reconocida, con más de 15,431 estudiantes transformados en inversores exitosos.",
    primaryColor: "#10B981",
    secondaryColor: "#F59E0B",
    payoutAmount: 2847.50,
    totalEarnings: 125000,
    successStories: 15431,
    isLive: true,
    liveEvent: {
      title: "CÓDIGO ALPHA - Último Evento del Año",
      startTime: "2024-12-31T20:00:00Z",
      duration: 120
    },
    giveaway: {
      title: "¡Última Oportunidad!",
      description: "Regístrate ahora y obtén tu entrada al evento exclusivo",
      prize: "Acceso VIP + Estrategia Alpha Vision™",
      endTime: "2024-12-31T19:30:00Z"
    },
    ctaText: "¡COMPLETAR REGISTRO!",
    ctaLink: "#register",
    showCountdown: true,
    showGiveaway: true,
    showPayouts: true,
    showEventCounter: true
  });

  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'storytime' | 'preview'>('content');
  const [, setIsPreviewOpen] = useState(false);

  // Calculate earnings from registrations
  useEffect(() => {
    if (registrationsReport && registrationsReport.length > 0) {
      const totalEarnings = registrationsReport.reduce((sum: number, reg: any) => 
        sum + (reg.commission || 0), 0
      );
      const successStories = registrationsReport.length;
      
      setConfig(prev => ({
        ...prev,
        totalEarnings,
        successStories,
        payoutAmount: Math.max(totalEarnings * 0.1, 100) // 10% of total or minimum $100
      }));
    }
  }, [registrationsReport]);

  const handleConfigChange = (field: keyof LandingPageConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      // In production, save to API
      console.log('Saving config:', config);
      // await api.post('/partners/landing-config', config);
      alert('Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Error al guardar la configuración');
    }
  };

  const copyPartnerUrl = () => {
    const url = `${window.location.origin}/partner/${config.partnerSlug}`;
    navigator.clipboard.writeText(url);
    alert('URL copiada al portapapeles');
  };

  const sharePartnerUrl = () => {
    const url = `${window.location.origin}/partner/${config.partnerSlug}`;
    if (navigator.share) {
      navigator.share({
        title: `Únete a ${config.name}`,
        text: config.description,
        url: url
      });
    } else {
      copyPartnerUrl();
    }
  };

  const tabs = [
    { id: 'content', label: 'Contenido', icon: Type },
    { id: 'design', label: 'Diseño', icon: Palette },
    { id: 'storytime', label: 'StoryTime', icon: Clock },
    { id: 'preview', label: 'Vista Previa', icon: Eye }
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      {/* Header */}
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 p-6">
        <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
          Constructor de Landing Page
        </h1>
        <p className="text-indigo-100">
          Personaliza tu página de partner para maximizar conversiones
        </p>
      </div>

      {/* Partner URL Display */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
              Tu URL de Partner
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {window.location.origin}/partner/{config.partnerSlug}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={copyPartnerUrl}
              className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
            >
              <Copy size={16} />
              Copiar
            </button>
            <button
              onClick={sharePartnerUrl}
              className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
            >
              <Share2 size={16} />
              Compartir
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-400 to-fuchsia-500 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700/50 dark:hover:text-white'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Configuration Panel */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            {activeTab === 'content' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
                  Información Personal
                </h3>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={config.name}
                      onChange={(e) => handleConfigChange('name', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Slug (URL)
                    </label>
                    <input
                      type="text"
                      value={config.partnerSlug}
                      onChange={(e) => handleConfigChange('partnerSlug', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Título Profesional
                  </label>
                  <input
                    type="text"
                    value={config.title}
                    onChange={(e) => handleConfigChange('title', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Subtítulo
                  </label>
                  <input
                    type="text"
                    value={config.subtitle}
                    onChange={(e) => handleConfigChange('subtitle', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={config.description}
                    onChange={(e) => handleConfigChange('description', e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Texto del Botón CTA
                  </label>
                  <input
                    type="text"
                    value={config.ctaText}
                    onChange={(e) => handleConfigChange('ctaText', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>
            )}

            {activeTab === 'design' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
                  Colores y Branding
                </h3>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Color Primario
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={config.primaryColor}
                        onChange={(e) => handleConfigChange('primaryColor', e.target.value)}
                        className="h-10 w-16 rounded-lg border border-slate-300"
                      />
                      <input
                        type="text"
                        value={config.primaryColor}
                        onChange={(e) => handleConfigChange('primaryColor', e.target.value)}
                        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Color Secundario
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={config.secondaryColor}
                        onChange={(e) => handleConfigChange('secondaryColor', e.target.value)}
                        className="h-10 w-16 rounded-lg border border-slate-300"
                      />
                      <input
                        type="text"
                        value={config.secondaryColor}
                        onChange={(e) => handleConfigChange('secondaryColor', e.target.value)}
                        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Ganancias Totales
                    </label>
                    <input
                      type="number"
                      value={config.totalEarnings}
                      onChange={(e) => handleConfigChange('totalEarnings', Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Último Retiro
                    </label>
                    <input
                      type="number"
                      value={config.payoutAmount}
                      onChange={(e) => handleConfigChange('payoutAmount', Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Estudiantes
                    </label>
                    <input
                      type="number"
                      value={config.successStories}
                      onChange={(e) => handleConfigChange('successStories', Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'storytime' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
                  Componentes StoryTime
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <Clock size={24} className="text-blue-500" />
                      <div>
                        <h4 className="font-semibold text-slate-800 dark:text-white">
                          Contador de Tiempo
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Muestra urgencia con countdown timers
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.showCountdown}
                        onChange={(e) => handleConfigChange('showCountdown', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <Gift size={24} className="text-purple-500" />
                      <div>
                        <h4 className="font-semibold text-slate-800 dark:text-white">
                          Giveaway Banner
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Promociona sorteos y ofertas especiales
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.showGiveaway}
                        onChange={(e) => handleConfigChange('showGiveaway', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <DollarSign size={24} className="text-green-500" />
                      <div>
                        <h4 className="font-semibold text-slate-800 dark:text-white">
                          Showcase de Payouts
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Destaca ganancias y éxito financiero
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.showPayouts}
                        onChange={(e) => handleConfigChange('showPayouts', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <Users size={24} className="text-orange-500" />
                      <div>
                        <h4 className="font-semibold text-slate-800 dark:text-white">
                          Contador de Eventos
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Muestra progreso hacia objetivos
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.showEventCounter}
                        onChange={(e) => handleConfigChange('showEventCounter', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preview' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
                  Vista Previa
                </h3>
                <div className="text-center">
                  <button
                    onClick={() => setIsPreviewOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-6 py-3 text-white hover:bg-indigo-600"
                  >
                    <Eye size={20} />
                    Ver Vista Previa Completa
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
              Estadísticas Rápidas
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Registros Totales</span>
                <span className="font-semibold text-slate-800 dark:text-white">
                  {registrationsReport?.length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Comisión Total</span>
                <span className="font-semibold text-slate-800 dark:text-white">
                  ${deal || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">URL Personalizada</span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  ✓ Activa
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-3 text-white hover:bg-green-600"
            >
              <Save size={20} />
              Guardar Cambios
            </button>
            
            <button
              onClick={() => window.open(`/partner/${config.partnerSlug}`, '_blank')}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-3 text-white hover:bg-blue-600"
            >
              <Eye size={20} />
              Ver Página Pública
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageBuilder;
