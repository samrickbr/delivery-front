import { useState } from "react";
import { separarPedido } from "../../services/pedidoService";
import { liberarEntrega } from "../../services/pedidoService";

function ChecklistSeparacao({ pedido, onAtualizar }) {
    // ===============================
    // MONTA CHECKLIST
    // ===============================

    const itens = [
        ...pedido.itens.map((item) => ({
            id: `produto-${item.id}`,
            nome: `${item.quantidade}x ${item.produto}`
        })),
        { id: "guardanapo", nome: "Guardanapos" },
        { id: "molho", nome: "Molhos" },
        { id: "copo", nome: "Copos" }
    ];

    const [checks, setChecks] = useState({});

    function alternar(id) {
        setChecks((old) => ({
            ...old,
            [id]: !old[id]
        }));
    }

    const todosMarcados = itens.length > 0 && itens.every((item) => checks[item.id]);

    async function liberar() {
        const itensSeparados = pedido.itens.map((item) => ({
            itemId: item.id,
            separado: checks[`produto-${item.id}`] || false
        }));

        console.log("ENVIANDO:", itensSeparados);

        await liberarEntrega(pedido.id, itensSeparados);

        onAtualizar();
    }

    return (
        <>
            <h5>Checklist</h5>

            <div className="mb-3">
                {itens.map((item) => (
                    <div className="form-check" key={item.id}>
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={checks[item.id] || false}
                            onChange={() => alternar(item.id)}
                        />

                        <label className="form-check-label">{item.nome}</label>
                    </div>
                ))}
            </div>

            <button className="btn btn-success w-100" disabled={!todosMarcados} onClick={liberar}>
                🚚 Liberar para entrega
            </button>
        </>
    );
}

export default ChecklistSeparacao;
