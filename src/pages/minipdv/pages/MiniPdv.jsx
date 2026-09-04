import { useCallback, useEffect, useMemo, useState } from "react";

import MiniPdvProdutos from "../components/MiniPdvProdutos";
import MiniPdvCarrinho from "../components/MiniPdvCarrinho";
import MiniPdvCliente from "../components/MiniPdvCliente";
import MiniPdvEndereco from "../components/MiniPdvEndereco";
import MiniPdvPagamentoEtapa from "../components/MiniPdvPagamentoEtapa";
import MiniPdvAcoes from "../components/MiniPdvAcoes";

import useMiniPdv from "../hooks/useMiniPdv";
import useMiniPdvCarrinho from "../hooks/useMiniPdvCarrinho";
import useMiniPdvFormasPagamento from "../hooks/useMiniPdvFormasPagamento";
import useMiniPdvPagamentos from "../hooks/useMiniPdvPagamentos";
import useMiniPdvFluxo from "../hooks/useMiniPdvFluxo";
import useMiniPdvAtalhos from "../hooks/useMiniPdvAtalhos";
import useKeyboardAlert from "../../../hooks/useKeyboardAlert";

import KeyboardAlert from "../../../components/KeyboardAlert";

import BalcaoPainel from "../../../components/pedido/BalcaoPainel";
import { ABAS } from "../../../components/pedido/balcaoAbas";

import { buscarTaxaEntrega } from "../../../services/configuracaoService";
import {
    adicionarItemPedido,
    alterarQuantidadeItemPedido,
    removerItemPedido,
    aprovarPedido,
    criarPedidoOperacional,
    listarPedidosAbertos,
    buscarPedido
} from "../../../services/pedidoService";
import { buscarClientesOperacional } from "../../../services/clienteService";
import { obterNumeroPedido } from "../../../utils/pedidoUtils";

import {
    ABA_PDV,
    ETAPA_PAGAMENTO,
    ETAPA_VENDA,
    calcularValorVenda,
    filtrarItensEditaveis,
    montarPedidoOperacional
} from "../utils/miniPdvUtils";

