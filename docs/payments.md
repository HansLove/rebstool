# NowPayments Endpoints Guide

Esta guía describe todos los endpoints disponibles para integración con NowPayments en el frontend.

## Base URL

```
crypto-payments
```

## Autenticación

Todos los endpoints (excepto webhooks) requieren un JWT token válido en el header:

```
Authorization: Bearer <jwt_token>
```

---

## 📥 DEPÓSITOS (Deposits)

### 1. Crear Depósito

**POST** `crypto-payments/deposits`

Crea un nuevo depósito utilizando NowPayments para generar la dirección de pago.

#### Request Body:

```json
{
  "amount": 100.5,
  "price_currency": "USD",
  "pay_currency": "BTC",
  "order_description": "Depósito de $100.50 USD"
}
```

#### Parámetros:

- `amount` (required): Cantidad a depositar
- `price_currency` (optional): Moneda del precio (default: "USD")
- `pay_currency` (required): Criptomoneda para el pago (BTC, ETH, USDT, etc.)
- `order_description` (optional): Descripción del depósito

#### Response (201 Created):

```json
{
  "success": true,
  "message": "Deposit created successfully",
  "data": {
    "deposit": {
      "id": 123,
      "orderId": "deposit_1695123456789_abc123",
      "amount": 100.5,
      "currency": "USD",
      "cryptoCurrency": "BTC",
      "status": "waiting",
      "payAddress": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      "payAmount": 0.00234567,
      "network": "btc",
      "expiresAt": "2024-09-24T20:15:30.000Z",
      "createdAt": "2024-09-24T19:15:30.000Z"
    },
    "payment": {
      "paymentId": "5077962837",
      "status": "waiting",
      "payAddress": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      "payAmount": 0.00234567,
      "payCurrency": "BTC",
      "network": "btc",
      "expiresAt": "2024-09-24T20:15:30.000Z"
    }
  }
}
```

#### Estados posibles del depósito:

- `waiting` - Esperando fondos del usuario
- `confirming` - Confirmando en blockchain
- `confirmed` - Confirmado en blockchain
- `sending` - Enviando a wallet
- `partially_paid` - Pago parcial recibido
- `finished` - Depósito completado
- `failed` - Depósito fallido
- `expired` - Depósito expirado
- `refunded` - Depósito reembolsado

---

### 2. Listar Depósitos del Usuario

**GET** `crypto-payments/deposits`

Obtiene todos los depósitos del usuario autenticado con paginación.

#### Query Parameters:

```
?page=1&limit=10&status=waiting&currency=BTC
```

- `page` (optional): Número de página (default: 1)
- `limit` (optional): Elementos por página (default: 10)
- `status` (optional): Filtrar por estado
- `currency` (optional): Filtrar por moneda (price_currency o pay_currency)

#### Response (200 OK):

