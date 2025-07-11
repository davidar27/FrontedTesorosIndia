import { useScrollToTop } from '@/hooks/useScrollToTop';

/**
 * Componente que reinicia automáticamente el scroll al inicio de la página
 * cada vez que cambia la ruta. Este componente no renderiza nada visible.
 */
const ScrollToTop = () => {
  useScrollToTop();
  
  // Este componente no renderiza nada, solo ejecuta el hook
  return null;
};

export default ScrollToTop; 