function MiniPdv() {
    const [aba, setAba] = useState(ABA_PDV);

    const [taxaEntregaConfigurada, setTaxaEntregaConfigurada] = useState(null);
    const [carregandoTaxaEntrega, setCarregandoTaxaEntrega] = useState(false);
    const [erroTaxaEntrega, setErroTaxaEntrega] = useState("");

    const [mostrarRecuperacao, setMostrarRecuperacao] = useState(false);
    const [pedidosAbertos, setPedidosAbertos] = useState([]);
    const [carregandoRecuperacao, setCarregandoRecuperacao] = useState(false);
    const [erroRecuperacao, setErroRecuperacao] = useState("");
    const [filtroRecuperacao, setFiltroRecuperacao] = useState("");
    const [tipoFiltroRecuperacao, setTipoFiltroRecuperacao] = useState("TODOS");
    const [pedidoSelecionadoRecuperacao, setPedidoSelecionadoRecuperacao] = useState(0);

    const [clientesRecuperacao, setClientesRecuperacao] = useState([]);
    const [focoProdutoSolicitado, setFocoProdutoSolicitado] = useState(0);
    const [enviandoParaProducao, setEnviandoParaProducao] = useState(false);

    const {
        pedidoId,
        cliente,
        endereco,
        enderecos,
        tipoRecebimento,
        carregando,
        carregandoEnderecos,
        erro,
        erroEnderecos,
        podeFinalizar,
        selecionarCliente,
        selecionarEndereco,
        definirEntrega,
        definirRetirada,
        carregarPedido,
        limparVenda
    } = useMiniPdv();

    useEffect(() => {
        if (tipoRecebimento !== "ENTREGA") {
            return undefined;
        }

        let ativo = true;

        async function carregarTaxaEntrega() {
            setCarregandoTaxaEntrega(true);
            setErroTaxaEntrega("");

            try {
                const response = await buscarTaxaEntrega();

                if (!ativo) {
                    return;
                }

                setTaxaEntregaConfigurada(Number(response?.data ?? 0));
            } catch (error) {
                if (!ativo) {
                    return;
                }

                console.error("Erro ao consultar taxa de entrega do MiniPDV.", error);

                setTaxaEntregaConfigurada(null);
                setErroTaxaEntrega("Não foi possível consultar a taxa de entrega.");
            } finally {
                if (ativo) {
                    setCarregandoTaxaEntrega(false);
                }
            }
        }

        carregarTaxaEntrega();

        return () => {
            ativo = false;
        };
    }, [tipoRecebimento]);

    useEffect(() => {
        if (!mostrarRecuperacao || !filtroRecuperacao.trim()) {
            return undefined;
        }

        let ativo = true;

        const timeoutId = setTimeout(async () => {
            try {
                const resultado = await buscarClientesOperacional(filtroRecuperacao.trim());

                if (!ativo) {
                    return;
                }

                const lista = Array.isArray(resultado) ? resultado : resultado?.content || [];

                setClientesRecuperacao(lista);
            } catch (error) {
                if (!ativo) {
                    return;
                }

                console.error("Erro ao buscar clientes para recuperação de pedido.", error);

                setClientesRecuperacao([]);
            }
        }, 300);

        return () => {
            ativo = false;
            clearTimeout(timeoutId);
        };
    }, [mostrarRecuperacao, filtroRecuperacao]);

    const {
        carrinho,
        valorProdutos,
        adicionarProduto,
        diminuirProduto,
        removerProduto,
        carregarCarrinho,
        limparCarrinho
    } = useMiniPdvCarrinho();

    const {
        formasPagamento,
        carregando: carregandoFormasPagamento,
        erro: erroFormasPagamento
    } = useMiniPdvFormasPagamento();

    const taxaEntrega = tipoRecebimento === "ENTREGA" ? (taxaEntregaConfigurada ?? null) : 0;

    const valorVenda = calcularValorVenda({
        valorProdutos,
        tipoRecebimento,
        taxaEntrega: taxaEntrega ?? 0
    });

    const {
        pagamentos,
        totalPagamentos,
        restante,
        troco,
        valorRecebimento,
        adicionarPagamentoPorAtalho,
        alterarPagamento,
        removerPagamento,
        carregarPagamentos,
        limparPagamentos,
        definirValorRecebimento
    } = useMiniPdvPagamentos(valorVenda, formasPagamento);

    const { alertState, showAlert, closeAlert } = useKeyboardAlert();

    const {
        etapa,
        setEtapa,
        trocoFinal,
        setTrocoFinal,
        finalizarVenda,
        confirmarPagamento,
        voltarParaVenda,
        limparNovaVenda
    } = useMiniPdvFluxo({
        pedidoId,
        cliente,
        endereco,
        tipoRecebimento,
        taxaEntrega,
        carrinho,
        valorProdutos,
        valorVenda,
        pagamentos,
        totalPagamentos,
        limparVenda,
        limparCarrinho,
        limparPagamentos,
        podeFinalizar,
        showAlert
    });

    const solicitarLimpezaVenda = useCallback(() => {
        if (!carrinho.length) {
            limparNovaVenda();
            return;
        }

        const confirmar = window.confirm("Deseja realmente cancelar e limpar a venda atual?");

        if (!confirmar) {
            return;
        }

        limparNovaVenda();
    }, [carrinho.length, limparNovaVenda]);

    const abrirRecuperacao = useCallback(async () => {
        if (carregandoRecuperacao) {
            return;
        }

        if (carrinho.length) {
            const confirmar = window.confirm(
                "Existe uma venda em atendimento. Deseja abandoná-la e recuperar outro pedido?"
            );

            if (!confirmar) {
                return;
            }

            limparNovaVenda();
        }

        setMostrarRecuperacao(true);
        setPedidosAbertos([]);
        setErroRecuperacao("");
        setFiltroRecuperacao("");
        setTipoFiltroRecuperacao("TODOS");
        setPedidoSelecionadoRecuperacao(0);
        setCarregandoRecuperacao(true);

        try {
            const response = await listarPedidosAbertos();

            setPedidosAbertos(Array.isArray(response?.data) ? response.data : []);
        } catch (error) {
            console.error("Erro ao listar pedidos abertos para recuperação.", error);

            setErroRecuperacao(error?.response?.data?.message || "Não foi possível consultar os pedidos abertos.");
        } finally {
            setCarregandoRecuperacao(false);
        }
    }, [carregandoRecuperacao, carrinho.length, limparNovaVenda]);

    const fecharRecuperacao = useCallback(() => {
        if (carregandoRecuperacao) {
            return;
        }

        setMostrarRecuperacao(false);
        setPedidosAbertos([]);
        setErroRecuperacao("");
        setFiltroRecuperacao("");
        setTipoFiltroRecuperacao("TODOS");
        setPedidoSelecionadoRecuperacao(0);
    }, [carregandoRecuperacao]);

    const recuperarPedido = useCallback(
        async (pedido) => {
            if (!pedido) {
                return;
            }

            let pedidoParaRecuperar = pedido;

            try {
                const response = await buscarPedido(pedido.id);

                if (response.data) {
                    pedidoParaRecuperar = response.data;
                }
            } catch (error) {
                console.error("Erro ao carregar detalhes do pedido para edição.", error);
            }

            const itensNormalizados = filtrarItensEditaveis(pedidoParaRecuperar.itens)
                .map((item) => ({
                    ...item,
                    id: item.id ?? item.produtoId ?? item.coreItemId,
                    itemPedidoId: item.id,
                    coreItemId: item.coreItemId,
                    produtoId: item.produtoId,
                    nome: item.produto || `Produto #${item.produtoId}`,
                    preco: Number(item.valorUnitario || 0),
                    quantidade: Number(item.quantidade || 0)
                }))
                .filter((item) => item.id && item.produtoId && item.quantidade > 0);

            const clienteRecuperado =
                clientesRecuperacao.find((item) => Number(item.id) === Number(pedidoParaRecuperar.clienteId)) || null;

            carregarPedido(pedidoParaRecuperar, clienteRecuperado);

            carregarCarrinho(itensNormalizados);
            carregarPagamentos(pedidoParaRecuperar.pagamentos || []);
            setFocoProdutoSolicitado((atual) => atual + 1);

            setEtapa(ETAPA_VENDA);
            setAba(ABA_PDV);

            setMostrarRecuperacao(false);
            setPedidosAbertos([]);
            setClientesRecuperacao([]);
            setErroRecuperacao("");
            setFiltroRecuperacao("");
            setTipoFiltroRecuperacao("TODOS");
            setPedidoSelecionadoRecuperacao(0);
        },
        [clientesRecuperacao, carregarPedido, carregarCarrinho, carregarPagamentos, setEtapa]
    );

    const pedidosFiltrados = useMemo(() => {
        const termo = filtroRecuperacao.trim().toLowerCase();

        const clientesEncontrados = new Set(clientesRecuperacao.map((item) => Number(item.id)));

        return pedidosAbertos.filter((pedido) => {
            if (tipoFiltroRecuperacao !== "TODOS" && pedido.tipoRecebimento !== tipoFiltroRecuperacao) {
                return false;
            }

            if (!termo) {
                return true;
            }

            const numero = String(pedido.numero || "").toLowerCase();

            const nomeCliente = String(pedido.cliente || "").toLowerCase();

            const whatsapp = String(pedido.clienteWhatsapp || "").toLowerCase();

            const clienteEncontrado = pedido.clienteId != null && clientesEncontrados.has(Number(pedido.clienteId));

            return (
                numero.includes(termo) || nomeCliente.includes(termo) || whatsapp.includes(termo) || clienteEncontrado
            );
        });
    }, [pedidosAbertos, filtroRecuperacao, tipoFiltroRecuperacao, clientesRecuperacao]);

    useEffect(() => {
        if (!mostrarRecuperacao || carregandoRecuperacao) {
            return undefined;
        }

        function tratarTeclado(event) {
            if (event.key === "ArrowDown") {
                event.preventDefault();

                setPedidoSelecionadoRecuperacao((indiceAtual) =>
                    pedidosFiltrados.length ? (indiceAtual + 1) % pedidosFiltrados.length : 0
                );

                return;
            }

            if (event.key === "ArrowUp") {
                event.preventDefault();

                setPedidoSelecionadoRecuperacao((indiceAtual) =>
                    pedidosFiltrados.length ? (indiceAtual - 1 + pedidosFiltrados.length) % pedidosFiltrados.length : 0
                );

                return;
            }

            if (event.key === "Enter") {
                event.preventDefault();

                if (pedidosFiltrados.length) {
                    recuperarPedido(pedidosFiltrados[pedidoSelecionadoRecuperacao]);
                }

                return;
            }

            if (event.key === "Escape") {
                event.preventDefault();

                if (filtroRecuperacao) {
                    setFiltroRecuperacao("");
                    setPedidoSelecionadoRecuperacao(0);
                    return;
                }

                fecharRecuperacao();
            }
        }

        window.addEventListener("keydown", tratarTeclado);

        return () => window.removeEventListener("keydown", tratarTeclado);
    }, [
        mostrarRecuperacao,
        carregandoRecuperacao,
        pedidosFiltrados,
        pedidoSelecionadoRecuperacao,
        filtroRecuperacao,
        recuperarPedido,
        fecharRecuperacao
    ]);

    async function enviarParaBalcao() {
        if (!carrinho.length) {
            return;
        }

        if (enviandoParaProducao) {
            return;
        }

        setEnviandoParaProducao(true);

        try {
            if (pedidoId) {
                await aprovarPedido(pedidoId);
            } else {
                const pedido = montarPedidoOperacional({
                    cliente,
                    endereco,
                    tipoRecebimento,
                    carrinho,
                    pagamentos: [],
                    valorVenda
                });
                const response = await criarPedidoOperacional(pedido);
                const novoPedidoId = response.data?.id;

                if (!novoPedidoId) {
                    throw new Error("O pedido criado não retornou um identificador.");
                }

                await aprovarPedido(novoPedidoId);
            }

            limparNovaVenda();
            showAlert("Pedido enviado para produção.");
        } catch (error) {
            console.error("Erro ao enviar pedido para produção.", error);

            showAlert(error?.response?.data?.message || "Não foi possível enviar o pedido para produção.");
        } finally {
            setEnviandoParaProducao(false);
        }
    }

    useMiniPdvAtalhos({
        aba,
        etapa,
        alertOpen: alertState.open,
        trocoFinal,
        onFinalizarVenda: finalizarVenda,
        onEnviarBalcao: enviarParaBalcao,
        onRecuperarVenda: abrirRecuperacao,
        onLimparNovaVenda: solicitarLimpezaVenda,
        onVoltarParaVenda: voltarParaVenda,
        onFecharAlerta: closeAlert,
        onFecharTrocoModal: () => setTrocoFinal(0)
    });

    const novaVenda = aba === ABA_PDV;

    const podeFinalizarVenda =
        podeFinalizar &&
        carrinho.length > 0 &&
        !(tipoRecebimento === "ENTREGA" && (taxaEntrega === null || carregandoTaxaEntrega));

    if (novaVenda && etapa === ETAPA_PAGAMENTO) {
        return (
            <>
                <MiniPdvPagamentoEtapa
                    valorProdutos={valorProdutos}
                    taxaEntrega={taxaEntrega}
                    tipoRecebimento={tipoRecebimento}
                    valorVenda={valorVenda}
                    pagamentos={pagamentos}
                    totalPagamentos={totalPagamentos}
                    restante={restante}
                    troco={troco}
                    valorRecebimento={valorRecebimento}
                    definirValorRecebimento={definirValorRecebimento}
                    adicionarPagamentoPorAtalho={adicionarPagamentoPorAtalho}
                    alterarPagamento={alterarPagamento}
                    removerPagamento={removerPagamento}
                    onConfirmar={confirmarPagamento}
                    onVoltar={voltarParaVenda}
                    carregando={carregando || carregandoFormasPagamento}
                />

                <KeyboardAlert open={alertState.open} message={alertState.message} onClose={closeAlert} />
            </>
        );
    }

    async function adicionarProdutoPdv(produto) {
        if (!pedidoId) {
            adicionarProduto(produto);
            return;
        }

        try {
            const itemExistente = carrinho.find((item) => Number(item.produtoId) === Number(produto.id));

            let response;

            if (itemExistente) {
                response = await alterarQuantidadeItemPedido(
                    pedidoId,
                    itemExistente.itemPedidoId,
                    Number(itemExistente.quantidade || 0) + 1
                );
            } else {
                response = await adicionarItemPedido(pedidoId, produto.id, 1);
            }

            const pedidoAtualizado = response.data;

            if (pedidoAtualizado?.itens) {
                carregarCarrinho(
                    filtrarItensEditaveis(pedidoAtualizado.itens).map((item) => ({
                        ...item,
                        id: item.id,
                        itemPedidoId: item.id,
                        coreItemId: item.coreItemId,
                        produtoId: item.produtoId,
                        nome: item.produto || `Produto #${item.produtoId}`,
                        preco: Number(item.valorUnitario || 0),
                        quantidade: Number(item.quantidade || 0)
                    }))
                );
            }
        } catch (error) {
            console.error("Erro ao adicionar produto ao pedido recuperado.", error);

            showAlert(error?.response?.data?.message || "Não foi possível adicionar o produto.");
        }
    }

    async function diminuirProdutoPdv(produto) {
        if (!pedidoId) {
            diminuirProduto(produto);
            return;
        }

        const quantidadeAtual = Number(produto.quantidade || 0);

        if (quantidadeAtual <= 1) {
            await removerProdutoPdv(produto.id);
            return;
        }

        try {
            const response = await alterarQuantidadeItemPedido(pedidoId, produto.itemPedidoId, quantidadeAtual - 1);

            const pedidoAtualizado = response.data;

            if (pedidoAtualizado?.itens) {
                carregarCarrinho(
                    filtrarItensEditaveis(pedidoAtualizado.itens).map((item) => ({
                        ...item,
                        id: item.id,
                        itemPedidoId: item.id,
                        coreItemId: item.coreItemId,
                        produtoId: item.produtoId,
                        nome: item.produto || `Produto #${item.produtoId}`,
                        preco: Number(item.valorUnitario || 0),
                        quantidade: Number(item.quantidade || 0)
                    }))
                );
            }
        } catch (error) {
            console.error("Erro ao diminuir produto do pedido recuperado.", error);

            showAlert(error?.response?.data?.message || "Não foi possível alterar a quantidade.");
        }
    }

    async function removerProdutoPdv(produtoId) {
        if (!pedidoId) {
            removerProduto(produtoId);
            return;
        }

        const item = carrinho.find((produto) => produto.id === produtoId);

        if (!item?.itemPedidoId) {
            showAlert("Não foi possível identificar o item do pedido.");
            return;
        }

        try {
            await removerItemPedido(pedidoId, item.itemPedidoId);

            const novoCarrinho = carrinho.filter((produto) => produto.id !== produtoId);

            carregarCarrinho(novoCarrinho);
        } catch (error) {
            console.error("Erro ao remover produto do pedido recuperado.", error);

            showAlert(error?.response?.data?.message || "Não foi possível remover o produto.");
        }
    }

    return (
        <>
            <div
                className="container-fluid py-3 d-flex flex-column"
                style={{
                    height: "calc(100vh - 88px)",
                    minHeight: 0,
                    overflow: "hidden"
                }}
            >
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                        <h1 className="h4 mb-0">SIGIN — Mini PDV</h1>

                        <small className="text-muted">Centro Operacional</small>
                    </div>

                    {novaVenda && (
                        <span className="badge text-bg-secondary">
                            {pedidoId ? `Pedido ${pedidoId} em atendimento` : "Venda em atendimento"}
                        </span>
                    )}
                </div>

                {novaVenda && (
                    <div className="d-flex flex-wrap align-items-center gap-2 small text-muted mb-3">
                        <span className="fw-semibold">Atalhos:</span>
                        <span>
                            <kbd>F2</kbd> Finalizar
                        </span>
                        <span>
                            <kbd>F3</kbd> Recuperar
                        </span>
                        <span>
                            <kbd>F4</kbd> Limpar
                        </span>
                        <span>
                            <kbd>F5</kbd> Enviar para produção
                        </span>
                    </div>
                )}

                <div className="mb-4">
                    <button
                        type="button"
                        className={`btn me-2 ${novaVenda ? "btn-dark" : "btn-outline-dark"}`}
                        onClick={() => {
                            setAba(ABA_PDV);
                            setEtapa(ETAPA_VENDA);
                        }}
                    >
                        PDV
                    </button>

                    <button
                        type="button"
                        className={`btn me-2 ${aba === ABAS.PEDIDOS ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setAba(ABAS.PEDIDOS)}
                    >
                        📥 Pedidos
                    </button>

                    <button
                        type="button"
                        className={`btn me-2 ${aba === ABAS.CONFERENCIA ? "btn-info" : "btn-outline-info"}`}
                        onClick={() => setAba(ABAS.CONFERENCIA)}
                    >
                        ✔ Conferência
                    </button>

                    <button
                        type="button"
                        className={`btn me-2 ${aba === ABAS.SEPARACAO ? "btn-success" : "btn-outline-success"}`}
                        onClick={() => setAba(ABAS.SEPARACAO)}
                    >
                        📦 Separação
                    </button>

                    <button
                        type="button"
                        className={`btn ${aba === ABAS.RETIRADA ? "btn-warning" : "btn-outline-warning"}`}
                        onClick={() => setAba(ABAS.RETIRADA)}
                    >
                        🛍️ Retirada
                    </button>
                </div>

                {erro && novaVenda && <div className="alert alert-danger py-2">{erro}</div>}

                {novaVenda ? (
                    <div className="row g-3 flex-grow-1" style={{ minHeight: 0, overflow: "hidden" }}>
                        <div className="col-12 col-lg-5 col-xl-4 h-100" style={{ minHeight: 0 }}>
                            <div className="d-flex flex-column gap-3 h-100">
                                <MiniPdvProdutos
                                    carrinho={carrinho}
                                    onAdicionarProduto={adicionarProdutoPdv}
                                    onDiminuirProduto={diminuirProduto}
                                    onRemoverProduto={removerProdutoPdv}
                                    focoSolicitado={focoProdutoSolicitado}
                                />

                                <MiniPdvCliente
                                    cliente={cliente}
                                    onClienteSelecionado={selecionarCliente}
                                    onClienteLimpo={() => selecionarCliente(null)}
                                    onDefinirEntrega={definirEntrega}
                                    onDefinirRetirada={definirRetirada}
                                />

                                {tipoRecebimento === "ENTREGA" && (
                                    <MiniPdvEndereco
                                        cliente={cliente}
                                        enderecos={enderecos}
                                        endereco={endereco}
                                        carregando={carregandoEnderecos}
                                        erro={erroEnderecos}
                                        onEnderecoSelecionado={selecionarEndereco}
                                        onCadastrarEndereco={() => {}}
                                    />
                                )}

                                {tipoRecebimento === "ENTREGA" && erroTaxaEntrega && (
                                    <div className="alert alert-warning py-2 mb-0">{erroTaxaEntrega}</div>
                                )}

                                {erroFormasPagamento && (
                                    <div className="alert alert-danger py-2 mb-0">{erroFormasPagamento}</div>
                                )}

                                {carregandoFormasPagamento && (
                                    <div className="text-muted small">Carregando formas de pagamento...</div>
                                )}

                                <MiniPdvAcoes
                                    podeFinalizar={podeFinalizarVenda}
                                    carregando={carregando || carregandoRecuperacao || enviandoParaProducao}
                                    onFinalizar={finalizarVenda}
                                    onEnviarBalcao={enviarParaBalcao}
                                    onRecuperar={abrirRecuperacao}
                                    onLimpar={solicitarLimpezaVenda}
                                />
                            </div>
                        </div>

                        <div className="col-12 col-lg-7 col-xl-8">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body d-flex flex-column p-0">
                                    <div className="p-3 border-bottom">
                                        <h2 className="h5 mb-0">Venda</h2>

                                        <small className="text-muted">
                                            {pedidoId ? `Pedido ${pedidoId} em atendimento` : "Itens da venda atual"}
                                        </small>
                                    </div>

                                    <div
                                        className="flex-grow-1"
                                        style={{
                                            minHeight: 0,
                                            overflowY: "auto"
                                        }}
                                    >
                                        <MiniPdvCarrinho
                                            carrinho={carrinho}
                                            valorProdutos={valorProdutos}
                                            onAdicionarProduto={adicionarProdutoPdv}
                                            onDiminuirProduto={diminuirProdutoPdv}
                                            onRemoverProduto={removerProdutoPdv}
                                            onLimparCarrinho={limparCarrinho}
                                        />
                                    </div>

                                    <div className="border-top p-4">
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Produtos</span>

                                            <strong>R$ {Number(valorProdutos).toFixed(2)}</strong>
                                        </div>

                                        {tipoRecebimento === "ENTREGA" && (
                                            <div className="d-flex justify-content-between mb-2">
                                                <span>Taxa de entrega</span>

                                                <strong>
                                                    {taxaEntrega === null
                                                        ? "Calculando..."
                                                        : `R$ ${Number(taxaEntrega).toFixed(2)}`}
                                                </strong>
                                            </div>
                                        )}

                                        <div className="d-flex align-items-center justify-content-between border-top pt-3">
                                            <span className="fs-5 fw-semibold">Total</span>

                                            <strong className="fs-2">R$ {Number(valorVenda).toFixed(2)}</strong>
                                        </div>

                                        {cliente && (
                                            <div className="text-muted small mt-2">
                                                Cliente: {cliente.nome || cliente.nomeCompleto || cliente}
                                            </div>
                                        )}

                                        {tipoRecebimento === "ENTREGA" && endereco && (
                                            <div className="text-muted small mt-1">
                                                Entrega para {endereco.logradouro || endereco.rua}
                                                {endereco.numero ? `, ${endereco.numero}` : ""}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <BalcaoPainel aba={aba} onAbaChange={setAba} exibirAbas={false} />
                )}
            </div>

            {mostrarRecuperacao && (
                <div
                    className="modal fade show d-block"
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.5)"
                    }}
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <div>
                                    <h5 className="modal-title">Recuperar pedido</h5>

                                    <small className="text-muted">
                                        Selecione um pedido em aberto para continuar o atendimento.
                                    </small>
                                </div>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={fecharRecuperacao}
                                    disabled={carregandoRecuperacao}
                                />
                            </div>

                            <div className="modal-body">
                                {erroRecuperacao && <div className="alert alert-danger">{erroRecuperacao}</div>}

                                {!carregandoRecuperacao && !erroRecuperacao && (
                                    <div className="mb-3">
                                        <div className="row g-2">
                                            <div className="col-12 col-md-8">
                                                <input
                                                    type="search"
                                                    className="form-control"
                                                    placeholder="Buscar por número, nome, telefone ou CPF..."
                                                    value={filtroRecuperacao}
                                                    onChange={(event) => {
                                                        setFiltroRecuperacao(event.target.value);
                                                        setPedidoSelecionadoRecuperacao(0);
                                                    }}
                                                    autoFocus
                                                />
                                            </div>

                                            <div className="col-12 col-md-4">
                                                <select
                                                    className="form-select"
                                                    value={tipoFiltroRecuperacao}
                                                    onChange={(event) => {
                                                        setTipoFiltroRecuperacao(event.target.value);
                                                        setPedidoSelecionadoRecuperacao(0);
                                                    }}
                                                >
                                                    <option value="TODOS">Todos</option>
                                                    <option value="ENTREGA">Entrega</option>
                                                    <option value="RETIRADA">Retirada</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center mt-2">
                                            <small className="text-muted">
                                                {pedidosFiltrados.length} pedido(s) encontrado(s)
                                            </small>

                                            {filtroRecuperacao && (
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-link p-0"
                                                    onClick={() => {
                                                        setFiltroRecuperacao("");
                                                        setPedidoSelecionadoRecuperacao(0);
                                                    }}
                                                >
                                                    Limpar busca
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {carregandoRecuperacao && (
                                    <div className="text-center py-5 text-muted">Consultando pedidos abertos...</div>
                                )}

                                {!carregandoRecuperacao && !erroRecuperacao && pedidosAbertos.length === 0 && (
                                    <div className="text-center py-5 text-muted">
                                        <h5>Nenhum pedido em aberto.</h5>

                                        <div>Não há pedidos disponíveis para recuperação.</div>
                                    </div>
                                )}

                                {!carregandoRecuperacao &&
                                    !erroRecuperacao &&
                                    pedidosAbertos.length > 0 &&
                                    pedidosFiltrados.length === 0 && (
                                        <div className="text-center py-5 text-muted">
                                            <h5>Nenhum pedido encontrado.</h5>

                                            <div>Ajuste a busca ou o filtro.</div>
                                        </div>
                                    )}

                                {!carregandoRecuperacao && !erroRecuperacao && pedidosFiltrados.length > 0 && (
                                    <div className="list-group">
                                        {pedidosFiltrados.map((pedido, indice) => (
                                            <button
                                                key={pedido.id}
                                                type="button"
                                                className={`list-group-item list-group-item-action ${
                                                    indice === pedidoSelecionadoRecuperacao ? "active" : ""
                                                }`}
                                                onMouseEnter={() => setPedidoSelecionadoRecuperacao(indice)}
                                                onClick={() => recuperarPedido(pedido)}
                                            >
                                                <div className="d-flex justify-content-between align-items-center gap-3">
                                                    <div className="text-start">
                                                        <div className="fw-semibold">{obterNumeroPedido(pedido)}</div>

                                                        <div className="small">
                                                            {pedido.cliente || "Venda sem cliente"}
                                                        </div>

                                                        <div className="small text-muted">
                                                            {pedido.tipoRecebimento === "ENTREGA"
                                                                ? "Entrega"
                                                                : "Retirada"}
                                                            {" · "}
                                                            {pedido.itens?.length || 0} item(ns)
                                                        </div>
                                                    </div>

                                                    <div className="text-end">
                                                        <strong>R$ {Number(pedido.valorTotal || 0).toFixed(2)}</strong>

                                                        <div className="small text-muted">
                                                            {pedido.pagamentos?.length || 0} pagamento(s)
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={fecharRecuperacao}
                                    disabled={carregandoRecuperacao}
                                >
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {trocoFinal > 0 && (
                <div
                    className="modal fade show d-block"
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.5)"
                    }}
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Venda finalizada</h5>
                            </div>

                            <div className="modal-body text-center py-4">
                                <div className="text-muted mb-2">Troco</div>

                                <strong className="display-5">
                                    R${" "}
                                    {Number(trocoFinal).toLocaleString("pt-BR", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
                                </strong>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    autoFocus
                                    onClick={() => setTrocoFinal(0)}
                                >
                                    OK (Enter)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <KeyboardAlert open={alertState.open} message={alertState.message} onClose={closeAlert} />
        </>
    );
}

export default MiniPdv;
