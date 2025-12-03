# Guía de Integración Frontend - Estructura Unificada de Sub-IBs

## Resumen de Cambios

La API ahora devuelve una estructura unificada y consistente que agrupa los clientes por **Sub-IB** (`ownerName`), permitiendo analizar de forma eficiente quién es responsable de los ingresos totales.

**IMPORTANTE**: Los clientes solo se envían dentro de `sub_ibs[].clients` cuando se solicita con `include_clients=true`. No existe un array `all_clients` separado para evitar redundancia de datos.

## Cambios en la Estructura de Datos

### Antes (Estructura Antigua)

```json
{
  "retail_headers": [
    {
      "id": 9,
      "account_login": 0,
      "msg": "all_clientsV2 - Owner: Kristina Lazarova",
      "client_count": 0
    }
  ],
  "VantageRetailHeaders": [...],
  "VantageRetailClients": [...]
}
```

### Ahora (Estructura Nueva)

```json
{
  "accounts": [...],
  "sub_ibs": [
    {
      "ownerName": "Kristina Lazarova",
      "clientCount": 1200,
      "totalBalance": 50000.00,
      "totalEquity": 55000.00,
      "totalDeposits": 100000.00,
      "depositCount": 500,
      "averageBalance": 41.67,
      "averageEquity": 45.83,
      "averageDeposit": 200.00,
      "clients": [...] // Solo si include_clients=true - ÚNICA fuente de datos de clientes
    }
  ]
}
```

**IMPORTANTE**: 
- Los clientes **solo** están disponibles dentro de `sub_ibs[].clients` cuando `include_clients=true`
- **NO existe** un array `all_clients` separado para evitar duplicación de datos
- Si necesitas todos los clientes sin agrupar, debes iterar sobre `sub_ibs` y extraer los arrays `clients` de cada uno

## Documentación Completa de Endpoints

Para la documentación completa y detallada de todos los endpoints, consulta: **[frontend-api-endpoints.md](./frontend-api-endpoints.md)**

## Resumen de Endpoints

### 1. GET `/api/vantage-scraper` - Lista de Snapshots

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `summary_only` (default: true)
- `include` (opcional: "full")

**Nueva Respuesta:**
```json
{
  "success": true,
  "data": {
    "snapshots": [
      {
        "id": "snapshot_1764726735156",
        "timestamp": 1764726735156,
        "scraped_at": "2025-12-03T01:52:15.000Z",
        "total_accounts": 2,
        "total_retail_clients": 2081,
        "accounts": [...],
        "sub_ibs": [
          {
            "ownerName": "Kristina Lazarova",
            "clientCount": 1200,
            "totalBalance": 50000.00,
            "totalEquity": 55000.00,
            "totalDeposits": 100000.00,
            "depositCount": 500,
            "averageBalance": 41.67,
            "averageEquity": 45.83,
            "averageDeposit": 200.00
          }
        ]
      }
    ],
    "pagination": {...}
  }
}
```

**Estructura de Sub-IB:**
- `ownerName`: Nombre del Sub-IB (string)
- `clientCount`: Número total de clientes bajo este Sub-IB (number)
- `totalBalance`: Suma de todos los balances de los clientes (number)
- `totalEquity`: Suma de todos los equities de los clientes (number)
- `totalDeposits`: Suma de todos los depósitos realizados (number)
- `depositCount`: Número de depósitos realizados (number)
- `averageBalance`: Balance promedio por cliente (number)
- `averageEquity`: Equity promedio por cliente (number)
- `averageDeposit`: Depósito promedio (number)
- `clients`: Array de clientes (solo presente si `include_clients=true` en el endpoint)
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 36,
      "totalPages": 1
    }
  }
}
```

### 2. GET `/api/vantage-scraper/:snapshotId` - Snapshot Individual

**Query Parameters:**
- `include_clients` (default: false)
- `client_limit` (default: 100, solo si include_clients=true)
- `fields` (opcional: campos separados por coma)

**Nueva Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": "snapshot_1764726735156",
    "timestamp": 1764726735156,
    "scraped_at": "2025-12-03T01:52:15.000Z",
    "total_accounts": 2,
    "total_retail_clients": 2081,
    "accounts": [...],
    "sub_ibs": [
      {
        "ownerName": "Kristina Lazarova",
        "clientCount": 1200,
        "totalBalance": 50000.00,
        "totalEquity": 55000.00,
        "totalDeposits": 100000.00,
        "depositCount": 500,
        "averageBalance": 41.67,
        "averageEquity": 45.83,
        "averageDeposit": 200.00,
        "clients": [...] // Solo si include_clients=true - ÚNICA fuente de datos de clientes
      }
    ]
  }
}
```

