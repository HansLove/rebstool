import { useEffect, useState } from "react";
import { useBlockchainContext } from "@/context/BlockchainProvider";
import { ContractVaultFactory } from "@/components/blockchain/ContractVaultFactory";
import SingleSubAffilliate from "@/modules/subAffiliates/components/SingleSubAffilliate";

// ### 🧠 DATOS DE VALOR QUE PUEDES AGREGAR

// * **¿Por qué?** Permite entender qué tan efectivos son trayendo usuarios que realmente depositan.
// * **Cómo se ve:** `% Conversion: 12%` (debajo del nombre o junto a Net Deposits).
// * **Extra:** Muestra “X clicks → Y registros → Z depósitos”.

// #### 2. **Estado del contrato**

// * Si no tiene bóveda: botón llamativo **“Activar mi Vault”** con tooltip explicativo.
// * Si sí tiene: status verde tipo “✅ Vault Activo desde: \[fecha]”.

// #### 3. **ROI estimado o múltiplo**

// * `(Total Pay / Payment)` → muestra como `ROI: 2.0x` o `+100%`
// * Esto motiva porque visualiza el beneficio financiero.

// #### 4. **Ranking entre afiliados**

// * Muestra “Top 3 sub-afiliados” con más depósitos o más comisiones generadas.
// * Puede ser visual tipo medallas 🥇🥈🥉.

// ---

// ### 🛠️ FUNCIONALIDADES NUEVAS ÚTILES

// #### 5. **Botón “Asignar presupuesto” personalizado**

// * En vez de solo depositar, permite asignar manualmente cuánto se desea liberar a cada subafiliado.
// * Opción avanzada: activar pagos automáticos por rendimiento.

// #### 6. **Gráfica de rendimiento**

// * Mini gráfica tipo sparklines 📈 junto a cada nombre.
// * Puede mostrar depósitos diarios o crecimiento de red.

// #### 7. **Notas o etiquetas internas por subafiliado**

// * El admin puede dejar tags o notas rápidas tipo:

//   * `🔥 Buen conversor`
//   * `🛑 Revisar calidad`
//   * `🌱 Nuevo`

// #### 8. **Historial de pagos**

// * Botón tipo “Ver historial” en cada fila, abre un modal con detalles: fecha, monto, acción.

// ---

// ### 🎨 UX/UI DETALLES VISUALES

// #### 9. **Indicadores de color por desempeño**

// * Usa **verde, naranja, rojo** en valores clave:

//   * Verde si Net Deposit > \$100
//   * Naranja si está entre \$10-\$99
//   * Rojo si es \$0

// #### 10. **Componente de progreso de meta**

// * Ejemplo: “Meta de \$1,000 en depósitos mensuales → 70% alcanzado” con barra de progreso.

// ---

// ### 💬 COPYWRITING ESTRATÉGICO

// * **Vault Control Panel** → “💼 Control de Fondos”
// * **Deposit** → “Inyectar Capital” o “Asignar Presupuesto”
// * **Subs Link** → “🔗 Tu Enlace de Invitación”

// ---

// ### 💡 BONUS: GAMIFICACIÓN

// * Agrega una **misión semanal**:

//   * “Consigue 5 registros nuevos esta semana y desbloquea \$20 extra”.
//   * Progreso visual → `🎯 Misión: 3/5 completados`.

// ---


export default function SubAffiliatesTable({ affiliates }) {
  console.log('???????????',affiliates)
  const [expandedId, setExpandedId] = useState(null);
  const [hasVault, setHasVault] = useState(false);
  const { currentAccount } = useBlockchainContext();

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const checkVaultStatus = async () => {
    if (!currentAccount) return;
    const contract = new ContractVaultFactory();
    await contract.load();
    const vaultAddress = await contract.getVaultAddress();
    setHasVault(!!vaultAddress);
  };

  useEffect(() => {
    checkVaultStatus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount]);

  if (affiliates.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-2xl p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">You don’t have any sub-affiliates yet</h2>
        <p className="text-gray-600 mb-6">Share your link to invite people and start earning commissions</p>
        {!hasVault && (
          <p className="text-red-600 font-medium mb-4">You must activate your Vault before getting started</p>
        )}
        <button
          disabled={!hasVault}
          className={`px-4 py-2 rounded-md font-medium ${
            hasVault
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          Invite your first affiliate
        </button>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      {affiliates.map((affiliate) => (
        <SingleSubAffilliate
          key={affiliate.id}
          expandedId={expandedId}
          toggleExpand={toggleExpand}
          affiliate={affiliate}
        />
      ))}
    </div>
  );
}
