import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Grupo from "@/assets/images/Grupo.webp";
import AnimatedTitle from "@/components/ui/display/AnimatedTitle";
import Picture from "@/components/ui/display/Picture";
import { EntrepreneursApi } from "@/services/home/entrepreneurs";
import { getImageUrl } from "@/utils/getImageUrl";

interface Leader {
  id: number;
  name: string;
  age: string;
  profession: string;
  image: string;
}

const SLIDE_INTERVAL = 4000;
const MIN_LEADERS_TO_SHOW = 1;
const MAX_LEADERS_TO_SHOW = 4;

const Leaders = () => {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const getCurrentLeaders = useCallback((index: number): Leader[] => {
    if (!leaders.length) return [];
    
    const leadersToShow = Math.min(Math.max(leaders.length, MIN_LEADERS_TO_SHOW), MAX_LEADERS_TO_SHOW);
    
    return Array.from({ length: leadersToShow }, (_, i) => {
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
    setTimeout(() => setIsAnimating(false), 800);
  }, [leaders.length, isAnimating]);

  useEffect(() => {
    const interval = setInterval(handleNextSlide, SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [handleNextSlide]);

  if (isLoading) {
    return (
      <div className="responsive-padding-x flex flex-col items-center gap-4 py-8 ">
        <div className="animate-pulse w-full max-w-6xl grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
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
        {/* Leaders Card */}
        <div className="relative">
          <motion.div
            className="flex gap-6 py-8 justify-center"
            initial={false}
            animate={{ opacity: isAnimating ? 0.5 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence mode="popLayout">
              {currentLeaders.map((leader, index) => (
                <motion.article
                  key={`${leader.id}-${index}`}
                  className={`
                    flex-shrink-0 
                    ${currentLeaders.length === 1 ? 'w-[calc(100%-1rem)]' : 
                      currentLeaders.length === 3 ? 'w-[calc(33.333%-1rem)]' : 
                      currentLeaders.length === 4 ? 'w-[calc(25%-1.125rem)]' : 
                      'w-[calc(20%-1rem)]'}
                    flex flex-col items-center
                  `}
                  initial={{ 
                    x: 100,
                    opacity: 0,
                    scale: 0.8
                  }}
                  animate={{ 
                    x: 0,
                    opacity: 1,
                    scale: 1
                  }}
                  exit={{ 
                    x: -100,
                    opacity: 0,
                    scale: 0.8
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                    delay: index * 0.1
                  }}
                  role="article"
                  aria-label={`Líder: ${leader.name}`}
                >
                  <motion.div 
                    className="relative group"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Picture
                      src={leader.image}
                      alt={`Foto de ${leader.name}`}
                      className="w-48 h-48 rounded-full mb-4 object-cover border-4 border-green-200"
                    />
                  </motion.div>

                  <motion.h2 
                    className="text-lg font-bold text-green-700 mb-2 text-center leading-tight"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    {leader.name}
                  </motion.h2>

                  <motion.p 
                    className="text-md text-green-600 mb-2 font-medium"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    {leader.age + " años" || "Edad no definida"}
                  </motion.p>

                  <motion.span
                    className="text-sm text-green-500 bg-green-100 px-3 py-1 rounded-full font-medium"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ 
                      backgroundColor: "#dcfce7",
                      scale: 1.05
                    }}
                    role="text"
                    aria-label={`Rol: ${leader.profession || "Sin profesión"}`}
                  >
                    {leader.profession || "Sin profesión"}
                  </motion.span>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Leaders;