### 3. GET `/api/vantage-scraper/:snapshotId/clients` - Clientes Paginados

**Nueva Respuesta:**
```json
{
  "success": true,
  "data": {
    "snapshot_id": "snapshot_1764726735156",
    "clients": [...],
    "sub_ibs_summary": [
      {
        "ownerName": "Kristina Lazarova",
        "totalClients": 1200,
        "totalBalance": 50000.00,
        "totalEquity": 55000.00,
        "totalDeposits": 100000.00,
        "depositCount": 500,
        "averageBalance": 41.67,
        "averageEquity": 45.83,
        "averageDeposit": 200.00
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 2081,
      "totalPages": 42
    }
  }
}
```

### 4. GET `/api/vantage-scraper/:snapshotId/analytics` - Analytics

**Nueva Respuesta:**
```json
{
  "success": true,
  "data": {
    "snapshot_id": "snapshot_1764726735156",
    "snapshot": {...},
    "analytics": {
      "total_clients": 2081,
      "total_balance": 150000.00,
      "total_profit": 5000.00,
      "average_balance": 72.08,
      "average_profit": 2.40,
      "clients_by_platform": {...},
      "clients_by_account_type": {...},
      "clients_by_currency": {...},
      "deposit_stats": {...},
      "top_clients_by_balance": [...],
      "top_clients_by_profit": [...],
      "sub_ibs": {
        "total_clients": 2081,
        "total_balance": 150000.00,
        "total_equity": 160000.00,
        "total_deposits": 300000.00,
        "average_balance": 72.08,
        "average_equity": 76.92,
        "average_deposit": 144.23,
        "sub_ibs": [
          {
            "ownerName": "Kristina Lazarova",
            "totalClients": 1200,
            "totalBalance": 50000.00,
            "totalEquity": 55000.00,
            "totalDeposits": 100000.00,
            "depositCount": 500,
            "averageBalance": 41.67,
            "averageEquity": 45.83,
            "averageDeposit": 200.00
          }
        ],
        "sub_ibs_by_clients": [...],
        "sub_ibs_by_balance": [...]
      }
    }
  }
}
```

## Guía de Implementación

### Paso 1: Actualizar Tipos/Interfaces TypeScript

```typescript
// types/vantage.ts

export interface SubIB {
  ownerName: string;
  clientCount: number;
  totalBalance: number;
  totalEquity: number;
  totalDeposits: number;
  depositCount: number;
  averageBalance: number;
  averageEquity: number;
  averageDeposit: number;
  clients?: Client[]; // Solo presente si include_clients=true
}

export interface Snapshot {
  id: string;
  timestamp: number;
  scraped_at: string;
  total_accounts: number;
  total_retail_clients: number;
  createdAt: string;
  updatedAt: string;
  accounts: Account[];
  sub_ibs: SubIB[];
  all_clients?: Client[]; // Solo presente si include_clients=true
}

export interface SnapshotsResponse {
  success: boolean;
  data: {
    snapshots: Snapshot[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface SnapshotResponse {
  success: boolean;
  data: Snapshot;
}

export interface ClientsResponse {
  success: boolean;
  data: {
    snapshot_id: string;
    clients: Client[];
    sub_ibs_summary: SubIB[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface AnalyticsResponse {
  success: boolean;
  data: {
    snapshot_id: string;
    snapshot: Snapshot;
    analytics: {
      total_clients: number;
      total_balance: number;
      total_profit: number;
      average_balance: number;
      average_profit: number;
      clients_by_platform: Record<string, number>;
      clients_by_account_type: Record<string, number>;
      clients_by_currency: Record<string, number>;
      deposit_stats: {
        total_deposits: number;
        average_deposit: number;
        deposit_count: number;
      };
      top_clients_by_balance: Client[];
      top_clients_by_profit: Client[];
      sub_ibs: {
        total_clients: number;
        total_balance: number;
        total_equity: number;
        total_deposits: number;
        average_balance: number;
        average_equity: number;
        average_deposit: number;
        sub_ibs: SubIB[];
        sub_ibs_by_clients: SubIB[];
        sub_ibs_by_balance: SubIB[];
      };
    };
  };
}
```

