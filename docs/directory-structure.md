# Directory structure

```shell
src/
 ├── app/                  # Entry points y providers globales
 │   ├── App.tsx
 │   ├── routes/           # Definición de rutas
 │   └── store/            # State global (Redux/Zustand/Recoil)
 │
 ├── modules/              # Feature-based architecture
 │   ├── affiliates/       # Todo lo relacionado a Afiliados
 │   │   ├── components/   # Botones, forms, modals
 │   │   ├── pages/        # Dashboard, registro, etc.
 │   │   ├── hooks/        # useAffiliateStats, useCommission
 │   │   ├── services/     # Llamadas a API Cellxpert
 │   │   └── types.ts
 │   │
 │   ├── subAffiliates/    # Todo lo relacionado a Sub-afiliados
 │   │   ├── components/
 │   │   ├── pages/
 │   │   ├── hooks/
 │   │   └── types.ts
 │   │
 │   ├── blockchain/       # Interacciones Web3
 │   │   ├── components/   # Botón conectar, contratos
 │   │   ├── deployments/  # JSON de contratos compilados
 │   │   ├── hooks/        # useWallet, useVault
 │   │   └── utils.ts
 │   │
 │   ├── analytics/        # Charts, reportes, mapas
 │   │   ├── components/
 │   │   ├── hooks/
 │   │   └── utils.ts
 │   │
 │   └── marketing/        # Herramientas de invitación, broadcast
 │       ├── components/
 │       ├── pages/
 │       └── hooks/
 │
 ├── shared/               # Código común y reutilizable
 │   ├── components/       # Botones, modales, tablas genéricas
 │   ├── hooks/            # useAuth, useTheme
 │   ├── utils/            # Funciones comunes
 │   ├── types/            # Interfaces globales
 │   └── services/         # api.ts, walletService.ts
 │
 ├── layouts/              # MasterLayout, SubsLayout, etc.
 │   ├── components/
 │   └── hooks/
 │
 └── assets/               # Imágenes, SVGs, estilos globales
     ├── styles/
     └── images/
```
