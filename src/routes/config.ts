import { lazy } from 'react';

// Layouts
export const MainLayout = lazy(() => import('@/layouts/MainLayout'));
export const AuthLayout = lazy(() => import('@/layouts/AuthLayout'));
export const DashboardLayout = lazy(() => import('@/components/admin/DashboardLayout'));

// Public Pages
export const Home = lazy(() => import('@/pages/Home/Home'));
export const ProductsPage = lazy(() => import('@/pages/Products/Products'));
export const AboutUs = lazy(() => import('@/pages/AboutUs/AboutUs'));

// Auth Pages
export const LoginPage = lazy(() => import('@/pages/Auth/LoginPage'));
export const RegisterPage = lazy(() => import('@/pages/Auth/RegisterPage'));
export const SendEmail = lazy(() => import('@/pages/Auth/SendEmail'));
export const EmailVerificationPage = lazy(() => import('@/pages/Auth/VerificationPage'));

// Protected Pages
export const FarmPage = lazy(() => import('@/pages/Farm/FarmPage'));

// Admin Pages
export const FarmsPage = lazy(() => import('@/pages/Admin/FarmsPage'));
export const EntrepreneursPage = lazy(() => import('@/pages/Admin/EntrepreneursPage'));
export const PackagesPage = lazy(() => import('@/pages/Admin/PackagesPage'));
export const CategoriesPage = lazy(() => import('@/pages/Admin/CategoriesPage'));

// Error Pages
export const NotFoundPage = lazy(() => import('@/pages/Auth/Errors/NotFoundPage'));

// Route Configuration
export interface RouteConfig {
    path: string;
    element: React.ComponentType;
    layout?: React.ComponentType;
    protected?: boolean;
    roles?: string[];
    title?: string;
    description?: string;
}

export const publicRoutes: RouteConfig[] = [
    {
        path: '/',
        element: Home,
        layout: MainLayout,
        title: 'Inicio',
        description: 'Página principal'
    },
    {
        path: '/productos',
        element: ProductsPage,
        layout: MainLayout,
        title: 'Productos',
        description: 'Catálogo de productos'
    },
    {
        path: '/nosotros',
        element: AboutUs,
        layout: MainLayout,
        title: 'Nosotros',
        description: 'Información sobre la empresa'
    }
];

export const authRoutes: RouteConfig[] = [
    {
        path: '/login',
        element: LoginPage,
        layout: AuthLayout,
        title: 'Iniciar Sesión'
    },
    {
        path: '/registro',
        element: RegisterPage,
        layout: AuthLayout,
        title: 'Registrarse'
    },
    {
        path: '/correo-enviado',
        element: SendEmail,
        layout: AuthLayout,
        title: 'Correo Enviado'
    },
    {
        path: '/verificar-correo',
        element: EmailVerificationPage,
        layout: AuthLayout,
        title: 'Verificar Correo'
    }
];

export const protectedRoutes: RouteConfig[] = [
    {
        path: '/finca',
        element: FarmPage,
        protected: true,
        title: 'Mi Finca'
    }
];

export const adminRoutes: RouteConfig[] = [
    {
        path: '/dashboard/emprendedores',
        element: EntrepreneursPage,
        layout: DashboardLayout,
        protected: true,
        roles: ['administrador'],
        title: 'Gestión de Emprendedores'
    },
    {
        path: '/dashboard/fincas',
        element: FarmsPage,
        layout: DashboardLayout,
        protected: true,
        roles: ['administrador'],
        title: 'Gestión de Fincas'
    },
    {
        path: '/dashboard/paquetes',
        element: PackagesPage,
        layout: DashboardLayout,
        protected: true,
        roles: ['administrador'],
        title: 'Gestión de Paquetes'
    },
    {
        path: '/dashboard/categorias',
        element: CategoriesPage,
        layout: DashboardLayout,
        protected: true,
        roles: ['administrador'],
        title: 'Gestión de Categorías'
    }
];

// Navigation configuration for menus
export const navigationConfig = {
    public: [
        { path: '/', label: 'Inicio' },
        { path: '/productos', label: 'Productos' },
        { path: '/nosotros', label: 'Nosotros' }
    ],
    admin: [
        { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
        { path: '/dashboard/emprendedores', label: 'Emprendedores', icon: 'users' },
        { path: '/dashboard/fincas', label: 'Fincas', icon: 'farm' },
        { path: '/dashboard/paquetes', label: 'Paquetes', icon: 'package' },
        { path: '/dashboard/categorias', label: 'Categorías', icon: 'category' }
    ]
};