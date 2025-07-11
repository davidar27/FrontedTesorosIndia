import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface ScrollToTopOptions {
  behavior?: ScrollBehavior;
  smooth?: boolean;
  instant?: boolean;
}

/**
 * Hook que reinicia automáticamente el scroll al inicio de la página
 * cada vez que cambia la ruta en la aplicación
 * 
 * @param options - Opciones de configuración del scroll
 * @param options.behavior - Comportamiento del scroll ('auto' | 'smooth')
 * @param options.smooth - Si usar scroll suave (deprecated, usar behavior: 'smooth')
 * @param options.instant - Si usar scroll instantáneo (deprecated, usar behavior: 'auto')
 * 
 * @example
 * // Uso básico (scroll suave por defecto)
 * useScrollToTop();
 * 
 * @example
 * // Scroll instantáneo
 * useScrollToTop({ behavior: 'auto' });
 * 
 * @example
 * // Scroll suave explícito
 * useScrollToTop({ behavior: 'smooth' });
 * 
 * @example
 * // Opciones legacy (deprecated)
 * useScrollToTop({ instant: true }); // Scroll instantáneo
 * useScrollToTop({ smooth: false }); // Scroll instantáneo
 */
export const useScrollToTop = (options: ScrollToTopOptions = {}) => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Determinar el comportamiento del scroll
    let behavior: ScrollBehavior = 'smooth'; // Por defecto suave
    
    if (options.behavior) {
      behavior = options.behavior;
    } else if (options.instant) {
      behavior = 'auto';
    } else if (options.smooth === false) {
      behavior = 'auto';
    }

    // Reiniciar scroll al inicio de la página
    window.scrollTo({
      top: 0,
      left: 0,
      behavior
    });
  }, [pathname, options.behavior, options.smooth, options.instant]); // Se ejecuta cada vez que cambia la ruta o las opciones
};

export default useScrollToTop; 