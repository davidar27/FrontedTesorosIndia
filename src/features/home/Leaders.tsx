import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Grupo from "@/assets/images/Grupo.webp"
import AnimatedTitle from "@/components/ui/display/AnimatedTitle";
import Picture from "@/components/ui/display/Picture";


interface Leader {
  id: number;
  name: string;
  age: string;
  role: string;
}

const Leaders = () => {

  const leaders: Leader[] = useMemo(() => [
    { id: 1, name: "José Ovidio Cárdenas León", age: "64 años", role: "Agricultor" },
    { id: 2, name: "Luis Abel Cárdenas León", age: "66 años", role: "Cuidador" },
    { id: 3, name: "Segundo Israel Rivera", age: "64 años", role: "Agricultor" },
    { id: 4, name: "Bertha Acosta Chazaier", age: "60 años", role: "Agricultora" },
    { id: 5, name: "Marta Isabel Rodriguez", age: "30 años", role: "Cafetera" },
    { id: 6, name: "Carlos Andrés Mejía", age: "45 años", role: "Ganadero" },
    { id: 7, name: "Rosa Elvira Ramírez", age: "53 años", role: "Comerciante" },
    { id: 8, name: "Juan Pablo Castaño", age: "39 años", role: "Apicultor" },
    { id: 9, name: "Lucía Fernanda Ortiz", age: "28 años", role: "Artesana" },
    { id: 10, name: "Pedro Alfonso Herrera", age: "50 años", role: "Panadero" }
  ], []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;

  const getCurrentLeaders = useCallback((index: number): Leader[] => {
    const result: Leader[] = [];
    for (let i = 0; i < itemsPerPage; i++) {
      const leaderIndex = (index + i) % leaders.length;
      result.push(leaders[leaderIndex]);
    }
    return result;
  }, [itemsPerPage, leaders]);

  const [currentLeaders, setCurrentLeaders] = useState<Leader[]>(getCurrentLeaders(0));

  const [direction, setDirection] = useState(0);


  const nextSlide = useCallback(() => {
    setDirection(1);
    const newIndex = (currentIndex + 1) % leaders.length;
    setCurrentIndex(newIndex);
    setCurrentLeaders(getCurrentLeaders(newIndex));
  }, [currentIndex, leaders.length, getCurrentLeaders]);

  useEffect(() => {

    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex, nextSlide]);



  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    initial: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    })
  };

  return (
    <div className="responsive-padding-x flex flex-col items-center gap-2 md:gap-4 py-8">
      <AnimatedTitle
        title="LÍDERES"
        mdAlign="center"
        underlineWidth="lg"
      />

      <div
        className="relative w-full max-w-6xl"
      >
        <div className="overflow-hidden">
          <motion.div
            variants={containerVariants}
            animate="animate"
            className="grid grid-cols-2  md:grid-cols-2 lg:grid-cols-4 gap-6 py-8"
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
                    src={Grupo}
                    className="w-48 h-48 rounded-full mb-4 object-cover border-4 border-green-200"
                  />

                  <h2 className="text-lg font-bold text-green-700 mb-2 text-center leading-tight">
                    {leader.name}
                  </h2>

                  <p className="text-md text-green-600 mb-2 font-medium">
                    {leader.age}
                  </p>

                  <span className="text-sm text-green-500 bg-green-100 px-3 py-1 rounded-full font-medium">
                    {leader.role}
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