### Paso 2: Actualizar Servicios/API Calls

```typescript
// services/vantageApi.ts

const API_BASE = '/api/vantage-scraper';

export const vantageApi = {
  // Lista de snapshots
  getSnapshots: async (params?: {
    page?: number;
    limit?: number;
    summary_only?: boolean;
    include?: string;
  }): Promise<SnapshotsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.summary_only !== undefined) {
      queryParams.set('summary_only', params.summary_only.toString());
    }
    if (params?.include) queryParams.set('include', params.include);
    
    const response = await fetch(`${API_BASE}?${queryParams}`);
    return response.json();
  },

  // Snapshot individual
  getSnapshot: async (
    snapshotId: string,
    params?: {
      include_clients?: boolean;
      client_limit?: number;
      fields?: string;
    }
  ): Promise<SnapshotResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.include_clients) {
      queryParams.set('include_clients', 'true');
      if (params?.client_limit) {
        queryParams.set('client_limit', params.client_limit.toString());
      }
    }
    if (params?.fields) queryParams.set('fields', params.fields);
    
    const response = await fetch(`${API_BASE}/${snapshotId}?${queryParams}`);
    return response.json();
  },

  // Clientes paginados
  getSnapshotClients: async (
    snapshotId: string,
    params?: {
      page?: number;
      limit?: number;
      fields?: string;
    }
  ): Promise<ClientsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.fields) queryParams.set('fields', params.fields);
    
    const response = await fetch(`${API_BASE}/${snapshotId}/clients?${queryParams}`);
    return response.json();
  },

  // Analytics
  getSnapshotAnalytics: async (
    snapshotId: string
  ): Promise<AnalyticsResponse> => {
    const response = await fetch(`${API_BASE}/${snapshotId}/analytics`);
    return response.json();
  },
};
```

### Paso 3: Componente de Lista de Snapshots

```tsx
// components/SnapshotsList.tsx

import React from 'react';
import { SnapshotsResponse } from '../types/vantage';

interface Props {
  data: SnapshotsResponse;
}

export const SnapshotsList: React.FC<Props> = ({ data }) => {
  return (
    <div className="snapshots-list">
      {data.data.snapshots.map((snapshot) => (
        <div key={snapshot.id} className="snapshot-card">
          <h3>{snapshot.id}</h3>
          <p>Fecha: {new Date(snapshot.scraped_at).toLocaleString()}</p>
          <p>Total Clientes: {snapshot.total_retail_clients}</p>
          <p>Total Cuentas: {snapshot.total_accounts}</p>
          
          {/* Nueva sección: Sub-IBs */}
          <div className="sub-ibs-section">
            <h4>Sub-IBs ({snapshot.sub_ibs.length})</h4>
            <div className="sub-ibs-grid">
              {snapshot.sub_ibs.map((subIB) => (
                <div key={subIB.ownerName} className="sub-ib-card">
                  <h5>{subIB.ownerName}</h5>
                  <div className="metrics">
                    <div className="metric">
                      <span className="label">Clientes:</span>
                      <span className="value">{subIB.clientCount}</span>
                    </div>
                    <div className="metric">
                      <span className="label">Balance Total:</span>
                      <span className="value">
                        ${subIB.totalBalance.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>
                    </div>
                    <div className="metric">
                      <span className="label">Depósitos Total:</span>
                      <span className="value">
                        ${subIB.totalDeposits.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>
                    </div>
                    <div className="metric">
                      <span className="label">Promedio Depósito:</span>
                      <span className="value">
                        ${subIB.averageDeposit.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
```

### Paso 4: Componente de Detalle de Snapshot

