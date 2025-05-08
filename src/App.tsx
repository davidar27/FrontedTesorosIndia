import { Routes, Route } from "react-router-dom";
// import Cookies from "js-cookie";

// const userRole = Cookies.get("user_role");


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
      </Routes>

      <Footer />
    </>
  );
}

export default App;
