import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from 'react-error-boundary';

// Layouts
const MainLayout = lazy(() => import('@/layouts/MainLayout'));
const AuthLayout = lazy(() => import('@/layouts/AuthLayout'));
const DashboardLayout = lazy(() => import('@/components/admin/DashboardLayout'));

// Pages
const Home = lazy(() => import('@/pages/Home/Home'));
const ProductsPage = lazy(() => import('@/pages/Products/Products'));
const LoginPage = lazy(() => import('@/pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/Auth/RegisterPage'));
const SendEmail = lazy(() => import('@/pages/Auth/SendEmail'));
const EmailVerificationPage = lazy(() => import('@/pages/Auth/VerificationPage'));
const FarmPage = lazy(() => import('@/pages/Farm/FarmPage'));
const NotFoundPage = lazy(() => import('@/pages/Errors/NotFoundPage'));
const AboutUs = lazy(() => import('@/pages/AboutUs/AboutUs'));

// Admin Pages
const FarmsPage = lazy(() => import('@/pages/Admin/FarmsPage'));
const EntrepreneursPage = lazy(() => import('@/pages/Admin/EntrepreneursPage'));
const PackagesPage = lazy(() => import('@/pages/Admin/PackagesPage'));
const CategoriesPage = lazy(() => import('@/pages/Admin/CategoriesPage'));

// Context
import { PageProvider } from '@/context/PageContext';

// Routes
import ProtectedRoute from "./routes/protectedRoute";
import ErrorFallback from "./pages/Errors/ErrorFallback";
import LoadingSpinner from "./components/layouts/LoadingSpinner";
import ResetPassword from "./pages/Auth/ResetPassword";
import ForgotPasswordForm from "./pages/Auth/ForgotPasswordForm";




function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
        <PageProvider>
          <Suspense fallback={<LoadingSpinner message="Cargando aplicación..." />}>
            <Routes>
              {/* Rutas públicas con MainLayout */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/productos" element={<ProductsPage />} />
                <Route path="/nosotros" element={<AboutUs />} />
              </Route>

              {/* Rutas de autenticación */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/registro" element={<RegisterPage />} />
                <Route path="/correo-enviado" element={<SendEmail />} />
                <Route path="/verificar-correo" element={<EmailVerificationPage />} />
                <Route path="/recuperar-contraseña" element={<ForgotPasswordForm />} />
                <Route path="/restablecer-contraseña" element={<ResetPassword />} />
              </Route>

              {/* Rutas protegidas para usuarios autenticados */}
              <Route element={<ProtectedRoute />}>
                <Route path="/finca" element={<FarmPage />} />
              </Route>

              {/* Rutas del dashboard administrativo (protegidas) */}
              <Route element={<ProtectedRoute roles={['administrador']} />}>
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<EntrepreneursPage />} />
                  <Route path="emprendedores" element={<EntrepreneursPage />} />
                  <Route path="fincas" element={<FarmsPage />} />
                  <Route path="paquetes" element={<PackagesPage />} />
                  <Route path="categorias" element={<CategoriesPage />} />
                </Route>
              </Route>

              {/* Página 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </PageProvider>

      {/* React Query Devtools - solo en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </ErrorBoundary>
  );
}

export default App;