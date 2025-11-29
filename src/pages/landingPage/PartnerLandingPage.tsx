/* eslint-disable react-hooks/exhaustive-deps */
/**
 * PartnerLandingPage
 * 
 * Dynamic landing page for sub-affiliates with customizable content.
 * Features:
 * - StoryTime components (counters, events, giveaways)
 * - Payout-focused messaging
 * - Customizable branding and content
 * - Mobile-optimized design
 */

import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import { Clock, Users, TrendingUp, Star, Gift, Calendar, DollarSign } from "lucide-react";

// StoryTime Components
import CountdownTimer from "@/components/storytime/CountdownTimer";
import EventCounter from "@/components/storytime/EventCounter";
import PayoutShowcase from "@/components/storytime/PayoutShowcase";
import GiveawayBanner from "@/components/storytime/GiveawayBanner";

// Types
interface PartnerConfig {
  id: string;
  slug: string;
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
}

const PartnerLandingPage: FC = () => {
  const { partnerSlug } = useParams<{ partnerSlug: string }>();
  const [partnerConfig, setPartnerConfig] = useState<PartnerConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data - In production, this would come from an API
  const mockPartnerConfig: PartnerConfig = {
    id: "1",
    slug: partnerSlug || "john",
    name: "David Vas",
    title: "Expert Investor & Trading Academy Leader",
    subtitle: "Transforma tu vida financiera con mi metodología única",
    description: "Más de 9 años de experiencia en el mercado financiero. Líder de la academia de trading más grande y reconocida, con más de 15,431 estudiantes transformados en inversores exitosos. Mi metodología única, lejos de esquemas piramidales, ha generado ingresos adicionales de $2,000 a $30,000 USD mensuales.",
    avatar: "/assets/images/david-vas-avatar.jpg",
    coverImage: "/assets/images/trading-background.jpg",
    primaryColor: "#10B981", // Green
    secondaryColor: "#F59E0B", // Amber
    payoutAmount: 2847.50,
    totalEarnings: 125000,
    successStories: 15431,
    isLive: true,
    liveEvent: {
      title: "CÓDIGO ALPHA - Último Evento del Año",
      startTime: "2024-12-31T20:00:00Z",
      duration: 120 // minutes
    },
    giveaway: {
      title: "¡Última Oportunidad!",
      description: "Regístrate ahora y obtén tu entrada al evento exclusivo",
      prize: "Acceso VIP + Estrategia Alpha Vision™",
      endTime: "2024-12-31T19:30:00Z"
    },
    ctaText: "¡COMPLETAR REGISTRO!",
    ctaLink: "#register"
  };

  useEffect(() => {
    // Simulate API call
    const fetchPartnerConfig = async () => {
      try {
        setIsLoading(true);
        // In production: const response = await api.get(`/partners/${partnerSlug}`);
        // For now, use mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPartnerConfig(mockPartnerConfig);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Partner not found");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartnerConfig();
  }, [partnerSlug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-white">Cargando página...</p>
        </div>
      </div>
    );
  }

  if (error || !partnerConfig) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Partner no encontrado</h1>
          <p>La página que buscas no existe.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile Status Bar */}
      <div className="flex justify-between items-center px-4 py-2 text-sm">
        <span>11:33</span>
        <div className="flex items-center gap-1">
          <div className="w-4 h-2 bg-yellow-500 rounded-sm"></div>
          <div className="w-4 h-2 bg-gray-600 rounded-sm"></div>
        </div>
      </div>

      {/* Live Event Banner */}
      {partnerConfig.isLive && partnerConfig.liveEvent && (
        <div className="bg-red-600 text-center py-2 px-4">
          <p className="font-bold text-sm">ÚLTIMO EVENTO DEL AÑO</p>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative px-4 py-8">
        {/* Background Gradient */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `linear-gradient(135deg, ${partnerConfig.primaryColor} 0%, #000000 100%)`
          }}
        ></div>

        {/* Main Title */}
        <div className="relative z-10 text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: partnerConfig.primaryColor }}>
            CÓDIGO
          </h1>
          <h2 className="text-3xl font-bold text-white">ALPHA</h2>
          <p className="text-lg text-gray-300 mt-4">
            "La nueva forma de anticipar el mercado"
          </p>
        </div>

        {/* Partner Info Card */}
        <div className="relative z-10 bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-black">
                {partnerConfig.name.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{partnerConfig.name}</h3>
              <p className="text-sm text-gray-400">{partnerConfig.title}</p>
            </div>
          </div>
          
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            {partnerConfig.description}
          </p>

          {/* Success Metrics */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400">${partnerConfig.totalEarnings.toLocaleString()}</div>
              <div className="text-xs text-gray-400">Ganancias Totales</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">{partnerConfig.successStories.toLocaleString()}</div>
              <div className="text-xs text-gray-400">Estudiantes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">9+</div>
              <div className="text-xs text-gray-400">Años Exp.</div>
            </div>
          </div>
        </div>

        {/* StoryTime Components */}
        <div className="space-y-6">
          {/* Countdown Timer */}
          {partnerConfig.liveEvent && (
            <CountdownTimer
              endTime={partnerConfig.liveEvent.startTime}
              title="¡Evento en Vivo!"
              subtitle="Únete al último evento del año"
            />
          )}

          {/* Giveaway Banner */}
          {partnerConfig.giveaway && (
            <GiveawayBanner
              title={partnerConfig.giveaway.title}
              description={partnerConfig.giveaway.description}
              prize={partnerConfig.giveaway.prize}
              endTime={partnerConfig.giveaway.endTime}
            />
          )}

          {/* Payout Showcase */}
          <PayoutShowcase
            amount={partnerConfig.payoutAmount}
            totalEarnings={partnerConfig.totalEarnings}
            successStories={partnerConfig.successStories}
          />

          {/* Event Counter */}
          <EventCounter
            title="Registros Hoy"
            count={247}
            target={500}
            color={partnerConfig.primaryColor}
          />
        </div>

        {/* CTA Section */}
        <div className="mt-8 text-center">
          <button
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
            style={{ backgroundColor: partnerConfig.primaryColor }}
          >
            {partnerConfig.ctaText}
          </button>
          <p className="text-sm text-gray-400 mt-2">CUPOS LIMITADOS</p>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>Regístrate ahora y obtén tu entrada</p>
        </div>
      </div>
    </div>
  );
};

export default PartnerLandingPage;
