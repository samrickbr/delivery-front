import { useCallback, useEffect, useMemo, useState } from "react";

import MiniPdvProdutos from "../components/MiniPdvProdutos";
import MiniPdvCarrinho from "../components/MiniPdvCarrinho";
import MiniPdvCliente from "../components/MiniPdvCliente";
import MiniPdvEndereco from "../components/MiniPdvEndereco";
import MiniPdvPagamentoEtapa from "../components/MiniPdvPagamentoEtapa";
import MiniPdvAcoes from "../components/MiniPdvAcoes";
import MiniPdvResumo from "../components/MiniPdvResumo";
import MiniPdvClienteModal from "../components/MiniPdvClienteModal";
import EnderecoModal from "../../cliente/checkout/components/EnderecoModal";

import useMiniPdv from "../hooks/useMiniPdv";
import useMiniPdvCarrinho from "../hooks/useMiniPdvCarrinho";
import useMiniPdvFormasPagamento from "../hooks/useMiniPdvFormasPagamento";
import useMiniPdvPagamentos from "../hooks/useMiniPdvPagamentos";
import useMiniPdvFluxo from "../hooks/useMiniPdvFluxo";
import useMiniPdvAtalhos from "../hooks/useMiniPdvAtalhos";
import useMiniPdvCadastro from "../hooks/useMiniPdvCadastro";
import useKeyboardAlert from "../../../hooks/useKeyboardAlert";

import KeyboardAlert from "../../../components/KeyboardAlert";
import CancelarItensModal from "../../../components/pedido/CancelarItensModal";

import { buscarTaxaEntrega } from "../../../services/configuracaoService";
import {
    adicionarItemPedido,
    alterarQuantidadeItemPedido,
    cancelarItemPedido,
    cancelarPedidoCompleto,
    aprovarPedido,
    criarPedidoOperacional,
    listarPedidosAbertos,
    buscarPedido
} from "../../../services/pedidoService";
import { buscarClientesOperacional } from "../../../services/clienteService";
import { obterNumeroPedido } from "../../../utils/pedidoUtils";

import {
    ETAPA_PAGAMENTO,
    ETAPA_VENDA,
    calcularValorVenda,
    filtrarItensEditaveis,
    montarPedidoOperacional
} from "../utils/miniPdvUtils";

