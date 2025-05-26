import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

/// Layouts
const MainLayout = lazy(() => import('@/layouts/MainLayout'));
const AuthLayout = lazy(() => import('@/layouts/AuthLayout'));

// Pages
const Home = lazy(() => import('@/pages/Home/Home'));
const ProductsPage = lazy(() => import('@/pages/Products/Products'));
const LoginPage = lazy(() => import('@/pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/Auth/RegisterPage'));
const SendEmail = lazy(() => import('@/pages/Auth/SendEmail'));
const EmailVerificationPage = lazy(() => import('@/pages/Auth/VerificationPage'));
const FarmPage = lazy(() => import('@/pages/Estates/EstatePage'));
const AdminPage = lazy(() => import('@/pages/Admin/AdminPage'));
const NotFoundPage = lazy(() => import('@/pages/Errors/NotFoundPage'));
const AboutUs = lazy(() => import('@/pages/AboutUs/AboutUs'));

// Routes
import ProtectedRoute from "./routes/protectedRoute";

function App() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
      <span className="animate-spin h-6 w-6 border-4 border-t-transparent rounded-full border-white" />
    </div>}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/nosotros" element={<AboutUs />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/correo-enviado" element={<SendEmail />} />
          <Route path="/verificar-correo" element={<EmailVerificationPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/estate" element={<FarmPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={['administrador']} />}>
          <Route path="/dashboard" element={<AdminPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}


export default App;
