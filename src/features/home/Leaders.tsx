import { useState, useEffect, useCallback, useMemo } from "react";
import Grupo from "@/assets/images/Grupo.webp";
import AnimatedTitle from "@/components/ui/display/AnimatedTitle";
import Picture from "@/components/ui/display/Picture";
import { EntrepreneursApi } from "@/services/home/entrepreneurs";
import { getImageUrl } from "../admin/adminHelpers";

interface Leader {
  id: number;
  name: string;
  age: string;
  role: string;
  image: string;
}

const SLIDE_INTERVAL = 4000;

const Leaders = () => {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const getCurrentLeaders = useCallback((index: number): Leader[] => {
    if (!leaders.length) return [];

    // Obtener 5 elementos para asegurar una transición suave
    return Array.from({ length: 5 }, (_, i) => {
      const leaderIndex = (index + i) % leaders.length;
      return leaders[leaderIndex];
    });
  }, [leaders]);

  const currentLeaders = useMemo(() =>
    getCurrentLeaders(currentIndex),
    [getCurrentLeaders, currentIndex]
  );

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const dataEntrepreneurs = await EntrepreneursApi.getEntrepreneurs() || [];
        const formattedLeaders = dataEntrepreneurs.map((leader: Leader) => ({
          ...leader,
          image: getImageUrl(leader.image) || Grupo
        }));
        setLeaders(formattedLeaders);
      } catch (error) {
        setError("Error al cargar los líderes");
        console.error("Error fetching leaders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaders();
  }, []);

  const handleNextSlide = useCallback(() => {
    if (!leaders.length || isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % leaders.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [leaders.length, isAnimating]);

  useEffect(() => {
    const interval = setInterval(handleNextSlide, SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [handleNextSlide]);

  if (isLoading) {
    return (
      <div className="responsive-padding-x flex flex-col items-center gap-4 py-8 ">
        <div className="animate-pulse w-full max-w-6xl grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: leaders.length }).map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-48 h-48 rounded-full bg-gray-200 mb-4" />
              <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-28 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="responsive-padding-x flex flex-col items-center gap-4 py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <section
      className="responsive-padding-x flex flex-col items-center gap-2 md:gap-4 py-8"
      aria-label="Líderes de la organización"
    >
      <AnimatedTitle
        title="LÍDERES"
        mdAlign="center"
        underlineWidth="lg"
      />

      <div className="relative w-full max-w-6xl overflow-hidden">
        <div className="relative">
          <div
            className={`
              flex gap-6 py-8
              transition-transform duration-600 ease-in-out
              ${isAnimating ? '-translate-x-[calc(25%+1.5rem)]' : 'translate-x-0'}
            `}
          >
            {currentLeaders.map((leader, index) => (
              <article
                key={`${leader.id}-${index}`}
                className="flex-shrink-0 w-[calc(25%-1.125rem)] flex flex-col items-center"
                role="article"
                aria-label={`Líder: ${leader.name}`}
              >
                <div className="relative group">
                  <Picture
                    src={leader.image}
                    alt={`Foto de ${leader.name}`}
                    className="w-48 h-48 rounded-full mb-4 object-cover border-4 border-green-200"
                  />
                </div>

                <h2 className="text-lg font-bold text-green-700 mb-2 text-center leading-tight">
                  {leader.name}
                </h2>

                <p className="text-md text-green-600 mb-2 font-medium">
                  {leader.age || "Edad no definida"}
                </p>

                <span
                  className="text-sm text-green-500 bg-green-100 px-3 py-1 rounded-full font-medium"
                  role="text"
                  aria-label={`Rol: ${leader.role || "Sin profesión"}`}
                >
                  {leader.role || "Sin profesión"}
                </span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Leaders;