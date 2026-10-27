# 💪 Retos App

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)

</div>

> Aplicación de **retos y entrenamiento** construida con Next.js 14, Firebase y Tailwind CSS.

---

## 📋 Descripción

Aplicación web para seguir retos y rutinas de entrenamiento. Usa **Next.js** para el renderizado y enrutamiento, **Firebase** como backend-as-a-service (autenticación y datos en tiempo real) y **Tailwind CSS** para la interfaz.

## ✨ Características

- 🚀 Renderizado rápido con **Next.js 14**
- 🔐 Autenticación con **Firebase**
- 🔄 Datos en tiempo real
- 🎨 UI con **Tailwind CSS**
- 🧠 Tipado con **TypeScript**
- 📱 Diseño responsivo

## 🛠️ Stack

`Next.js` · `React` · `TypeScript` · `Firebase` · `Tailwind CSS`

## 🚀 Instalación

### Requisitos

- **Node.js** 18+
- Un proyecto de **Firebase**

### Pasos

```bash
git clone https://github.com/Ricy24/entrenr-ia.git
cd entrenr-ia
npm install
```

1. Configura tus credenciales de Firebase en un archivo `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
```

2. Arranca el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Build de producción

```bash
npm run build
npm run start
```

## 📁 Estructura

```text
entrenr-ia/
├── src/                # Páginas y componentes
├── public/             # Recursos estáticos
├── next.config.ts      # Configuración de Next.js
├── tailwind.config.js  # Configuración de Tailwind
├── tsconfig.json       # Configuración de TypeScript
└── package.json
```

## 📄 Licencia

Proyecto desarrollado con **fines académicos**.