```tsx
// components/SnapshotDetail.tsx

import React, { useState } from 'react';
import { Snapshot, SubIB } from '../types/vantage';

interface Props {
  snapshot: Snapshot;
}

export const SnapshotDetail: React.FC<Props> = ({ snapshot }) => {
  const [selectedSubIB, setSelectedSubIB] = useState<SubIB | null>(null);
  const [sortBy, setSortBy] = useState<'clients' | 'balance' | 'deposits'>('clients');

  const sortedSubIBs = [...snapshot.sub_ibs].sort((a, b) => {
    switch (sortBy) {
      case 'clients':
        return b.clientCount - a.clientCount;
      case 'balance':
        return b.totalBalance - a.totalBalance;
      case 'deposits':
        return b.totalDeposits - a.totalDeposits;
      default:
        return 0;
    }
  });

  return (
    <div className="snapshot-detail">
      <div className="header">
        <h2>Snapshot: {snapshot.id}</h2>
        <p>Fecha: {new Date(snapshot.scraped_at).toLocaleString()}</p>
      </div>

      {/* Resumen General */}
      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total Clientes</h3>
          <p className="value">{snapshot.total_retail_clients}</p>
        </div>
        <div className="summary-card">
          <h3>Total Cuentas</h3>
          <p className="value">{snapshot.total_accounts}</p>
        </div>
        <div className="summary-card">
          <h3>Sub-IBs</h3>
          <p className="value">{snapshot.sub_ibs.length}</p>
        </div>
      </div>

      {/* Tabla de Sub-IBs */}
      <div className="sub-ibs-table-section">
        <div className="table-header">
          <h3>Análisis por Sub-IB</h3>
          <div className="sort-controls">
            <label>Ordenar por:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="clients">Número de Clientes</option>
              <option value="balance">Balance Total</option>
              <option value="deposits">Depósitos Total</option>
            </select>
          </div>
        </div>

        <table className="sub-ibs-table">
          <thead>
            <tr>
              <th>Sub-IB</th>
              <th>Clientes</th>
              <th>Balance Total</th>
              <th>Equity Total</th>
              <th>Depósitos Total</th>
              <th># Depósitos</th>
              <th>Promedio Depósito</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sortedSubIBs.map((subIB) => (
              <tr
                key={subIB.ownerName}
                className={selectedSubIB?.ownerName === subIB.ownerName ? 'selected' : ''}
                onClick={() => setSelectedSubIB(subIB)}
              >
                <td className="owner-name">{subIB.ownerName}</td>
                <td>{subIB.clientCount.toLocaleString()}</td>
                <td>
                  ${subIB.totalBalance.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </td>
                <td>
                  ${subIB.totalEquity.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </td>
                <td>
                  ${subIB.totalDeposits.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </td>
                <td>{subIB.depositCount.toLocaleString()}</td>
                <td>
                  ${subIB.averageDeposit.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </td>
                <td>
                  <button onClick={() => setSelectedSubIB(subIB)}>
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Panel de Detalle de Sub-IB Seleccionado */}
      {selectedSubIB && (
        <div className="sub-ib-detail-panel">
          <h3>Detalles: {selectedSubIB.ownerName}</h3>
          <div className="detail-metrics">
            <div className="metric-group">
              <h4>Clientes</h4>
              <p>{selectedSubIB.clientCount.toLocaleString()}</p>
            </div>
            <div className="metric-group">
              <h4>Balance Total</h4>
              <p>
                ${selectedSubIB.totalBalance.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>
            </div>
            <div className="metric-group">
              <h4>Equity Total</h4>
              <p>
                ${selectedSubIB.totalEquity.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>
            </div>
            <div className="metric-group">
              <h4>Depósitos Total</h4>
              <p>
                ${selectedSubIB.totalDeposits.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>
            </div>
            <div className="metric-group">
              <h4>Promedio Balance</h4>
              <p>
                ${selectedSubIB.averageBalance.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>
            </div>
            <div className="metric-group">
              <h4>Promedio Depósito</h4>
              <p>
                ${selectedSubIB.averageDeposit.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>
            </div>
          </div>
          
          {selectedSubIB.clients && (
            <div className="clients-list">
              <h4>Clientes ({selectedSubIB.clients.length})</h4>
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Cuenta</th>
                    <th>Balance</th>
                    <th>Equity</th>
                    <th>Último Depósito</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSubIB.clients.map((client) => (
                    <tr key={client.id}>
                      <td>{client.name}</td>
                      <td>{client.accountNmber}</td>
                      <td>
                        ${(client.accountBalance || 0).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </td>
                      <td>
                        ${(client.equity || 0).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </td>
                      <td>
                        {client.lastDepositAmount
                          ? `$${client.lastDepositAmount.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}`
                          : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
```