function MiniPdv() {
    const [taxaEntregaConfigurada, setTaxaEntregaConfigurada] = useState(null);
    const [carregandoTaxaEntrega, setCarregandoTaxaEntrega] = useState(false);
    const [erroTaxaEntrega, setErroTaxaEntrega] = useState("");

    const [mostrarRecuperacao, setMostrarRecuperacao] = useState(false);
    const [pedidosAbertos, setPedidosAbertos] = useState([]);
    const [carregandoRecuperacao, setCarregandoRecuperacao] = useState(false);
    const [erroRecuperacao, setErroRecuperacao] = useState("");
    const [filtroRecuperacao, setFiltroRecuperacao] = useState("");
    const [tipoFiltroRecuperacao, setTipoFiltroRecuperacao] = useState("ABERTOS");
    const [pedidoSelecionadoRecuperacao, setPedidoSelecionadoRecuperacao] = useState(0);
    const [numeroPedidoAtual, setNumeroPedidoAtual] = useState(null);

    const [clientesRecuperacao, setClientesRecuperacao] = useState([]);
    const [focoProdutoSolicitado, setFocoProdutoSolicitado] = useState(0);
    const [enviandoParaProducao, setEnviandoParaProducao] = useState(false);

    const [mostrarCancelamento, setMostrarCancelamento] = useState(false);
    const [pedidoCancelamento, setPedidoCancelamento] = useState(null);

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
        carregarEnderecosCliente,
        carregarPedido,
        limparVenda
    } = useMiniPdv();

    const {
        cadastroClienteAberto,
        cadastroEnderecoAberto,
        abrirCadastroCliente,
        fecharCadastroCliente,
        abrirCadastroEndereco,
        fecharCadastroEndereco,
        salvarCliente,
        salvarEndereco,
        selecionarEnderecoCadastrado
    } = useMiniPdvCadastro({
        cliente,
        selecionarCliente,
        selecionarEndereco,
        carregarEnderecosCliente
    });

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
        alterarPagamentoPorAtalho,
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

    const solicitarLimpezaVenda = useCallback(async () => {
        if (!carrinho.length) {
            setNumeroPedidoAtual(null);
            limparNovaVenda();
            return;
        }

        const confirmar = window.confirm(
            pedidoId ? "Deseja realmente cancelar o pedido atual?" : "Deseja realmente cancelar e limpar a venda atual?"
        );

        if (!confirmar) {
            return;
        }

        if (!pedidoId) {
            setNumeroPedidoAtual(null);
            limparNovaVenda();
            return;
        }

        const justificativa = window.prompt("Informe o motivo do cancelamento do pedido:");

        if (justificativa === null) {
            return;
        }

        if (!justificativa.trim()) {
            showAlert("Informe a justificativa do cancelamento.");
            return;
        }

        try {
            await cancelarPedidoCompleto(pedidoId, justificativa.trim());

            setNumeroPedidoAtual(null);
            limparNovaVenda();
            showAlert("Pedido cancelado com sucesso.");
        } catch (error) {
            console.error("Erro ao cancelar pedido no Mini PDV.", error);

            showAlert(error?.response?.data?.message || "Não foi possível cancelar o pedido.");
        }
    }, [carrinho.length, pedidoId, limparNovaVenda, showAlert]);

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
        setTipoFiltroRecuperacao("ABERTOS");
        setPedidoSelecionadoRecuperacao(0);
        setCarregandoRecuperacao(true);

        try {
const response = await listarPedidosAbertos();

setPedidosAbertos(Array.isArray(response?.data) ? response.data : []);
        } catch (error) {
            console.error("Erro ao listar pedidos para recuperação.", error);

            setErroRecuperacao(error?.response?.data?.message || "Não foi possível consultar os pedidos.");
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
        setTipoFiltroRecuperacao("ABERTOS");
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
            setNumeroPedidoAtual(obterNumeroPedido(pedidoParaRecuperar));

            carregarCarrinho(itensNormalizados);
            carregarPagamentos(pedidoParaRecuperar.pagamentos || []);
            setFocoProdutoSolicitado((atual) => atual + 1);

            setEtapa(ETAPA_VENDA);

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
            const status = String(pedido.status || "");

            if (tipoFiltroRecuperacao === "ABERTOS" && ["FINALIZADO", "CANCELADO", "ENTREGUE"].includes(status)) {
                return false;
            }

            if (
                ["ENTREGA", "RETIRADA"].includes(tipoFiltroRecuperacao) &&
                pedido.tipoRecebimento !== tipoFiltroRecuperacao
            ) {
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

    async function enviarParaProducao() {
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

    const abrirCancelamento = useCallback(async () => {
        if (!pedidoId || carregando) {
            return;
        }

        try {
            const response = await buscarPedido(pedidoId);

            setPedidoCancelamento(response.data);
            setMostrarCancelamento(true);
        } catch (error) {
            console.error("Erro ao carregar pedido para cancelamento.", error);

            showAlert(error?.response?.data?.message || "Não foi possível carregar o pedido.");
        }
    }, [pedidoId, carregando, showAlert]);

    useMiniPdvAtalhos({
        etapa,
        alertOpen: alertState.open,
        trocoFinal,
        onFinalizarVenda: finalizarVenda,
        onEnviarProducao: enviarParaProducao,
        onRecuperarVenda: abrirRecuperacao,
        onLimparNovaVenda: solicitarLimpezaVenda,
        onVoltarParaVenda: voltarParaVenda,
        onFecharAlerta: closeAlert,
        onCancelar: abrirCancelamento,
        onFecharTrocoModal: () => setTrocoFinal(0)
    });

    const podeFinalizarVenda =
        podeFinalizar &&
        carrinho.length > 0 &&
        !(tipoRecebimento === "ENTREGA" && (taxaEntrega === null || carregandoTaxaEntrega));

    if (etapa === ETAPA_PAGAMENTO) {
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
                    alterarPagamentoPorAtalho={alterarPagamentoPorAtalho}
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

       const justificativa = window.prompt("Informe o motivo do cancelamento do item:");

       if (justificativa === null) {
           return;
       }

       if (!justificativa.trim()) {
           showAlert("Informe a justificativa do cancelamento.");
           return;
       }

       try {
           const response = await cancelarItemPedido(pedidoId, item.itemPedidoId, justificativa.trim());

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
           console.error("Erro ao cancelar item do pedido recuperado.", error);

           showAlert(error?.response?.data?.message || "Não foi possível cancelar o item.");
       }
   }

    return (
        <>
            <div
                className="container-fluid py-3 d-flex flex-column mini-pdv-page"
                style={{
                    minHeight: 0
                }}
            >
                <div className="d-flex align-items-center justify-content-between flex-shrink-0 mb-3">
                    <h1 className="h4 mb-0">SIGIN — Mini PDV</h1>

                    <span className="badge text-bg-secondary">
                        {pedidoId
                            ? `Pedido ${numeroPedidoAtual || obterNumeroPedido({ id: pedidoId })} em atendimento`
                            : "Venda em atendimento"}
                    </span>
                </div>

                {erro && <div className="alert alert-danger py-2 flex-shrink-0">{erro}</div>}

                <div className="row g-2 flex-shrink-0 mb-2">
                    <div className={tipoRecebimento === "ENTREGA" ? "col-6" : "col-12"}>
                        <MiniPdvCliente
                            cliente={cliente}
                            onClienteSelecionado={selecionarCliente}
                            onClienteLimpo={() => selecionarCliente(null)}
                            onDefinirEntrega={definirEntrega}
                            onDefinirRetirada={definirRetirada}
                            onCadastrarCliente={abrirCadastroCliente}
                        />
                    </div>

                    {tipoRecebimento === "ENTREGA" && (
                        <div className="col-6">
                            <MiniPdvEndereco
                                cliente={cliente}
                                enderecos={enderecos}
                                endereco={endereco}
                                carregando={carregandoEnderecos}
                                erro={erroEnderecos}
                                onEnderecoSelecionado={selecionarEndereco}
                                onCadastrarEndereco={abrirCadastroEndereco}
                            />
                        </div>
                    )}
                </div>

                <div className="row g-2 flex-grow-1" style={{ minHeight: 0 }}>
                    <div className="col-4 d-flex flex-column gap-2" style={{ minHeight: 0 }}>
                        <MiniPdvProdutos
                            carrinho={carrinho}
                            onAdicionarProduto={adicionarProdutoPdv}
                            focoSolicitado={focoProdutoSolicitado}
                        />

                        {tipoRecebimento === "ENTREGA" && erroTaxaEntrega && (
                            <div className="alert alert-warning py-2 mb-0">{erroTaxaEntrega}</div>
                        )}

                        {erroFormasPagamento && (
                            <div className="alert alert-danger py-2 mb-0">{erroFormasPagamento}</div>
                        )}

                        {carregandoFormasPagamento && (
                            <div className="text-muted small">Carregando formas de pagamento...</div>
                        )}

                        <MiniPdvResumo
                            valorProdutos={valorProdutos}
                            taxaEntrega={taxaEntrega}
                            valorTotal={valorVenda}
                            tipoRecebimento={tipoRecebimento}
                        />

                        <MiniPdvAcoes
                            podeFinalizar={podeFinalizarVenda}
                            carregando={carregando || carregandoRecuperacao || enviandoParaProducao}
                            onFinalizar={finalizarVenda}
                            onEnviarProducao={enviarParaProducao}
                            onRecuperar={abrirRecuperacao}
                            onLimpar={solicitarLimpezaVenda}
                            onCancelar={abrirCancelamento}
                        />
                    </div>

                    <div className="col-8 d-flex" style={{ minHeight: 0 }}>
                        <div className="card border-0 shadow-sm flex-grow-1" style={{ minHeight: 0 }}>
                            <div className="card-body d-flex flex-column p-0" style={{ minHeight: 0 }}>
                                <div className="p-3 border-bottom flex-shrink-0">
                                    <h2 className="h5 mb-0">Itens da venda</h2>
                                </div>

                                <MiniPdvCarrinho
                                    carrinho={carrinho}
                                    onAdicionarProduto={adicionarProdutoPdv}
                                    onDiminuirProduto={diminuirProdutoPdv}
                                    onRemoverProduto={removerProdutoPdv}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <MiniPdvClienteModal
                aberto={cadastroClienteAberto}
                onFechar={fecharCadastroCliente}
                onSalvo={salvarCliente}
            />

            <EnderecoModal
                aberto={cadastroEnderecoAberto}
                onFechar={fecharCadastroEndereco}
                onSalvo={selecionarEnderecoCadastrado}
                salvarEndereco={salvarEndereco}
            />

            {pedidoCancelamento && (
                <CancelarItensModal
                    pedido={pedidoCancelamento}
                    setor="BALCAO"
                    mostrar={mostrarCancelamento}
                    permitirCompleto={true}
                    onFechar={() => {
                        setMostrarCancelamento(false);
                        setPedidoCancelamento(null);
                    }}
                    onAtualizar={async () => {
                        if (!pedidoId) {
                            return;
                        }

                        const response = await buscarPedido(pedidoId);
                        const pedidoAtualizado = response.data;

                        if (pedidoAtualizado.status === "CANCELADO") {
                            setMostrarCancelamento(false);
                            setPedidoCancelamento(null);
                            setNumeroPedidoAtual(null);
                            limparNovaVenda();
                            showAlert("Pedido cancelado com sucesso.");
                            return;
                        }

                        setPedidoCancelamento(pedidoAtualizado);

                        carregarCarrinho(
                            filtrarItensEditaveis(pedidoAtualizado.itens || []).map((item) => ({
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
                    }}
                />
            )}

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
                                                    <option value="ABERTOS">Abertos</option>
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
                                                                : "Retirada"}{" "}
                                                            • {pedido.itens?.length || 0} item(ns)
                                                        </div>

                                                        <span className="badge text-bg-secondary mt-1">
                                                            {String(pedido.status || "").replaceAll("_", " ")}
                                                        </span>
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
