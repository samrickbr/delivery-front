import { useEffect, useState } from "react";
import { cancelarItens, cancelarPedidoCompleto } from "../../services/pedidoService";
import { obterNumeroPedido } from "../../utils/pedidoUtils";

function CancelarItensModal({
    pedido,
    setor,
    mostrar,
    onFechar,
    onAtualizar,
    onDigitando,
    permitirCompleto = false
}) {
    const [tipo, setTipo] = useState("ITEM");
    const [itensSelecionados, setItensSelecionados] = useState([]);
    const [motivo, setMotivo] = useState("");
    const [processando, setProcessando] = useState(false);

    useEffect(() => {
        onDigitando?.(mostrar);

        return () => {
            onDigitando?.(false);
        };
    }, [mostrar, onDigitando]);

    if (!mostrar) {
        return null;
    }

    const itensDisponiveis =
        pedido.itens?.filter(
            (item) => item.statusOperacao !== "CANCELADO" && (permitirCompleto || item.setor === setor)
        ) || [];

    function selecionarItem(id) {
        setItensSelecionados((lista) =>
            lista.includes(id) ? lista.filter((itemId) => itemId !== id) : [...lista, id]
        );
    }

    async function confirmar() {
        if (!motivo.trim() || processando) {
            return;
        }

        if (tipo === "ITEM" && itensSelecionados.length === 0) {
            return;
        }

        setProcessando(true);

        try {
            if (tipo === "COMPLETO") {
                await cancelarPedidoCompleto(pedido.id, motivo.trim());
            } else {
                await cancelarItens(pedido.id, setor, itensSelecionados, motivo.trim());
            }

            setMotivo("");
            setItensSelecionados([]);
            setTipo("ITEM");

            onFechar();
            await onAtualizar();
        } catch (error) {
            console.error(error);
            alert(error?.response?.data?.message || "Erro ao cancelar o pedido.");
        } finally {
            setProcessando(false);
        }
    }

    function fechar() {
        if (processando) {
            return;
        }

        setMotivo("");
        setItensSelecionados([]);
        setTipo("ITEM");
        onFechar();
    }

    return (
        <div className="modal show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Cancelar Pedido {obterNumeroPedido(pedido)}</h5>

                        <button type="button" className="btn-close" onClick={fechar} disabled={processando} />
                    </div>

                    <div className="modal-body">
                        {permitirCompleto && (
                            <div className="mb-3">
                                <button
                                    type="button"
                                    className={
                                        tipo === "ITEM" ? "btn btn-primary me-2" : "btn btn-outline-primary me-2"
                                    }
                                    onClick={() => {
                                        setTipo("ITEM");
                                        setItensSelecionados([]);
                                    }}
                                    disabled={processando}
                                >
                                    Cancelar itens
                                </button>

                                <button
                                    type="button"
                                    className={tipo === "COMPLETO" ? "btn btn-danger" : "btn btn-outline-danger"}
                                    onClick={() => {
                                        setTipo("COMPLETO");
                                        setItensSelecionados([]);
                                    }}
                                    disabled={processando}
                                >
                                    Cancelar pedido
                                </button>
                            </div>
                        )}

                        {tipo === "ITEM" && (
                            <>
                                <h6>Selecione os itens:</h6>

                                {itensDisponiveis.length === 0 ? (
                                    <div className="alert alert-secondary">
                                        Nenhum item disponível para cancelamento.
                                    </div>
                                ) : (
                                    itensDisponiveis.map((item) => (
                                        <div key={item.id} className="form-check mb-2">
                                            <input
                                                id={`cancelar-item-${item.id}`}
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={itensSelecionados.includes(item.id)}
                                                onChange={() => selecionarItem(item.id)}
                                                disabled={processando}
                                            />

                                            <label htmlFor={`cancelar-item-${item.id}`} className="form-check-label">
                                                {item.quantidade}x {item.produto}
                                            </label>
                                        </div>
                                    ))
                                )}
                            </>
                        )}

                        {tipo === "COMPLETO" && (
                            <div className="alert alert-danger">O pedido inteiro será cancelado.</div>
                        )}

                        <textarea
                            className="form-control mt-3"
                            rows="3"
                            placeholder="Motivo do cancelamento"
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                            disabled={processando}
                        />
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={fechar} disabled={processando}>
                            Voltar
                        </button>

                        <button
                            type="button"
                            className="btn btn-danger"
                            disabled={
                                processando || !motivo.trim() || (tipo === "ITEM" && itensSelecionados.length === 0)
                            }
                            onClick={confirmar}
                        >
                            {processando ? "Cancelando..." : "Confirmar"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CancelarItensModal;
