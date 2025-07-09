# Chatbot Guiado por Opciones con IA

Un sistema completo de chatbot guiado por opciones que minimiza la escritura del usuario, con navegación intuitiva y visualización de productos, experiencias y paquetes en formato card.

## 🚀 Características Principales

### **Chatbot Guiado por Opciones:**
- ✅ **Navegación por clics** - Sin necesidad de escribir
- ✅ **Menú principal automático** al abrir el chat
- ✅ **Categorías de productos** obtenidas del backend
- ✅ **Visualización en cards** de productos, experiencias y paquetes
- ✅ **Breadcrumb de navegación** para orientación del usuario
- ✅ **Chat libre** como opción secundaria

### **Chatbot con IA Real:**
- ✅ **Integración con Google Gemini AI**
- ✅ **Respuestas contextuales** según el rol del usuario
- ✅ **Autenticación inteligente** con diferentes niveles de acceso
- ✅ **Chat en tiempo real** con historial de conversación
- ✅ **Interfaz moderna y responsive**

### **Onboarding Automático:**
- ✅ **Mensajes de bienvenida** automáticos a los 5 segundos
- ✅ **Guías contextuales** según la página actual
- ✅ **Highlights de características** específicas por página
- ✅ **Acciones interactivas** (navegación, explicaciones, etc.)
- ✅ **Auto-cierre** con indicador de progreso
- ✅ **Personalización por rol** de usuario

## 🏗️ Arquitectura SOLID

### **Principios Implementados:**

1. **S - Responsabilidad Única**: Cada servicio tiene una responsabilidad específica
2. **O - Abierto/Cerrado**: Fácil extensión sin modificar código existente
3. **L - Sustitución de Liskov**: Interfaces bien definidas
4. **I - Segregación de Interfaces**: Interfaces específicas para cada necesidad
5. **D - Inversión de Dependencias**: Dependemos de abstracciones, no implementaciones

### **Componentes del Sistema:**

#### **Chatbot Principal:**
- `Chatbot.tsx` - Componente principal del chat con navegación por opciones
- `ChatMessage.tsx` - Visualización de mensajes
- `ChatbotNotification.tsx` - Notificaciones de mensajes nuevos
- `ChatbotContext.tsx` - Estado global del chat

#### **Componentes de Opciones:**
- `ChatbotOptions.tsx` - Botones de opciones del menú
- `ChatbotProductCards.tsx` - Cards de productos con imágenes y precios
- `ChatbotItemCards.tsx` - Cards para experiencias y paquetes
- `ChatbotOptionsService.ts` - Servicio para manejar menús y datos

#### **Onboarding:**
- `OnboardingProvider.tsx` - Proveedor principal de onboarding
- `OnboardingMessage.tsx` - Componente de mensaje con animaciones
- `useOnboarding.ts` - Hook personalizado para lógica de onboarding

#### **Servicios:**
- `AIService.ts` - Comunicación con backend de IA
- `AuthService.ts` - Gestión de autenticación y roles
- `ChatService.ts` - Orquestación de lógica de chat
- `OnboardingService.ts` - Generación de mensajes de onboarding

#### **Interfaces:**
- `IAInterfaces.ts` - Contratos para servicios de IA
- `OnboardingInterfaces.ts` - Contratos para sistema de onboarding

## 🔧 Uso

### **Chatbot Guiado por Opciones:**
```tsx
import { Chatbot } from '@/features/chatbot';

function App() {
  return (
    <div>
      <Chatbot />
    </div>
  );
}
```

### **Flujo de Navegación:**
1. **Al abrir el chat** → Se muestra automáticamente el menú principal
2. **Seleccionar "Ver productos"** → Se cargan las categorías del backend
3. **Seleccionar categoría** → Se muestran los productos en formato card
4. **Seleccionar "Ver experiencias"** → Se muestran experiencias en cards
5. **Seleccionar "Ver paquetes"** → Se muestran paquetes en cards
6. **Chat libre** → Campo de escritura aparece solo cuando se selecciona esta opción

### **Onboarding Automático:**
```tsx
import { OnboardingProvider } from '@/features/chatbot';

function MainLayout() {
  return (
    <OnboardingProvider>
      {/* Tu contenido de la aplicación */}
    </OnboardingProvider>
  );
}
```

### **Hook Personalizado:**
```tsx
import { useOnboarding } from '@/features/chatbot';

function MyComponent() {
  const { showWelcomeMessage, showPageGuide } = useOnboarding();
  
  // Mostrar mensajes manualmente
  const handleShowHelp = () => {
    showWelcomeMessage();
  };
}
```

## 🎯 Funcionalidades por Rol

