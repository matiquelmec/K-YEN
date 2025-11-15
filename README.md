# 🌙 KÜYEN - Donde la elegancia florece bajo la luna

Plataforma de e-commerce moderna y elegante para vestidos exclusivos, construida con Next.js 15, TypeScript y las mejores prácticas de desarrollo.

## 🚀 Tecnologías

- **Frontend**: Next.js 15.5.6 + TypeScript + Tailwind CSS
- **Animaciones**: Framer Motion 12.x
- **Íconos**: Lucide React
- **Código Quality**: ESLint + Prettier + Husky
- **Performance**: Optimizaciones enterprise-level

## ⚡ Inicio rápido

### Requisitos
- Node.js >= 20.0.0
- npm >= 10.0.0

### Instalación

```bash
# Clonar e instalar
cd tienda-vestidos
npm install

# Configurar entorno de desarrollo
npm run setup

# Iniciar servidor de desarrollo
npm run dev
```

**🌐 URL local**: http://localhost:3000

## 📋 Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build optimizado para producción |
| `npm run start` | Servidor de producción |
| `npm run type-check` | Verificar tipos TypeScript |
| `npm run lint` | Verificar código con ESLint |
| `npm run lint:fix` | Arreglar automáticamente problemas de lint |
| `npm run format` | Formatear código con Prettier |
| `npm run setup` | Configuración automática del entorno |
| `npm run test:build` | Test completo (types + lint + build) |
| `npm run clean` | Limpiar cache y builds |

## 🏗️ Estructura del proyecto

```
src/
├── app/                    # App Router (Next.js 13+)
│   ├── layout.tsx         # Layout principal con ErrorBoundary
│   ├── page.tsx           # Página de inicio
│   ├── catalogo/          # Página de catálogo
│   └── globals.css        # Estilos globales
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes básicos de UI
│   ├── error/           # Manejo de errores
│   ├── ProductCard.tsx  # Tarjetas de productos (memoizado)
│   ├── FilterSidebar.tsx # Filtros del catálogo
│   └── ...              # Otros componentes
├── hooks/                # Custom hooks
│   └── useLoading.ts     # Hook de loading states
├── lib/                  # Utilidades y configuraciones
│   ├── utils.ts         # Utilidades generales
│   ├── constants.ts     # Constantes de la aplicación
│   ├── config.ts        # Configuración centralizada
│   └── performance.ts   # Optimizaciones de performance
└── types/                # Definiciones de tipos TypeScript
    └── index.ts         # Tipos principales
```

## 🎯 Características principales

### ✨ **UI/UX Enterprise**
- ✅ Diseño responsive y accesible
- ✅ Animaciones suaves con Framer Motion
- ✅ Error boundaries profesionales
- ✅ Loading states optimizados
- ✅ Tema oscuro nativo

### ⚡ **Performance**
- ✅ Componentes memoizados (React.memo)
- ✅ Code splitting automático
- ✅ Optimización de imágenes
- ✅ Bundle analysis integrado
- ✅ Web Vitals tracking

### 🔒 **Seguridad**
- ✅ Headers de seguridad configurados
- ✅ Validación TypeScript estricta
- ✅ Sanitización de inputs
- ✅ Variables de entorno protegidas

### 🛠️ **Developer Experience**
- ✅ TypeScript estricto (0 errores)
- ✅ ESLint + Prettier configurados
- ✅ Git hooks automáticos
- ✅ Hot reload optimizado
- ✅ Scripts de desarrollo útiles

## 🔧 Configuración

### Variables de entorno

Copiar `.env.example` a `.env.local` y configurar:

```env
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=KÜYEN
```

### Next.js config

Las optimizaciones incluyen:
- Compresión habilitada
- Headers de seguridad
- Optimización de paquetes
- Tracing de archivos configurado

## 📦 Build y deploy

### Build local
```bash
npm run test:build  # Test completo
npm run build      # Build optimizado
```

### Análisis del bundle
```bash
npm run analyze
```

## 🎨 Customización

### Colores y tema
Los colores están definidos en `tailwind.config.js`:
- **Terra**: Tonos tierra naturales
- **Mystic**: Tonos místicos y lunares
- **Lunar**: Tonos de luna creciente

### Componentes
Todos los componentes están en `src/components/` con:
- TypeScript estricto
- Props bien documentadas
- Memoización cuando es necesario

## 📈 Performance Metrics

**Últimos resultados del build:**

```
Route (app)                Size    First Load JS
┌ ○ /                   8.28 kB     148 kB
├ ○ /_not-found           994 B     103 kB  
└ ○ /catalogo           9.67 kB     149 kB
+ First Load JS shared  102 kB
```

## 🤝 Contribución

1. Fork del proyecto
2. Crear feature branch: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'Agregar nueva funcionalidad'`
4. Push al branch: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

## 📄 Licencia

Este proyecto es privado y propiedad de KÜYEN.

## 💫 Autor

Desarrollado con 🤍 por el equipo de KÜYEN

---

**KÜYEN** - Donde la elegancia florece bajo la luna ✨