### Paso 5: Componente de Analytics

```tsx
// components/SnapshotAnalytics.tsx

import React from 'react';
import { AnalyticsResponse } from '../types/vantage';

interface Props {
  analytics: AnalyticsResponse['data']['analytics'];
}

export const SnapshotAnalytics: React.FC<Props> = ({ analytics }) => {
  const subIBAnalytics = analytics.sub_ibs;

  return (
    <div className="analytics">
      <h2>Analytics del Snapshot</h2>

      {/* Métricas Generales */}
      <div className="general-metrics">
        <div className="metric-card">
          <h3>Total Clientes</h3>
          <p>{analytics.total_clients.toLocaleString()}</p>
        </div>
        <div className="metric-card">
          <h3>Balance Total</h3>
          <p>
            ${analytics.total_balance.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </p>
        </div>
        <div className="metric-card">
          <h3>Depósitos Total</h3>
          <p>
            ${subIBAnalytics.total_deposits.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </p>
        </div>
      </div>

      {/* Top Sub-IBs por Depósitos */}
      <div className="top-sub-ibs">
        <h3>Top Sub-IBs por Depósitos</h3>
        <div className="sub-ibs-list">
          {subIBAnalytics.sub_ibs_by_balance.slice(0, 10).map((subIB, index) => (
            <div key={subIB.ownerName} className="sub-ib-rank-item">
              <span className="rank">#{index + 1}</span>
              <span className="name">{subIB.ownerName}</span>
              <span className="value">
                ${subIB.totalDeposits.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
              <span className="clients">{subIB.totalClients} clientes</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Sub-IBs por Clientes */}
      <div className="top-sub-ibs">
        <h3>Top Sub-IBs por Número de Clientes</h3>
        <div className="sub-ibs-list">
          {subIBAnalytics.sub_ibs_by_clients.slice(0, 10).map((subIB, index) => (
            <div key={subIB.ownerName} className="sub-ib-rank-item">
              <span className="rank">#{index + 1}</span>
              <span className="name">{subIB.ownerName}</span>
              <span className="value">{subIB.totalClients.toLocaleString()}</span>
              <span className="deposits">
                ${subIB.totalDeposits.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

## Migración de Código Existente

### Cambios Necesarios

1. **Eliminar referencias a `retail_headers`**
   ```typescript
   // ❌ Antes
   snapshot.retail_headers.forEach(header => {
     // ...
   });

   // ✅ Ahora
   snapshot.sub_ibs.forEach(subIB => {
     // ...
   });
   ```

2. **Eliminar referencias a `VantageRetailHeaders` y `VantageRetailClients`**
   ```typescript
   // ❌ Antes
   snapshot.VantageRetailHeaders.forEach(header => {
     header.VantageRetailClients.forEach(client => {
       // ...
     });
   });

   // ✅ Ahora
   snapshot.sub_ibs.forEach(subIB => {
     subIB.clients?.forEach(client => {
       // ...
     });
   });
   ```

3. **Actualizar acceso a `ownerName`**
   ```typescript
   // ❌ Antes (necesitabas buscar en el header)
   const ownerName = header.msg?.replace('all_clientsV2 - Owner: ', '') || 'Unknown';

   // ✅ Ahora (directo en el objeto)
   const ownerName = subIB.ownerName;
   ```

## Mejores Prácticas

### 1. Formateo de Monedas

Siempre formatea los valores monetarios con 2 decimales:

```typescript
const formatCurrency = (value: number): string => {
  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};
```

### 2. Manejo de Valores Nulos

```typescript
const safeValue = (value: number | null | undefined, defaultValue = 0): number => {
  return value ?? defaultValue;
};
```

### 3. Cálculo de Porcentajes

```typescript
const calculatePercentage = (part: number, total: number): number => {
  if (total === 0) return 0;
  return (part / total) * 100;
};

