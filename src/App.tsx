import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from '@/context/AuthContext';

// Layouts
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';

// Pages
import Home from '@/pages/Home/Home';
// import PackagesPage from '@/pages/Packages/PackagesPage';
// import ProductsPage from '@/pages/Products/ProductsPage';
// import AboutPage from '@/pages/About/AboutPage';
import LoginPage from '@/pages/Auth/LoginPage';
import RegisterPage from '@/pages/Auth/RegisterPage';
import EmailVerification from '@/pages/Auth/VerifyEmail';
import { EmailVerificationPage } from "./pages/Auth/VerificationPage";
import FarmPage from '@/pages/Estates/EstatePage';
import AdminPage from "./pages/Admin/AdminPage";
import { JSX } from "react";
// import NotFoundPage from '@/pages/Errors/NotFoundPage';

// Componente para rutas protegidas
const PrivateRoute = ({
  children,
  roles = []
}: {
  children: JSX.Element;
  roles?: string[];
}) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <>
      <Routes>
        {/* Rutas públicas principales */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          {/* <Route path="/paquetes" element={<PackagesPage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/nosotros" element={<AboutPage />} /> */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Route>

        {/* Rutas de autenticación */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/correo-enviado" element={<EmailVerification />} />
          <Route path="/verificar-correo" element={<EmailVerificationPage />} />
        </Route>

        {/* Rutas protegidas */}
        <Route element={<MainLayout />}>
          <Route
            path="/myfinca"
            element={
              <PrivateRoute roles={['emprendedor']}>
                <FarmPage />
              </PrivateRoute>
            }
          />

          {/* Ejemplo de ruta solo para admin */}
          <Route
            path="/admin"
            element={
              <PrivateRoute roles={['administrador']}>
                <AdminPage />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;