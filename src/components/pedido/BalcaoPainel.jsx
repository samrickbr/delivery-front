import { useEffect, useState } from "react";
import PedidoCard from "./PedidoCard";
import ChecklistSeparacao from "./ChecklistSeparacao";
import MiniPdvProdutos from "../../pages/minipdv/components/MiniPdvProdutos";

import {
    listarBalcao,
    listarRetirada,
    aprovarPedido,
    cancelarItens,
    cancelarPedidoCompleto,
    conferirPedido,
    entregarPedido,
    adicionarItemPedido,
    alterarQuantidadeItemPedido,
    removerItemPedido
} from "../../services/pedidoService";

import { ABAS } from "./balcaoAbas";

function BalcaoPainel({ aba: abaControlada, onAbaChange, exibirAbas = true }) {
    const [pedidos, setPedidos] = useState([]);
    const [retiradas, setRetiradas] = useState([]);
    const [abaInterna, setAbaInterna] = useState(ABAS.PEDIDOS);
    const aba = abaControlada ?? abaInterna;

    // =====================================
    // EDIÇÃO COMERCIAL
    // =====================================

    const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
    const [mostrarModalEdicao, setMostrarModalEdicao] = useState(false);
    const [erroEdicao, setErroEdicao] = useState("");

    function pedidoPodeSerEditado(pedido) {
        return !["FATURADO", "ENTREGUE", "CANCELADO"].includes(pedido?.status);
    }

    function abrirEdicao(pedido) {
        if (!pedidoPodeSerEditado(pedido)) {
            return;
        }

        setPedidoSelecionado(pedido);
        setErroEdicao("");
        setMostrarModalEdicao(true);
    }

    function fecharEdicao() {
        setMostrarModalEdicao(false);
        setPedidoSelecionado(null);
        setErroEdicao("");
    }

    async function recarregarPedido(pedidoId) {
        const response = await listarBalcao();
        const pedidosAtualizados = response.data || [];

        setPedidos(pedidosAtualizados);

        const pedidoAtualizado = pedidosAtualizados.find((pedido) => pedido.id === pedidoId);

        if (!pedidoAtualizado) {
            fecharEdicao();
            return null;
        }

        setPedidoSelecionado(pedidoAtualizado);

        return pedidoAtualizado;
    }

    async function adicionarItem(pedidoId, produtoId, quantidade = 1) {
        try {
            setErroEdicao("");

            await adicionarItemPedido(pedidoId, produtoId, quantidade);

            await recarregarPedido(pedidoId);
        } catch (error) {
            console.error("Erro ao adicionar item ao pedido.", error);

            setErroEdicao("Não foi possível adicionar o item ao pedido.");
        }
    }

    async function alterarQuantidade(pedidoId, itemId, quantidade) {
        try {
            setErroEdicao("");

            const novaQuantidade = Number(quantidade);

            if (!Number.isFinite(novaQuantidade)) {
                return;
            }

            if (novaQuantidade < 1) {
                await removerItemPedido(pedidoId, itemId);
            } else {
                await alterarQuantidadeItemPedido(pedidoId, itemId, novaQuantidade);
            }

            await recarregarPedido(pedidoId);
        } catch (error) {
            console.error("Erro ao alterar quantidade do item.", error);

            setErroEdicao("Não foi possível alterar a quantidade do item.");
        }
    }

    async function removerItem(pedidoId, itemId) {
        try {
            setErroEdicao("");

            await removerItemPedido(pedidoId, itemId);

            await recarregarPedido(pedidoId);
        } catch (error) {
            console.error("Erro ao remover item do pedido.", error);

            setErroEdicao("Não foi possível remover o item do pedido.");
        }
    }

    // =====================================
    // ABAS
    // =====================================

    function setAba(novaAba) {
        if (abaControlada === undefined) {
            setAbaInterna(novaAba);
        }

        onAbaChange?.(novaAba);
    }

    // =====================================
    // CANCELAMENTO
    // =====================================

    const [mostrarModalCancelamento, setMostrarModalCancelamento] = useState(false);

    const [tipoCancelamento, setTipoCancelamento] = useState("ITEM");

    const [itensCancelados, setItensCancelados] = useState([]);

    const [motivoCancelamento, setMotivoCancelamento] = useState("");

    // =====================================
    // CARREGA DADOS DO BALCÃO
    // =====================================

    async function carregarPedidos() {
        const response = await listarBalcao();
        setPedidos(response.data);
    }

    async function carregarRetiradas() {
        const response = await listarRetirada();
        setRetiradas(response.data);
    }

    async function carregarDados() {
        await Promise.all([carregarPedidos(), carregarRetiradas()]);
    }

    // =====================================
    // FILTROS DO BALCÃO
    // =====================================

    function possuiItemBalcaoDisponivel(pedido) {
        return pedido.itens?.some((item) => item.setor === "BALCAO" && item.statusOperacao !== "CANCELADO");
    }

    const pedidosFiltrados = pedidos.filter((pedido) => {
        if (!possuiItemBalcaoDisponivel(pedido)) {
            return false;
        }

        switch (aba) {
            case ABAS.PEDIDOS:
                return pedido.status === "RECEBIDO";

            case ABAS.CONFERENCIA:
                return pedido.status === "FINALIZADO";

            case ABAS.SEPARACAO:
                return pedido.status === "AGUARDANDO_SEPARACAO";

            default:
                return false;
        }
    });

    // =====================================
    // RETIRADAS
    // =====================================

    const retiradasFiltradas = retiradas.filter((pedido) => pedido.status === "SEPARADO");

    // =====================================
    // RECEBIDO -> APROVADO
    // =====================================

    async function aceitarPedido(id) {
        await aprovarPedido(id);
        await carregarDados();
    }

    // =====================================
    // CONFERÊNCIA
    // =====================================

    async function conferir(id) {
        await conferirPedido(id);
        await carregarDados();
    }

    // =====================================
    // CONCLUSÃO DA RETIRADA
    // =====================================

    async function concluirRetirada(id) {
        await entregarPedido(id);
        await carregarDados();
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
        setPedidoSelecionado(null);
        await carregarDados();
    }

    // =====================================
    // AUTO REFRESH
    // =====================================

    useEffect(() => {
        let ativo = true;

        async function carregar() {
            const [balcaoResponse, retiradaResponse] = await Promise.all([listarBalcao(), listarRetirada()]);

            if (!ativo) {
                return;
            }

            setPedidos(balcaoResponse.data);
            setRetiradas(retiradaResponse.data);
        }

        carregar();

        const intervalo = setInterval(() => {
            if (!document.hidden) {
                carregar();
            }
        }, 10000);

        return () => {
            ativo = false;
            clearInterval(intervalo);
        };
    }, []);

    return (
        <>
            {/* =====================================
                ABAS
            ===================================== */}

            {exibirAbas && (
                <div className="mb-4">
                    <button
                        className={`btn me-2 ${aba === ABAS.PEDIDOS ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setAba(ABAS.PEDIDOS)}
                    >
                        📥 Pedidos
                    </button>

                    <button
                        className={`btn me-2 ${aba === ABAS.CONFERENCIA ? "btn-info" : "btn-outline-info"}`}
                        onClick={() => setAba(ABAS.CONFERENCIA)}
                    >
                        ✔ Conferência
                    </button>

                    <button
                        className={`btn me-2 ${aba === ABAS.SEPARACAO ? "btn-success" : "btn-outline-success"}`}
                        onClick={() => setAba(ABAS.SEPARACAO)}
                    >
                        📦 Separação
                    </button>

                    <button
                        className={`btn ${aba === ABAS.RETIRADA ? "btn-warning" : "btn-outline-warning"}`}
                        onClick={() => setAba(ABAS.RETIRADA)}
                    >
                        🛍️ Retirada ({retiradasFiltradas.length})
                    </button>
                </div>
            )}

            {/* =====================================
                PEDIDOS DO BALCÃO
            ===================================== */}

            {aba !== ABAS.RETIRADA && (
                <div className="row">
                    {pedidosFiltrados.map((pedido) => (
                        <div className="col-md-6" key={pedido.id}>
                            <PedidoCard pedido={pedido}>
                                {pedidoPodeSerEditado(pedido) && (
                                    <button className="btn btn-primary w-100 mb-2" onClick={() => abrirEdicao(pedido)}>
                                        ✏️ Editar Pedido
                                    </button>
                                )}

                                {pedido.status === "RECEBIDO" && (
                                    <>
                                        <button
                                            className="btn btn-success w-100 mb-2"
                                            onClick={() => aceitarPedido(pedido.id)}
                                        >
                                            ✅ Aceitar Pedido
                                        </button>

                                        <button
                                            className="btn btn-danger w-100"
                                            onClick={() => abrirCancelamento(pedido)}
                                        >
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
                                    <ChecklistSeparacao pedido={pedido} onAtualizar={carregarDados} />
                                )}
                            </PedidoCard>
                        </div>
                    ))}
                </div>
            )}

            {/* =====================================
                RETIRADAS
            ===================================== */}

            {aba === ABAS.RETIRADA && (
                <div className="row">
                    {retiradasFiltradas.map((pedido) => (
                        <div className="col-md-6" key={pedido.id}>
                            <PedidoCard pedido={pedido} mostrarValor={true}>
                                <button className="btn btn-warning w-100" onClick={() => concluirRetirada(pedido.id)}>
                                    🛍️ Concluir retirada
                                </button>
                            </PedidoCard>
                        </div>
                    ))}
                </div>
            )}

            {/* =====================================
                VAZIO
            ===================================== */}

            {(aba === ABAS.RETIRADA ? retiradasFiltradas.length === 0 : pedidosFiltrados.length === 0) && (
                <div className="text-center mt-5">
                    <h4>Nenhum pedido nesta etapa.</h4>
                </div>
            )}

            {/* =====================================
                MODAL DE EDIÇÃO COMERCIAL
            ===================================== */}

            {mostrarModalEdicao && pedidoSelecionado && (
                <div
                    className="modal show d-block"
                    tabIndex="-1"
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.5)"
                    }}
                >
                    <div className="modal-dialog modal-xl modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <div>
                                    <h5 className="modal-title">
                                        Editar Pedido #{String(pedidoSelecionado.id).padStart(4, "0")}
                                    </h5>

                                    <small className="text-muted">Adicione, altere ou remova itens.</small>
                                </div>

                                <button type="button" className="btn-close" onClick={fecharEdicao} />
                            </div>

                            <div className="modal-body">
                                {erroEdicao && <div className="alert alert-danger">{erroEdicao}</div>}

                                <div className="row g-4">
                                    <div className="col-12 col-lg-6">
                                        <MiniPdvProdutos
                                            carrinho={[]}
                                            onAdicionarProduto={(produto) =>
                                                adicionarItem(pedidoSelecionado.id, produto.id, 1)
                                            }
                                        />
                                    </div>

                                    <div className="col-12 col-lg-6">
                                        <div className="card border-0 shadow-sm">
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <div>
                                                        <h6 className="fw-bold mb-0">Itens do pedido</h6>

                                                        <small className="text-muted">
                                                            Atualizados após cada operação
                                                        </small>
                                                    </div>

                                                    <strong>
                                                        R${" "}
                                                        {Number(pedidoSelecionado.valorTotal || 0).toLocaleString(
                                                            "pt-BR",
                                                            {
                                                                minimumFractionDigits: 2
                                                            }
                                                        )}
                                                    </strong>
                                                </div>

                                                {pedidoSelecionado.itens?.length === 0 ? (
                                                    <div className="alert alert-warning mb-0">
                                                        O pedido não possui itens.
                                                    </div>
                                                ) : (
                                                    <div className="list-group">
                                                        {pedidoSelecionado.itens.map((item) => (
                                                            <div key={item.id} className="list-group-item">
                                                                <div className="d-flex justify-content-between align-items-center gap-3">
                                                                    <div>
                                                                        <div className="fw-semibold">
                                                                            {item.produto}
                                                                        </div>

                                                                        <div className="small text-muted">
                                                                            {item.setor || "-"} · Item #{item.id}
                                                                        </div>
                                                                    </div>

                                                                    <div className="d-flex align-items-center gap-2">
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-outline-secondary"
                                                                            onClick={() =>
                                                                                alterarQuantidade(
                                                                                    pedidoSelecionado.id,
                                                                                    item.id,
                                                                                    Number(item.quantidade) - 1
                                                                                )
                                                                            }
                                                                        >
                                                                            −
                                                                        </button>

                                                                        <span
                                                                            className="fw-bold"
                                                                            style={{
                                                                                minWidth: "32px",
                                                                                textAlign: "center"
                                                                            }}
                                                                        >
                                                                            {item.quantidade}
                                                                        </span>

                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-outline-secondary"
                                                                            onClick={() =>
                                                                                alterarQuantidade(
                                                                                    pedidoSelecionado.id,
                                                                                    item.id,
                                                                                    Number(item.quantidade) + 1
                                                                                )
                                                                            }
                                                                        >
                                                                            +
                                                                        </button>

                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-outline-danger"
                                                                            onClick={() =>
                                                                                removerItem(
                                                                                    pedidoSelecionado.id,
                                                                                    item.id
                                                                                )
                                                                            }
                                                                        >
                                                                            🗑️
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={fecharEdicao}>
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* =====================================
                MODAL DE CANCELAMENTO
            ===================================== */}

            {mostrarModalCancelamento && pedidoSelecionado && (
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
        </>
    );
}

export default BalcaoPainel;