// Ejemplo: Porcentaje de depósitos por Sub-IB
const subIBPercentage = calculatePercentage(
  subIB.totalDeposits,
  totalDeposits
);
```

### 4. Ordenamiento

```typescript
// Ordenar Sub-IBs por diferentes criterios
const sortSubIBs = (subIBs: SubIB[], sortBy: 'clients' | 'balance' | 'deposits') => {
  return [...subIBs].sort((a, b) => {
    switch (sortBy) {
      case 'clients':
        return b.clientCount - a.clientCount;
      case 'balance':
        return b.totalBalance - a.totalBalance;
      case 'deposits':
        return b.totalDeposits - a.totalDeposits;
      default:
        return 0;
    }
  });
};
```

## Ejemplos de Visualización

### Gráfico de Barras - Top Sub-IBs por Depósitos

```tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const SubIBDepositsChart: React.FC<{ subIBs: SubIB[] }> = ({ subIBs }) => {
  const data = subIBs
    .sort((a, b) => b.totalDeposits - a.totalDeposits)
    .slice(0, 10)
    .map(subIB => ({
      name: subIB.ownerName,
      depósitos: subIB.totalDeposits,
      clientes: subIB.clientCount
    }));

  return (
    <BarChart width={800} height={400} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="depósitos" fill="#8884d8" />
    </BarChart>
  );
};
```

### Tabla Comparativa de Sub-IBs

```tsx
const SubIBComparisonTable: React.FC<{ subIBs: SubIB[] }> = ({ subIBs }) => {
  const totalDeposits = subIBs.reduce((sum, subIB) => sum + subIB.totalDeposits, 0);

  return (
    <table>
      <thead>
        <tr>
          <th>Sub-IB</th>
          <th>Clientes</th>
          <th>Depósitos</th>
          <th>% del Total</th>
          <th>Promedio</th>
        </tr>
      </thead>
      <tbody>
        {subIBs.map(subIB => {
          const percentage = (subIB.totalDeposits / totalDeposits) * 100;
          return (
            <tr key={subIB.ownerName}>
              <td>{subIB.ownerName}</td>
              <td>{subIB.clientCount}</td>
              <td>${subIB.totalDeposits.toLocaleString()}</td>
              <td>
                <div className="percentage-bar">
                  <div
                    className="percentage-fill"
                    style={{ width: `${percentage}%` }}
                  />
                  <span>{percentage.toFixed(2)}%</span>
                </div>
              </td>
              <td>${subIB.averageDeposit.toLocaleString()}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
```

## Checklist de Migración

- [ ] Actualizar tipos/interfaces TypeScript
- [ ] Actualizar servicios/API calls
- [ ] Reemplazar `retail_headers` por `sub_ibs`
- [ ] Reemplazar `VantageRetailHeaders` por `sub_ibs`
- [ ] Reemplazar `VantageRetailClients` por `sub_ibs[].clients` o `all_clients`
- [ ] Actualizar componentes de lista de snapshots
- [ ] Actualizar componentes de detalle de snapshot
- [ ] Actualizar componentes de analytics
- [ ] Agregar visualizaciones de Sub-IBs
- [ ] Actualizar tests unitarios
- [ ] Actualizar documentación de componentes

## Notas Importantes

1. **Backward Compatibility**: La estructura antigua ya no está disponible. Asegúrate de actualizar todo el código que dependía de `retail_headers` o `VantageRetailHeaders`.

2. **Performance**: Cuando uses `include_clients=true`, ten en cuenta que puede ser una respuesta grande. Considera usar paginación o límites.

3. **Ordenamiento**: Los Sub-IBs vienen ordenados por número de clientes por defecto, pero puedes reordenarlos en el frontend según tus necesidades.

4. **Campos Opcionales**: `clients` dentro de `sub_ibs` y `all_clients` solo están presentes cuando `include_clients=true`.

## Soporte

Si tienes preguntas o encuentras problemas durante la migración, consulta:
- Documentación de la API: `/api/vantage-scraper/:snapshotId/analytics`
- Ejemplos de respuesta en: `docs/page1limit50.md` y `docs/snapshot_id-res.md`

