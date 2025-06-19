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
    
    // Rutas de productos
    '/productos',
    '/productos/:id',
    '/productos/categorias/:categoryId',
    
    // Rutas de experiencias
    '/experiencia',
    '/experiencia/:experience_id',
    '/experiencia/categorias/:categoryId'
];