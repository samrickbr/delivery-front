import { useState } from "react";
import { cancelarItens, cancelarPedidoCompleto } from "../../services/pedidoService";

function CancelarItensModal({ pedido, setor, mostrar, onFechar, onAtualizar, permitirCompleto = false }) {
    const [tipo, setTipo] = useState("ITEM");
    const [itensSelecionados, setItensSelecionados] = useState([]);
    const [motivo, setMotivo] = useState("");

    if (!mostrar) {
        return null;
    }

    function selecionarItem(id) {
        setItensSelecionados((lista) => {
            if (lista.includes(id)) {
                return lista.filter((item) => item !== id);
            }

            return [...lista, id];
        });
    }

    async function confirmar() {
        if (!motivo) {
            return;
        }

        if (tipo === "COMPLETO") {
            await cancelarPedidoCompleto(pedido.id, setor, motivo);
        } else {
            await cancelarItens(pedido.id, setor, itensSelecionados, motivo);
        }

        setMotivo("");
        setItensSelecionados([]);
        onFechar();
        onAtualizar();
    }

    return (
        <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5>Cancelar Pedido #{pedido.id}</h5>
                    </div>

                    <div className="modal-body">
                        {permitirCompleto && (
                            <div className="mb-3">
                                <button
                                    className={
                                        tipo === "ITEM" ? "btn btn-primary me-2" : "btn btn-outline-primary me-2"
                                    }
                                    onClick={() => setTipo("ITEM")}
                                >
                                    Cancelar itens
                                </button>

                                <button
                                    className={tipo === "COMPLETO" ? "btn btn-danger" : "btn btn-outline-danger"}
                                    onClick={() => setTipo("COMPLETO")}
                                >
                                    Cancelar pedido
                                </button>
                            </div>
                        )}

                        {tipo === "ITEM" && (
                            <>
                                <h6>Selecione os itens:</h6>

                                {pedido.itens
                                    .filter((item) => item.setor === setor || permitirCompleto)
                                    .map((item) => (
                                        <div key={item.id} className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={itensSelecionados.includes(item.id)}
                                                onChange={() => selecionarItem(item.id)}
                                            />

                                            <label className="form-check-label">
                                                {item.quantidade}x {item.produto}
                                            </label>
                                        </div>
                                    ))}
                            </>
                        )}

                        <textarea
                            className="form-control mt-3"

                            placeholder="Motivo do cancelamento"

                            value={motivo}

                            onChange={(e) => setMotivo(e.target.value)}
                        />
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onFechar}>
                            Voltar
                        </button>

                        <button
                            className="btn btn-danger"
                            disabled={!motivo || (tipo === "ITEM" && itensSelecionados.length === 0)}
                            onClick={confirmar}
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CancelarItensModal;
