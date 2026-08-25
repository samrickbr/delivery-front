import { useState } from "react";
import { liberarEntrega } from "../../services/pedidoService";

function ChecklistSeparacao({ pedido, onAtualizar }) {
    const itensChecklist = [
        ...pedido.itens
            .filter((item) => item.statusOperacao !== "CANCELADO")
            .map((item) => ({
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

    const todosMarcados = itensChecklist.length > 0 && itensChecklist.every((item) => checks[item.id]);

    async function liberar() {
        const itensSeparados = pedido.itens.map((item) => ({
            itemId: item.id,
            separado: item.statusOperacao !== "CANCELADO" ? checks[`produto-${item.id}`] || false : false
        }));

        await liberarEntrega(pedido.id, itensSeparados);

        onAtualizar();
    }

    const retirada = pedido.tipoRecebimento?.toUpperCase() === "RETIRADA";

    const textoLiberacao = retirada ? "🛍️ Liberar para retirada" : "🚚 Liberar para entrega";

    return (
        <>
            <h5>Checklist</h5>

            <div className="mb-3">
                {pedido.itens.map((item) => (
                    <div
                        key={item.id}
                        className="d-flex justify-content-between align-items-center border rounded p-2 mb-2"
                    >
                        <div>
                            <strong>
                                {item.quantidade}x {item.produto}
                            </strong>

                            <div className="small text-muted">{item.categoria}</div>
                        </div>

                        {item.statusOperacao === "CANCELADO" ? (
                            <span className="badge bg-danger">❌ CANCELADO</span>
                        ) : (
                            <input
                                type="checkbox"
                                className="form-check-input fs-5"
                                checked={checks[`produto-${item.id}`] || false}
                                onChange={() => alternar(`produto-${item.id}`)}
                            />
                        )}
                    </div>
                ))}

                <hr />

                {["guardanapo", "molho", "copo"].map((item) => (
                    <div
                        key={item}
                        className="d-flex justify-content-between align-items-center border rounded p-2 mb-2"
                    >
                        <strong style={{ textTransform: "capitalize" }}>{item}</strong>

                        <input
                            type="checkbox"
                            className="form-check-input fs-5"
                            checked={checks[item] || false}
                            onChange={() => alternar(item)}
                        />
                    </div>
                ))}
            </div>

            <button className="btn btn-success w-100" disabled={!todosMarcados} onClick={liberar}>
                {textoLiberacao}
            </button>
        </>
    );
}

export default ChecklistSeparacao;