```json
{
  "success": true,
  "data": {
    "deposits": [
      {
        "id": 123,
        "amount": 100.5,
        "price_currency": "USD",
        "pay_currency": "BTC",
        "payment_id": "5077962837",
        "payment_status": "finished",
        "pay_address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
        "pay_amount": 0.00234567,
        "actually_paid": 0.00234567,
        "transaction_hash": "a1b2c3...",
        "order_id": "deposit_1695123456789_abc123",
        "order_description": "Depósito de $100.50 USD",
        "network": "btc",
        "expires_at": "2024-09-24T20:15:30.000Z",
        "processed_at": "2024-09-24T19:45:30.000Z",
        "createdAt": "2024-09-24T19:15:30.000Z",
        "updatedAt": "2024-09-24T19:45:30.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

---

### 3. Obtener Depósito por ID

**GET** `crypto-payments/deposits/:id`

Obtiene los detalles de un depósito específico.

#### Response (200 OK):

```json
{
  "success": true,
  "data": {
    "id": 123,
    "amount": 100.5,
    "price_currency": "USD",
    "pay_currency": "BTC",
    "payment_id": "5077962837",
    "payment_status": "finished",
    "pay_address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    "pay_amount": 0.00234567,
    "actually_paid": 0.00234567,
    "transaction_hash": "a1b2c3d4e5f6...",
    "order_id": "deposit_1695123456789_abc123",
    "order_description": "Depósito de $100.50 USD",
    "network": "btc",
    "expires_at": "2024-09-24T20:15:30.000Z",
    "processed_at": "2024-09-24T19:45:30.000Z",
    "createdAt": "2024-09-24T19:15:30.000Z",
    "updatedAt": "2024-09-24T19:45:30.000Z"
  }
}
```

---

### 4. Estadísticas de Depósitos

**GET** `crypto-payments/deposits/stats`

Obtiene estadísticas resumidas de los depósitos del usuario.

#### Response (200 OK):

```json
{
  "success": true,
  "data": {
    "totalDeposits": 25,
    "completedDeposits": 20,
    "pendingDeposits": 3,
    "failedDeposits": 2,
    "totalAmountDeposited": 1250.75
  }
}
```

---

## 📤 RETIROS (Withdrawals)

### 1. Crear Retiro

**POST** `crypto-payments/withdrawals`

Crea un nuevo retiro utilizando NowPayments payouts. Requiere el bearer token del usuario para NowPayments.

#### Request Body:

```json
{
  "amount": 50.25,
  "currency": "USDT",
  "address": "TQn9Y2khEsLJW1ChVWFMSMeRDow5oQdmfn",
  "bearerToken": "user-nowpayments-bearer-token"
}
```

#### Parámetros:

- `amount` (required): Cantidad a retirar
- `currency` (required): Criptomoneda a retirar (BTC, ETH, USDT, etc.)
- `address` (required): Dirección de destino (mínimo 20 caracteres)
- `bearerToken` (required): Bearer token del usuario para NowPayments payouts

#### Response (201 Created):

```json
{
  "success": true,
  "message": "Withdrawal request processed successfully",
  "data": {
    "withdrawal": {
      "id": 456,
      "amount": 50.25,
      "currency": "USDT",
      "address": "TQn9Y2khEsLJW1ChVWFMSMeRDow5oQdmfn",
      "status": "processing",
      "payoutId": "payout_123456",
      "withdrawalId": "withdrawal_789",
      "requestedAt": "2024-09-24T19:30:00.000Z",
      "createdAt": "2024-09-24T19:30:00.000Z"
    },
    "payout": {
      "payoutId": "payout_123456",
      "withdrawals": [
        {
          "id": "withdrawal_789",
          "status": "processing",
          "address": "TQn9Y2khEsLJW1ChVWFMSMeRDow5oQdmfn",
          "amount": 50.25,
          "currency": "USDT"
        }
      ]
    }
  }
}
```

#### Estados posibles del retiro:

- `pending` - Retiro solicitado pero no procesado
- `waiting` - Esperando procesamiento
- `processing` - Procesando retiro
- `sending` - Enviando fondos
- `finished` - Retiro completado
- `failed` - Retiro fallido
- `rejected` - Retiro rechazado
- `cancelled` - Retiro cancelado

---

### 2. Listar Retiros del Usuario

**GET** `crypto-payments/withdrawals`

Obtiene todos los retiros del usuario autenticado con paginación.

#### Query Parameters:

```
?page=1&limit=10&status=processing&currency=USDT
```

- `page` (optional): Número de página (default: 1)
- `limit` (optional): Elementos por página (default: 10)
- `status` (optional): Filtrar por estado
- `currency` (optional): Filtrar por criptomoneda

#### Response (200 OK):

```json
{
  "success": true,
  "data": {
    "withdrawals": [
      {
        "id": 456,
        "amount": 50.25,
        "currency": "USDT",
        "address": "TQn9Y2khEsLJW1ChVWFMSMeRDow5oQdmfn",
        "payout_id": "payout_123456",
        "withdrawal_id": "withdrawal_789",
        "status": "finished",
        "transaction_hash": "x1y2z3...",
        "network": "tron",
        "fee": 1.0,
        "final_amount": 49.25,
        "error_message": null,
        "processed_at": "2024-09-24T19:45:00.000Z",
        "requested_at": "2024-09-24T19:30:00.000Z",
        "createdAt": "2024-09-24T19:30:00.000Z",
        "updatedAt": "2024-09-24T19:45:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 15,
      "totalPages": 2
    }
  }
}
```

---

### 3. Obtener Retiro por ID

**GET** `crypto-payments/withdrawals/:id`

Obtiene los detalles de un retiro específico.

#### Response (200 OK):

```json
{
  "success": true,
  "data": {
    "id": 456,
    "amount": 50.25,
    "currency": "USDT",
    "address": "TQn9Y2khEsLJW1ChVWFMSMeRDow5oQdmfn",
    "payout_id": "payout_123456",
    "withdrawal_id": "withdrawal_789",
    "status": "finished",
    "transaction_hash": "x1y2z3w4v5u6...",
    "network": "tron",
    "fee": 1.0,
    "final_amount": 49.25,
    "error_message": null,
    "processed_at": "2024-09-24T19:45:00.000Z",
    "requested_at": "2024-09-24T19:30:00.000Z",
    "createdAt": "2024-09-24T19:30:00.000Z",
    "updatedAt": "2024-09-24T19:45:00.000Z"
  }
}
```

---

### 4. Cancelar Retiro

**PUT** `crypto-payments/withdrawals/:id/cancel`

Cancela un retiro que esté en estado `pending` o `waiting`.

#### Response (200 OK):

```json
{
  "success": true,
  "message": "Withdrawal cancelled successfully",
  "data": {
    "id": 456,
    "status": "cancelled"
  }
}
```

---

### 5. Estadísticas de Retiros

**GET** `crypto-payments/withdrawals/stats`

Obtiene estadísticas resumidas de los retiros del usuario.

#### Response (200 OK):

```json
{
  "success": true,
  "data": {
    "totalWithdrawals": 15,
    "completedWithdrawals": 12,
    "pendingWithdrawals": 2,
    "failedWithdrawals": 1,
    "totalAmountWithdrawn": 625.5
  }
}
```

---

## ❌ Códigos de Error Comunes

### 400 Bad Request

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Amount and pay_currency are required"
  }
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "error": {
    "code": "AUTH_ERROR",
    "message": "Invalid or missing authentication token"
  }
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": {
    "code": "DEPOSIT_NOT_FOUND",
    "message": "Deposit not found"
  }
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Failed to create deposit"
  }
}
```

---

## 🔔 Webhooks (Solo para información)

Los webhooks se manejan automáticamente en el backend y actualizan los estados de las transacciones:

- **Payment Webhook**: `crypto-payments/webhook/payment`
- **Payout Webhook**: `crypto-payments/webhook/payout`

El frontend debe implementar polling o WebSockets para obtener actualizaciones de estado en tiempo real.

---

## 📝 Notas Importantes

1. **Bearer Token para Retiros**: Cada usuario debe tener su propio bearer token de NowPayments para poder hacer retiros.

2. **Estados en Tiempo Real**: Los estados de las transacciones se actualizan automáticamente via webhooks. El frontend debe consultar periódicamente o implementar notificaciones en tiempo real.

3. **Validación de Direcciones**: Las direcciones de criptomonedas deben ser válidas para la red correspondiente.

4. **Límites y Fees**: Los límites mínimos/máximos y las tarifas dependen de la configuración de NowPayments.

5. **Ambiente de Pruebas**: Usar `https://api-sandbox.nowpayments.io/v1` para pruebas y `https://api.nowpayments.io/v1` para producción.

6. **Seguridad**: Nunca exponer bearer tokens en el frontend. Deben ser almacenados de forma segura en el backend.
