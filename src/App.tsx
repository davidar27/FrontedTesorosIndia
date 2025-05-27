import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/// Layouts
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
const NotFoundPage = lazy(() => import('@/pages/Auth/Errors/NotFoundPage'));
const AboutUs = lazy(() => import('@/pages/AboutUs/AboutUs'));

// Admin Pages - Corregir estas rutas para que apunten a las páginas correctas
const FarmsPage = lazy(() => import('@/pages/Admin/FarmsPage'));
const EntrepreneursPage = lazy(() => import('@/pages/Admin/EntrepreneursPage'));
const PackagesPage = lazy(() => import('@/pages/Admin/PackagesPage'));
const CategoriesPage = lazy(() => import('@/pages/Admin/CategoriesPage'));

// Context
import { PageProvider } from '@/context/PageContext';

// Routes
import ProtectedRoute from "./routes/protectedRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PageProvider>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <span className="animate-spin h-6 w-6 border-4 border-t-transparent rounded-full border-primary" />
          </div>
        }>
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
            </Route>

            {/* Rutas protegidas para usuarios autenticados */}
            <Route element={<ProtectedRoute />}>
              <Route path="/finca" element={<FarmPage />} />
            </Route>

            {/* Rutas del dashboard administrativo */}
            {/* Descomenta y ajusta según tus roles */}
            {/* <Route element={<ProtectedRoute roles={['administrador']} />}> */}
            {/* <Route element={<ProtectedRoute />}> */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route path="emprendedores" element={<EntrepreneursPage />} />
              <Route path="fincas" element={<FarmsPage />} />
              <Route path="paquetes" element={<PackagesPage />} />
              <Route path="categorias" element={<CategoriesPage />} />
              {/* Ruta por defecto del admin */}
              <Route index element={<EntrepreneursPage />} />
            </Route>
            {/* </Route> */}
            {/* </Route> */}

            {/* Página 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </PageProvider>
    </QueryClientProvider>
  );
}

export default App;