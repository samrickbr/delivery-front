import { useMemo, useState } from "react";
import { liberarEntrega } from "../../services/pedidoService";

const COMPLEMENTOS_SEPARACAO = [
    {
        id: "guardanapo",
        nome: "Guardanapos"
    },
    {
        id: "molho",
        nome: "Molhos"
    },
    {
        id: "copo",
        nome: "Copos"
    }
];

function ChecklistSeparacao({ pedido, checks = {}, onAtualizar }) {
    const [checksComplementos, setChecksComplementos] = useState({});

    function alternarComplemento(id) {
        setChecksComplementos((old) => ({
            ...old,
            [id]: !old[id]
        }));
    }

    const produtosValidos = useMemo(
        () => pedido.itens?.filter((item) => item.statusOperacao !== "CANCELADO") || [],
        [pedido.itens]
    );

    const produtosMarcados = produtosValidos.every((item) => checks[`produto-${item.id}`]);

    const complementosMarcados = COMPLEMENTOS_SEPARACAO.every((item) => checksComplementos[item.id]);

    const todosMarcados = produtosValidos.length > 0 && produtosMarcados && complementosMarcados;

    async function liberar() {
        const itensSeparados = (pedido.itens || []).map((item) => ({
            itemId: item.id,
            separado: item.statusOperacao !== "CANCELADO" ? checks[`produto-${item.id}`] || false : false
        }));

        await liberarEntrega(pedido.id, itensSeparados);

        onAtualizar();
    }

    const retirada = pedido.tipoRecebimento?.toUpperCase() === "RETIRADA";

    const textoLiberacao = retirada ? "🛍️ Liberar para retirada" : "🚚 Liberar para entrega";

    return (
        <div className="mt-3 border-top pt-3">
            <h6 className="fw-bold mb-2">Complementos</h6>

            <div className="d-flex flex-column gap-2 mb-3">
                {COMPLEMENTOS_SEPARACAO.map((item) => (
                    <label
                        key={item.id}
                        className="d-flex justify-content-between align-items-center border rounded p-2"
                        style={{
                            cursor: "pointer"
                        }}
                    >
                        <strong>{item.nome}</strong>

                        <input
                            type="checkbox"
                            className="form-check-input fs-5"
                            checked={checksComplementos[item.id] || false}
                            onChange={() => alternarComplemento(item.id)}
                        />
                    </label>
                ))}
            </div>

            <button className="btn btn-success w-100" disabled={!todosMarcados} onClick={liberar}>
                {textoLiberacao}
            </button>
        </div>
    );
}

export default ChecklistSeparacao;