### **Todos los Usuarios:**
- **Navegación guiada** por opciones sin escribir
- **Visualización en cards** de productos, experiencias y paquetes
- **Breadcrumb de navegación** para orientación
- **Chat libre** como opción secundaria

### **Usuarios No Autenticados (Observadores):**
- Acceso completo a la navegación guiada
- Visualización de todos los productos y experiencias
- Chat libre con respuestas básicas

### **Clientes Autenticados:**
- Navegación guiada personalizada
- Recomendaciones específicas según historial
- Chat libre con respuestas contextuales

### **Emprendedores:**
- Navegación guiada + herramientas de gestión
- Información de ventas en el chat libre
- Acceso a herramientas administrativas

### **Administradores:**
- Navegación guiada completa
- Chat libre con acceso total al sistema
- Guías de administración del sistema

## 🎯 Flujo de Navegación del Chatbot

### **Flujo Principal:**
1. **Al abrir el chat** → Menú principal automático
2. **Seleccionar opción** → Navegación a submenús o visualización
3. **Ver productos** → Categorías → Productos en cards
4. **Ver experiencias** → Experiencias en cards
5. **Ver paquetes** → Paquetes en cards
6. **Chat libre** → Escritura libre con IA

### **Características de Navegación:**
- **Breadcrumb visual** para orientación
- **Botones de volver** en cada nivel
- **Carga automática** de datos del backend
- **Visualización en cards** con imágenes y precios
- **Navegación fluida** sin recargas de página
- **Campo de escritura oculto** hasta seleccionar "Chat libre"
- **Enfoque automático** del input al activar chat libre

### **Tipos de Mensajes:**
- **Welcome**: Mensaje de bienvenida personalizado
- **Page Guide**: Guía específica de la página actual
- **Feature Highlight**: Destacado de características importantes
- **Interactive Help**: Ayuda interactiva con acciones

## 🔌 Integración con Backend

### **Endpoints Utilizados:**
- `POST /IA/` - Para usuarios no registrados
- `POST /IA/registrado` - Para usuarios autenticados

### **Flujo de Datos:**
1. Usuario entra a una página
2. Sistema detecta contexto (página, rol, autenticación)
3. IA genera mensaje contextual
4. Se muestra mensaje con animaciones
5. Usuario puede interactuar o cerrar

## 📁 Estructura de Archivos

```
src/features/chatbot/
├── interfaces/
│   ├── IAInterfaces.ts           # Contratos para IA
│   └── OnboardingInterfaces.ts   # Contratos para onboarding
├── services/
│   ├── AIService.ts              # Comunicación con IA
│   ├── AuthService.ts            # Gestión de autenticación
│   ├── ChatService.ts            # Orquestación de chat
│   └── OnboardingService.ts      # Generación de mensajes
├── components/
│   ├── OnboardingProvider.tsx    # Proveedor principal
│   └── OnboardingMessage.tsx     # Componente de mensaje
├── hooks/
│   └── useOnboarding.ts          # Hook personalizado
├── Chatbot.tsx                   # Componente principal
├── ChatMessage.tsx               # Mensajes del chat
├── ChatbotNotification.tsx       # Notificaciones
├── ChatbotContext.tsx            # Contexto React
├── index.ts                      # Exportaciones
└── README.md                     # Documentación
```

## 🛠️ Personalización

### **Configurar Onboarding:**
```tsx
import { onboardingService } from '@/features/chatbot';

// Actualizar configuración
onboardingService.updateConfig({
  delay: 3, // Mostrar después de 3 segundos
  maxMessages: 5, // Máximo 5 mensajes
  autoShow: true
});

// Actualizar preferencias del usuario
onboardingService.updateUserPreferences({
  skipOnboarding: false,
  showPageGuides: true,
  showFeatureHighlights: true
});
```

### **Modificar Mensajes de IA:**
Edita el `OnboardingService.ts` para cambiar la lógica de generación de mensajes.

### **Agregar Nuevas Páginas:**
1. Actualiza `getPageFeatures()` en `OnboardingService.ts`
2. Agrega acciones específicas en `getPageGuideActions()`
3. Personaliza prompts de IA según la página

## 🔒 Seguridad

- **Validación de roles** en cada request
- **Filtros de contenido** inapropiado
- **Manejo seguro de errores**
- **No exposición de datos sensibles**
- **Control de acceso** por página y rol

## 📦 Dependencias

- React
- React Router DOM
- Lucide React (íconos)
- Tailwind CSS (estilos)
- Axios (comunicación HTTP)
- Context API (estado global)

## 🚀 Próximos Pasos

1. **Analytics de onboarding** para medir efectividad
2. **Sistema de feedback** para mejorar mensajes
3. **Multilenguaje** para usuarios internacionales
4. **Integración con base de datos** para respuestas más precisas
5. **A/B testing** de diferentes mensajes de onboarding 