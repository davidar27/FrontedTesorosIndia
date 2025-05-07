import { Routes, Route } from "react-router-dom";

import Home from '@/pages/Home/Home';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import LoginPage from '@/pages/Auth/LoginPage';

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/paquetes" element={<Home />} />
        <Route path="/productos" element={<Home />} />
        <Route path="/nosotros" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Puedes agregar más rutas aquí */}
      </Routes>

      <Footer />
    </>
  );
}

export default App;
