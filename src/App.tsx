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
const NotFoundPage = lazy(() => import('@/pages/Auth/Errors/NotFoundPage'));
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

// Error fallback component
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="mb-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Algo salió mal
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Ha ocurrido un error inesperado. Por favor, intenta recargar la página.
        </p>
        <div className="space-y-2">
          <button
            onClick={resetErrorBoundary}
            className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Intentar nuevamente
          </button>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            Recargar página
          </button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm text-gray-600">
              Detalles del error (desarrollo)
            </summary>
            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

// Enhanced loading component
function LoadingSpinner({ message = "Cargando..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="relative">
        <div className="animate-spin h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full"></div>
        <div className="absolute inset-0 animate-pulse">
          <div className="h-12 w-12 border-4 border-transparent border-t-primary/40 rounded-full"></div>
        </div>
      </div>
      <p className="mt-4 text-gray-600 animate-pulse">{message}</p>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        // Log error to monitoring service in production
        if (process.env.NODE_ENV === 'production') {
          console.error('Application Error:', error, errorInfo);
          // Example: Sentry.captureException(error, { extra: errorInfo });
        }
      }}
    >
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
            </Route>

            {/* Rutas protegidas para usuarios autenticados */}
            <Route element={<ProtectedRoute />}>
              <Route path="/finca" element={<FarmPage />} />
            </Route>

            {/* Rutas del dashboard administrativo */}
            {/* <Route element={<ProtectedRoute roles={['administrador']} />}> */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<EntrepreneursPage />} />
              <Route path="emprendedores" element={<EntrepreneursPage />} />
              <Route path="fincas" element={<FarmsPage />} />
              <Route path="paquetes" element={<PackagesPage />} />
              <Route path="categorias" element={<CategoriesPage />} />
            </Route>

            {/* </Route> */}

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