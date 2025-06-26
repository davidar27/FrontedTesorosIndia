import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from 'react-error-boundary';
import ToastProvider from '@/components/ui/feedback/ToastProvider';

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
const NotFoundPage = lazy(() => import('@/pages/Errors/NotFoundPage'));
const AboutUs = lazy(() => import('@/pages/AboutUs/AboutUs'));
const AccessDenied = lazy(() => import('@/pages/Errors/AccessDenied'));
const CartPage = lazy(() => import('@/pages/Cart/CartPage'));
const PaymentSuccess = lazy(() => import('@/pages/payment/PaymentSuccess'));
const PaymentFailure = lazy(() => import('@/pages/payment/PaymentFailure'));
const PaymentPending = lazy(() => import('@/pages/payment/PaymentPending'));

// Admin Pages
const ExperiencesPage = lazy(() => import('@/pages/Admin/ExperiencesPage'));
const EntrepreneursPage = lazy(() => import('@/pages/Admin/EntrepreneursPage'));
const PackagesPage = lazy(() => import('@/pages/Admin/PackagesPage'));
const CategoriesPage = lazy(() => import('@/pages/Admin/CategoriesPage'));

// Context
import { PageProvider } from '@/context/PageContext';

// Routes
import ProtectedRoute from "./routes/protectedRoute";
import ErrorFallback from "./pages/Errors/ErrorFallback";
import LoadingSpinner from "./components/ui/display/LoadingSpinner";
import ResetPassword from "./pages/Auth/ResetPassword";
import ForgotPasswordForm from "./pages/Auth/ForgotPasswordForm";
import ExperiencePage from "./pages/Experience/ExperiencePage";
import Profile from "./features/profile/Profile";

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <PageProvider>
        <Suspense fallback={<LoadingSpinner position="overlay" size="lg" variant="primary" speed="slow" overlayBg="bg-white/90" message="Cargando aplicación..." />}>
          <ToastProvider />
          <Routes>
            {/* Rutas públicas con MainLayout */}

            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />

              {/* Rutas de productos */}
              <Route path="/productos">
                <Route index element={<ProductsPage />} />
                <Route path=":id" element={<ProductsPage />} />
                <Route path="categorias/:categoryId" element={<ProductsPage />} />
              </Route>

              {/* Rutas informativas */}
              <Route path="/nosotros" element={<AboutUs />} />

              {/* Rutas de carrito */}
              <Route path="/carrito" element={<CartPage />} />

              {/* Rutas de resultado de pago */}
              <Route path="/pago-exitoso" element={<PaymentSuccess />} />
              <Route path="/pago-fallido" element={<PaymentFailure />} />
              <Route path="/pago-pendiente" element={<PaymentPending />} />

              {/* Rutas de experiencias */}
              <Route path="/experiencias">
                <Route index element={<ExperiencePage />} />
                <Route path="categorias/:categoryId" element={<ExperiencePage />} />
                <Route path=":experience_id" element={<ExperiencePage />} />
              </Route>

              {/* Rutas de edición de experiencias - accesible públicamente, protección interna */}
              <Route path="/experiencia/:experience_id/editar" element={<ExperiencePage />} />

              {/* Rutas de perfil de usuario */}
              <Route element={<ProtectedRoute roles={['administrador', 'emprendedor', 'cliente']} />}>
                <Route path="/perfil/:id" element={<Profile />} />
              </Route>
            </Route>

            {/* Rutas de autenticación */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="iniciar-sesion" element={<LoginPage />} />
              <Route path="registro" element={<RegisterPage />} />
              <Route path="verificacion" element={<SendEmail />} />
              <Route path="verificacion/correo" element={<EmailVerificationPage />} />
              <Route path="password">
                <Route path="recuperar" element={<ForgotPasswordForm />} />
                <Route path="restablecer" element={<ResetPassword />} />
              </Route>
            </Route>

            {/* Rutas del dashboard administrativo */}
            <Route element={<ProtectedRoute roles={['administrador']} />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<EntrepreneursPage />} />
                <Route path="estadisticas" />
                <Route path="emprendedores" element={<EntrepreneursPage />} />
                <Route path="experiencias" element={<ExperiencesPage />} />
                <Route path="paquetes" element={<PackagesPage />} />
                <Route path="categorias" element={<CategoriesPage />} />
              </Route>
            </Route>

            {/* Páginas de error */}
            <Route path="/error">
              <Route path="acceso-denegado" element={<AccessDenied />} />
              <Route path="no-encontrado" element={<NotFoundPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/error/no-encontrado" replace />} />
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