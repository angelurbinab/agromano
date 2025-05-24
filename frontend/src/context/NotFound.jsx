import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * @description Componente que redirige a la página principal con un mensaje de error cuando no se encuentra una ruta.
 * @returns {null} No renderiza ningún contenido.
 */
function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/?error=not-found");
  }, [navigate]);

  return null;
}

export default NotFound;