import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * @description Componente que desplaza la página al inicio cada vez que cambia la ruta.
 * @returns {null} No renderiza ningún contenido.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Desplaza la ventana al inicio
  }, [pathname]);

  return null;
};

export default ScrollToTop;