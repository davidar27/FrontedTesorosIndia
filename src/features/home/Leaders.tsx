import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Grupo from "@/assets/images/Grupo.webp";
import AnimatedTitle from "@/components/ui/display/AnimatedTitle";
import Picture from "@/components/ui/display/Picture";
import { EntrepreneursApi } from "@/services/home/entrepreneurs";

interface Leader {
  id: number;
  name: string;
  age: string;
  role: string;
  image: string;
}

const Leaders = () => {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentLeaders, setCurrentLeaders] = useState<Leader[]>([]);
  const [direction, setDirection] = useState(0);

  const itemsPerPage = 4;

  const getCurrentLeaders = useCallback((index: number): Leader[] => {
    const result: Leader[] = [];
    if (leaders.length === 0) return result;

    for (let i = 0; i < itemsPerPage; i++) {
      const leaderIndex = (index + i) % leaders.length;
      result.push(leaders[leaderIndex]);
    }
    return result;
  }, [itemsPerPage, leaders]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataEntrepreneurs: any = await EntrepreneursApi.getEntrepreneurs() || [];
        setLeaders(dataEntrepreneurs);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (leaders.length > 0) {
      setCurrentLeaders(getCurrentLeaders(currentIndex));
    }
  }, [leaders, currentIndex, getCurrentLeaders]);

  const nextSlide = useCallback(() => {
    if (leaders.length === 0) return;
    setDirection(1);
    const newIndex = (currentIndex + 1) % leaders.length;
    setCurrentIndex(newIndex);
  }, [currentIndex, leaders.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [nextSlide]);

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    initial: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    }),
  };

  return (
    <div className="responsive-padding-x flex flex-col items-center gap-2 md:gap-4 py-8">
      <AnimatedTitle
        title="LÍDERES"
        mdAlign="center"
        underlineWidth="lg"
      />

      <div className="relative w-full max-w-6xl">
        <div className="overflow-hidden">
          <motion.div
            variants={containerVariants}
            animate="animate"
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 py-8"
          >
            <AnimatePresence mode="popLayout" custom={direction}>
              {currentLeaders.map((leader) => (
                <motion.div
                  key={`${leader.id}-${currentIndex}`}
                  custom={direction}
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  layout
                  className="flex flex-col items-center"
                >
                  <Picture
                    src={leader.image || Grupo}
                    className="w-48 h-48 rounded-full mb-4 object-cover border-4 border-green-200"
                  />

                  <h2 className="text-lg font-bold text-green-700 mb-2 text-center leading-tight">
                    {leader.name}
                  </h2>

                  <p className="text-md text-green-600 mb-2 font-medium">
                    {leader.age || "Edad no definida"}
                  </p>

                  <span className="text-sm text-green-500 bg-green-100 px-3 py-1 rounded-full font-medium">
                    {leader.role || "Sin profesión"} 
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Leaders;