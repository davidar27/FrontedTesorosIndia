import { Routes, Route } from "react-router-dom";
// import Cookies from "js-cookie";

// const userRole = Cookies.get("user_role");


import Home from '@/pages/Home/Home';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import LoginPage from '@/pages/Auth/LoginPage'
import RegisterPage from '@/pages/Auth/RegisterPage';
import Form from '@/components/layouts/AuthForm';

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
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/form" element={<Form />} />

      </Routes>

      <Footer />
    </>
  );
}

export default App;
