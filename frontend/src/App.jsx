import { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Explotaciones from "./components/Explotacion/Explotaciones";
import CrearExplotacion from "./components/Explotacion/CrearExplotacion";
import ActualizarExplotacion from "./components/Explotacion/ActualizarExplotacion";
import EliminarExplotacion from "./components/Explotacion/EliminarExplotacion";
import ExplotacionPorId from "./components/Explotacion/ExplotacionPorId";
import Animales from "./components/Animal/Animales";
import Titulares from "./components/Titular/Titulares";
import CrearTitular from "./components/Titular/CrearTitular";
import ActualizarTitular from "./components/Titular/ActualizarTitular";
import EliminarTitular from "./components/Titular/EliminarTitular";
import TitularDetalles from "./components/Titular/TitularDetalles";
import TitularDatos from "./components/Titular/TitularDatos";
import Movimientos from "./components/Movimiento/Movimientos";
import Incidencias from "./components/Incidencia/Incidencias";
import Alimentaciones from "./components/Alimentacion/Alimentaciones";
import Medicamentos from "./components/Medicamento/Medicamentos";
import Vacunaciones from "./components/Vacunacion/Vacunaciones";
import VacunacionesAnimales from "./components/Vacunacion/VacunacionesAnimales";
import Inspecciones from "./components/Inspeccion/Inspecciones";
import Parcelas from "./components/Parcela/Parcelas";
import Login from './components/Usuario/Login';
import Register from './components/Usuario/Register';
import Logout from './components/Usuario/Logout';
import Inicio from './components/Inicio/Inicio';
import Perfil from './components/Usuario/Perfil';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './context/ProtectedRoute';
import NotFound from './context/NotFound';
import ScrollToTop from './context/ScrollToTop';
import Chatbot from "./context/Chatbot";

function App() {

  return (
    <AuthProvider>
    <Router>
      <ScrollToTop />
      <Navbar />
      <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/profile/:id" element={<Perfil />} />

          <Route path="/titulares" element={<ProtectedRoute><Titulares /></ProtectedRoute>} />
          <Route path="/titulares/crear" element={<ProtectedRoute><CrearTitular /></ProtectedRoute>} />
          <Route path="/titulares/actualizar/:id" element={<ProtectedRoute><ActualizarTitular /></ProtectedRoute>} />
          <Route path="/titulares/eliminar" element={<ProtectedRoute><EliminarTitular /></ProtectedRoute>} />
          <Route path="/titulares/:id" element={<ProtectedRoute><TitularDetalles /></ProtectedRoute>} />
          <Route path="/datostitular" element={<ProtectedRoute><TitularDatos /></ProtectedRoute>} />

          <Route path="/titulares/:id/explotaciones" element={<ProtectedRoute><Explotaciones /></ProtectedRoute>} />
          <Route path="/titulares/:id/explotaciones/crear" element={<ProtectedRoute><CrearExplotacion /></ProtectedRoute>} />
          <Route path="/titulares/:id/explotaciones/actualizar/:idExplotacion" element={<ProtectedRoute><ActualizarExplotacion /></ProtectedRoute>} />
          <Route path="/titulares/:id/explotaciones/eliminar" element={<ProtectedRoute><EliminarExplotacion /></ProtectedRoute>} />
          <Route path="/titulares/:id/explotaciones/:idExplotacion" element={<ProtectedRoute><ExplotacionPorId /></ProtectedRoute>} />

          <Route path="/titulares/:id/explotaciones/:idExplotacion/alimentaciones" element={<ProtectedRoute><Alimentaciones /></ProtectedRoute>} />
          <Route path="/titulares/:id/explotaciones/:idExplotacion/inspecciones" element={<ProtectedRoute><Inspecciones /></ProtectedRoute>} />
          <Route path="/titulares/:id/explotaciones/:idExplotacion/medicamentos" element={<ProtectedRoute><Medicamentos /></ProtectedRoute>} />
          <Route path="/titulares/:id/explotaciones/:idExplotacion/parcelas" element={<ProtectedRoute><Parcelas /></ProtectedRoute>} />
          <Route path="/titulares/:id/explotaciones/:idExplotacion/animales" element={<ProtectedRoute><Animales /></ProtectedRoute>} />
          <Route path="/titulares/:id/explotaciones/:idExplotacion/vacunaciones" element={<ProtectedRoute><Vacunaciones /></ProtectedRoute>} />
          
          <Route path="/titulares/:id/explotaciones/:idExplotacion/animales/:idAnimal/movimientos" element={<ProtectedRoute><Movimientos /></ProtectedRoute>} />
          <Route path="/titulares/:id/explotaciones/:idExplotacion/animales/:idAnimal/incidencias" element={<ProtectedRoute><Incidencias /></ProtectedRoute>} />
          <Route path="/titulares/:id/explotaciones/:idExplotacion/vacunaciones/:idVacunacion/animales" element={<ProtectedRoute><VacunacionesAnimales /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
      </Routes>
      <Chatbot />
      <Footer />
    </Router>
    </AuthProvider>
  );
}

export default App;
