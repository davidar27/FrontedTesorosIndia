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
    
    // Rutas de experiencias (vista pública)
    '/experiencias',
    '/experiencias/:experience_id',
    '/experiencias/categorias/:categoryId',
    
    // Rutas de experiencias (edición protegida)
    '/experiencia/:experience_id/editar',

    // Rutas de carrito y pago
    '/carrito',
    '/metodo-pago',

    //
    '/perfil/:id',


    // Rutas de paquetes
    '/paquetes/:id',
    '/paquetes/:id/comprar'
];