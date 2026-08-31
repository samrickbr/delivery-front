// ============================================================
// Componente visual para as abas do balcão.
// Mantém somente o comportamento de navegação entre estados
// do painel, sem misturar regras de negócio com renderização.
// ============================================================
import { ABAS } from "./balcaoAbas";

function BalcaoTabs({ aba, exibirAbas, onChange, totalRetiradas }) {
    if (!exibirAbas) {
        return null;
    }

    return (
        <div className="mb-4">
            <button
                className={`btn me-2 ${aba === ABAS.PEDIDOS ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => onChange(ABAS.PEDIDOS)}
            >
                📥 Pedidos
            </button>

            <button
                className={`btn me-2 ${aba === ABAS.CONFERENCIA ? "btn-info" : "btn-outline-info"}`}
                onClick={() => onChange(ABAS.CONFERENCIA)}
            >
                ✔ Conferência
            </button>

            <button
                className={`btn me-2 ${aba === ABAS.SEPARACAO ? "btn-success" : "btn-outline-success"}`}
                onClick={() => onChange(ABAS.SEPARACAO)}
            >
                📦 Separação
            </button>

            <button
                className={`btn ${aba === ABAS.RETIRADA ? "btn-warning" : "btn-outline-warning"}`}
                onClick={() => onChange(ABAS.RETIRADA)}
            >
                🛍️ Retirada ({totalRetiradas})
            </button>
        </div>
    );
}

export default BalcaoTabs;
