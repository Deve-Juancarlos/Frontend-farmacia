# Frontend Farmacia

Interfaz web (SPA) para el sistema de gestión farmacéutica. Consume la API del backend `Backen-farmacia`.

## Stack

- **React 19** + **Vite 8**
- **React Router 7**
- **Tailwind CSS 4**
- **Axios**

## Estructura

```
src/
├── components/
│   ├── auth/            Login, Register
│   ├── layout/          Navbar
│   └── medicamentos/    Dashboard, MedicamentoTabla, MedicamentoFormModal
├── context/             authContext (contexto) y AuthProvider (estado de sesión)
├── services/            api.js (instancia axios + manejo de sesión expirada)
└── App.jsx              Rutas y ruta protegida
```

## Puesta en marcha

```bash
npm install
cp .env.example .env      # define VITE_API_URL
npm run dev               # http://localhost:5173
```

## Funcionalidad

- **Login** con opción "Recordarme" (persiste en `localStorage`; si no, en `sessionStorage`).
- **Registro** de usuario; si se marca "Registrar mi propia farmacia", crea un tenant y el usuario queda como su administrador.
- **Dashboard** con CRUD completo del inventario:
  - Listar medicamentos de la farmacia.
  - Crear y editar (incluido stock y precios) para `administrador` y `moderador`.
  - Eliminar solo para `administrador`.
  - Los usuarios `usuario` tienen vista de solo lectura.
- Manejo automático de sesión expirada (401 → vuelve al login).

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Desarrollo con HMR |
| `npm run build` | Build de producción |
| `npm run preview` | Sirve el build |
| `npm run lint` | Análisis con ESLint |

## Convenciones

- Máximo **250 líneas por archivo**; si se supera, dividir en subcarpetas/módulos.
- Toda llamada a la API pasa por `src/services/api.js` (nunca `axios` directo).
