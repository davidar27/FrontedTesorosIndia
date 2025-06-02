export const PUBLIC_ROUTES = [
    // Página principal
    '/',
    
    // Rutas de autenticación
    '/auth/iniciar-sesion',
    '/auth/registro',
    '/auth/verificacion',
    '/auth/verificacion/correo',
    '/auth/password/recuperar',
    '/auth/password/restablecer',
    
    // Rutas informativas
    '/nosotros',
    '/contacto',
    
    // Rutas de productos
    '/productos',
    '/productos/:id',
    '/productos/categorias/:categoryId',
    
    // Rutas de fincas
    '/fincas',
    '/fincas/:id',
    '/fincas/categorias/:categoryId'
];