# Chatbot con IA e Onboarding Automático

Un sistema completo de chatbot con inteligencia artificial real y onboarding automático contextual para la aplicación Tesoros India.

## 🚀 Características Principales

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

#### **Chatbot:**
- `Chatbot.tsx` - Componente principal del chat
- `ChatMessage.tsx` - Visualización de mensajes
- `ChatbotNotification.tsx` - Notificaciones de mensajes nuevos
- `ChatbotContext.tsx` - Estado global del chat

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

### **Chatbot Básico:**
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

### **Usuarios No Autenticados (Observadores):**
- Mensajes de bienvenida básicos
- Guías generales de navegación
- Acceso limitado a funcionalidades

### **Clientes:**
- Onboarding personalizado
- Recomendaciones específicas
- Acceso completo a experiencias y productos

### **Emprendedores:**
- Guías de gestión de productos
- Información de ventas
- Acceso a herramientas administrativas

### **Administradores:**
- Onboarding completo
- Acceso a todas las funcionalidades
- Guías de administración del sistema

## ⏰ Flujo de Onboarding

### **Timeline Automático:**
1. **0-5 segundos**: Usuario navega libremente
2. **5 segundos**: Mensaje de bienvenida de Tesorito
3. **8 segundos**: Guía específica de la página actual
4. **12 segundos**: Highlights de características principales

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