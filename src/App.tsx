import { Routes, Route } from "react-router-dom";

// Layouts
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';

// Pages
import Home from '@/pages/Home/Home';
// import PackagesPage from '@/pages/Packages/PackagesPage';
import ProductsPage from '@/pages/Products/Products';
// import AboutPage from '@/pages/About/AboutPage';
import LoginPage from '@/pages/Auth/LoginPage';
import RegisterPage from '@/pages/Auth/RegisterPage';
import EmailVerification from '@/pages/Auth/VerifyEmail';
import { EmailVerificationPage } from "./pages/Auth/VerificationPage";
import FarmPage from '@/pages/Estates/EstatePage';
import AdminPage from "./pages/Admin/AdminPage";
import NotFoundPage from '@/pages/Errors/NotFoundPage';
import ProtectedRoute from "./routes/protectedRoute";

function App() {
  return (
    <>
      <Routes>
        {/* Rutas públicas principales */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<ProductsPage />} />

          {/* <Route path="/paquetes" element={<PackagesPage />} />
          <Route path="/nosotros" element={<AboutPage />} /> */}
        </Route>

        {/* Rutas de autenticación */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/correo-enviado" element={<EmailVerification />} />
          <Route path="/verificar-correo" element={<EmailVerificationPage />} />
        </Route>

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<FarmPage />} />
          {/* <Route path="/profile" element={<Profile />} /> */}
        </Route>

        {/* Rutas con roles específicos */}
        <Route element={<ProtectedRoute roles={['administrador']} />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
