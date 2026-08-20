import { useEffect, useState } from "react";
import PedidoCard from "../../components/pedido/PedidoCard";
import ChecklistSeparacao from "../../components/pedido/ChecklistSeparacao";

import {
    listarBalcao,
    aprovarPedido,
    cancelarItens,
    cancelarPedidoCompleto,
    conferirPedido
} from "../../services/pedidoService";

// =====================================
// ABAS DO BALCÃO
// =====================================

const ABAS = {
    PEDIDOS: "pedidos",
    PRODUCAO: "producao",
    ESPERA: "espera",
    CONFERENCIA: "conferencia",
    SEPARACAO: "separacao"
};

function Balcao() {
    const [pedidos, setPedidos] = useState([]);
    const [aba, setAba] = useState(ABAS.PEDIDOS);

    // CANCELAMENTO
    const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
    const [mostrarModalCancelamento, setMostrarModalCancelamento] = useState(false);
    const [tipoCancelamento, setTipoCancelamento] = useState("ITEM");
    const [itensCancelados, setItensCancelados] = useState([]);
    const [motivoCancelamento, setMotivoCancelamento] = useState("");

    // =====================================
    // CARREGA TODOS OS PEDIDOS DO BALCÃO
    // =====================================

    async function carregarPedidos() {
        const response = await listarBalcao();
        setPedidos(response.data);
    }

    // =====================================
    // FILTROS
    // =====================================

    const pedidosFiltrados = pedidos.filter((pedido) => {
        switch (aba) {
            case ABAS.PEDIDOS:
                return pedido.status === "RECEBIDO";

            case ABAS.PRODUCAO:
                return (
                    pedido.status === "APROVADO" &&
                    pedido.itens.some(
                        (item) => item.statusOperacao === "APROVADO" || item.statusOperacao === "EM_PRODUCAO"
                    )
                );

            case ABAS.ESPERA:
                return pedido.status === "APROVADO" && pedido.itens.some((item) => item.statusOperacao === "PENDENTE");

            case ABAS.CONFERENCIA:
                return pedido.status === "FINALIZADO";

            case ABAS.SEPARACAO:
                return pedido.status === "AGUARDANDO_SEPARACAO";

            default:
                return false;
        }
    });

    // =====================================
    // RECEBIDO -> APROVADO
    // =====================================

    async function aceitarPedido(id) {
        await aprovarPedido(id);
        await carregarPedidos();
    }

    // =====================================
    // CONFERÊNCIA
    // =====================================

    async function conferir(id) {
        await conferirPedido(id);
        await carregarPedidos();
    }

    // =====================================
    // CANCELAMENTO
    // =====================================

    function abrirCancelamento(pedido) {
        setPedidoSelecionado(pedido);
        setTipoCancelamento("ITEM");
        setItensCancelados([]);
        setMotivoCancelamento("");
        setMostrarModalCancelamento(true);
    }

    function selecionarItem(itemId) {
        setItensCancelados((lista) => {
            if (lista.includes(itemId)) {
                return lista.filter((id) => id !== itemId);
            }

            return [...lista, itemId];
        });
    }

    async function confirmarCancelamento() {
        if (!motivoCancelamento) {
            return;
        }

        if (tipoCancelamento === "COMPLETO") {
            await cancelarPedidoCompleto(pedidoSelecionado.id, motivoCancelamento);
        } else {
            await cancelarItens(pedidoSelecionado.id, "BALCAO", itensCancelados, motivoCancelamento);
        }

        setMostrarModalCancelamento(false);
        await carregarPedidos();
    }

    // =====================================
    // AUTO REFRESH
    // =====================================

    useEffect(() => {
        let ativo = true;

        async function inicializar() {
            if (ativo) {
                await carregarPedidos();
            }
        }

        inicializar();

        const intervalo = setInterval(() => {
            if (!document.hidden) {
                carregarPedidos();
            }
        }, 10000);

        return () => {
            ativo = false;
            clearInterval(intervalo);
        };
    }, []);

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Balcão</h1>

            <div className="mb-4">
                <button
                    className={`btn me-2 ${aba === ABAS.PEDIDOS ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setAba(ABAS.PEDIDOS)}
                >
                    📥 Pedidos
                </button>

                <button
                    className={`btn me-2 ${aba === ABAS.PRODUCAO ? "btn-warning" : "btn-outline-warning"}`}
                    onClick={() => setAba(ABAS.PRODUCAO)}
                >
                    👨‍🍳 Produção
                </button>

                <button
                    className={`btn me-2 ${aba === ABAS.CONFERENCIA ? "btn-info" : "btn-outline-info"}`}
                    onClick={() => setAba(ABAS.CONFERENCIA)}
                >
                    ✔ Conferência
                </button>

                <button
                    className={`btn ${aba === ABAS.SEPARACAO ? "btn-success" : "btn-outline-success"}`}
                    onClick={() => setAba(ABAS.SEPARACAO)}
                >
                    📦 Separação
                </button>
            </div>

            <div className="row">
                {pedidosFiltrados.map((pedido) => (
                    <div className="col-md-6" key={pedido.id}>
                        <PedidoCard pedido={pedido}>
                            {pedido.status === "RECEBIDO" && (
                                <>
                                    <button
                                        className="btn btn-success w-100 mb-2"
                                        onClick={() => aceitarPedido(pedido.id)}
                                    >
                                        ✅ Aceitar Pedido
                                    </button>

                                    <button className="btn btn-danger w-100" onClick={() => abrirCancelamento(pedido)}>
                                        ❌ Cancelar
                                    </button>
                                </>
                            )}

                            {aba === ABAS.CONFERENCIA && (
                                <button className="btn btn-success w-100" onClick={() => conferir(pedido.id)}>
                                    ✔ Confirmar Conferência
                                </button>
                            )}

                            {aba === ABAS.SEPARACAO && (
                                <ChecklistSeparacao pedido={pedido} onAtualizar={carregarPedidos} />
                            )}
                        </PedidoCard>
                    </div>
                ))}
            </div>

            {pedidosFiltrados.length === 0 && (
                <div className="text-center mt-5">
                    <h4>Nenhum pedido nesta etapa.</h4>
                </div>
            )}

            {mostrarModalCancelamento && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Cancelar Pedido #{pedidoSelecionado.id}</h5>
                            </div>

                            <div className="modal-body">
                                <div className="mb-3">
                                    <button
                                        className={`btn me-2 ${
                                            tipoCancelamento === "ITEM" ? "btn-primary" : "btn-outline-primary"
                                        }`}
                                        onClick={() => setTipoCancelamento("ITEM")}
                                    >
                                        Cancelar itens
                                    </button>

                                    <button
                                        className={`btn ${
                                            tipoCancelamento === "COMPLETO" ? "btn-danger" : "btn-outline-danger"
                                        }`}
                                        onClick={() => setTipoCancelamento("COMPLETO")}
                                    >
                                        Cancelar pedido
                                    </button>
                                </div>

                                {tipoCancelamento === "ITEM" && (
                                    <div>
                                        <h6>Selecione os itens:</h6>

                                        {pedidoSelecionado.itens.map((item) => (
                                            <div key={item.id} className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={itensCancelados.includes(item.id)}
                                                    onChange={() => selecionarItem(item.id)}
                                                />

                                                <label className="form-check-label">
                                                    {item.quantidade}x {item.produto} ({item.setor})
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <textarea
                                    className="form-control mt-3"
                                    placeholder="Motivo do cancelamento"
                                    value={motivoCancelamento}
                                    onChange={(e) => setMotivoCancelamento(e.target.value)}
                                />
                            </div>

                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setMostrarModalCancelamento(false);
                                        setPedidoSelecionado(null);
                                        setMotivoCancelamento("");
                                        setItensCancelados([]);
                                    }}
                                >
                                    Voltar
                                </button>

                                <button
                                    className="btn btn-danger"
                                    disabled={
                                        !motivoCancelamento ||
                                        (tipoCancelamento === "ITEM" && itensCancelados.length === 0)
                                    }
                                    onClick={confirmarCancelamento}
                                >
                                    Confirmar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Balcao;
