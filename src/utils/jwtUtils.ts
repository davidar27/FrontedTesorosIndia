// Función para decodificar JWT token (solo para obtener datos, no para verificar firma)
export const decodeJWT = (token: string): unknown => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Formato de token inválido');
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Manejar padding
    const pad = base64.length % 4;
    const paddedBase64 = pad ? base64 + new Array(5 - pad).join('=') : base64;
    
    const jsonPayload = decodeURIComponent(
      atob(paddedBase64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch {
    throw new Error('Token inválido');
  }
};

// Función para verificar si un token JWT ha expirado
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeJWT(token) as { exp?: number };
    if (!decoded.exp) return true;
    
    // Convertir timestamp de segundos a milisegundos y comparar
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true; // Si no se puede decodificar, consideramos que ha expirado
  }
};

// Función para extraer información del usuario del token
export const extractUserInfoFromToken = (token: string): { userId?: number; email?: string; name?: string } => {
  try {
    const decoded = decodeJWT(token) as { 
      data?: { userId?: number; email?: string; name?: string };
      userId?: number;
      email?: string;
      name?: string;
    };
    
    // Intentar obtener datos de diferentes estructuras posibles
    return {
      userId: decoded.data?.userId || decoded.userId,
      email: decoded.data?.email || decoded.email,
      name: decoded.data?.name || decoded.name
    };
  } catch {
    return {};
  }
}; 