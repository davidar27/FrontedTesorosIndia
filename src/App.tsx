import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
const NotFoundPage = lazy(() => import('@/pages/Errors/NotFoundPage'));
const AboutUs = lazy(() => import('@/pages/AboutUs/AboutUs'));
import FarmsManagement from "./components/admin/farms/FarmSection";
import EntrepreneursManagement from "./components/admin/entrepreneurs/EntrepreneursManagement";
import { AdminDashboard } from "./pages/Admin/AdminDashboard";
import PackagesManagement from "./components/admin/packages/PackagesManagement";
import CategoriesManagement from "./components/admin/categories/CategoriesManagement";

// Routes
import ProtectedRoute from "./routes/protectedRoute";


const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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

          {/* <Route element={<ProtectedRoute roles={['administrador']} />}> */}
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/dashboard/emprendedores" element={<EntrepreneursManagement />} />
          <Route path="/dashboard/fincas" element={<FarmsManagement />} />
          <Route path="/dashboard/paquetes" element={<PackagesManagement />} />
          <Route path="/dashboard/categorias" element={<CategoriesManagement />} />


          {/* </Route> */}

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </QueryClientProvider>
  );
}


export default App;
