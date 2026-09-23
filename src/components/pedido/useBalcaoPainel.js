import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
    listarBalcao,
    listarSeparacao,
    listarRetirada,
    aprovarPedido,
    entregarPedido,
    adicionarItemPedido,
    alterarQuantidadeItemPedido
} from "../../services/pedidoService";

import { ABAS } from "./balcaoAbas";

// ============================================================
// Hook centralizado para a regra de negócio do balcão.
// Mantém o estado do painel, carregamento de dados e ações
// de edição/cancelamento em um único ponto para reduzir o
// acoplamento do componente visual.
// ============================================================
function useBalcaoPainel({
    aba: abaControlada,
    onAbaChange,
    pedidoDirecionadoId,
    pedidoItemDirecionadoId
}) {
    const [pedidos, setPedidos] = useState([]);
    const [separacoes, setSeparacoes] = useState([]);
    const [retiradas, setRetiradas] = useState([]);
    const [abaInterna, setAbaInterna] = useState(ABAS.PEDIDOS);
    const aba = abaControlada ?? abaInterna;

    const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
    const [mostrarModalEdicao, setMostrarModalEdicao] = useState(false);
    const [mostrarModalCancelamento, setMostrarModalCancelamento] = useState(false);
    const [erroEdicao, setErroEdicao] = useState("");
    const [pedidoEmDestaqueId, setPedidoEmDestaqueId] = useState(null);
    const [pedidoItemEmDestaqueId, setPedidoItemEmDestaqueId] = useState(null);

    const pedidoDirecionadoPendenteRef = useRef(pedidoDirecionadoId ?? null);

    const pedidoPodeSerEditado = useCallback((pedido) => {
        return !["FINALIZADO", "FATURADO", "ENTREGUE", "CANCELADO"].includes(
            pedido?.status
        );
    }, []);

    const setAba = useCallback(
        (novaAba) => {
            if (abaControlada === undefined) {
                setAbaInterna(novaAba);
            }

            onAbaChange?.(novaAba);
        },
        [abaControlada, onAbaChange]
    );

    const abrirEdicao = useCallback(
        (pedido) => {
            if (!pedidoPodeSerEditado(pedido)) {
                return;
            }

            setPedidoSelecionado(pedido);
            setErroEdicao("");
            setMostrarModalEdicao(true);
        },
        [pedidoPodeSerEditado]
    );

    const fecharEdicao = useCallback(() => {
        setMostrarModalEdicao(false);
        setPedidoSelecionado(null);
        setErroEdicao("");
    }, []);

    const carregarPedidos = useCallback(async () => {
        const response = await listarBalcao();
        const dados = response.data || [];

        setPedidos(dados);

        return dados;
    }, []);

    const carregarSeparacoes = useCallback(async () => {
        const response = await listarSeparacao();
        const dados = response.data || [];

        setSeparacoes(dados);

        return dados;
    }, []);

   const carregarRetiradas = useCallback(async () => {
       const response = await listarRetirada();
       const dados = response.data || [];

       setRetiradas(dados);

       return dados;
   }, []);

   const carregarDados = useCallback(async () => {
       const [pedidosAtualizados, separacoesAtualizadas, retiradasAtualizadas] = await Promise.all([
           carregarPedidos(),
           carregarSeparacoes(),
           carregarRetiradas()
       ]);

       return {
           pedidos: pedidosAtualizados,
           separacoes: separacoesAtualizadas,
           retiradas: retiradasAtualizadas
       };
   }, [carregarPedidos, carregarSeparacoes, carregarRetiradas]);

    const obterAbaPedido = useCallback((pedido) => {
        switch (pedido?.status) {
            case "RECEBIDO":
            case "APROVADO":
            case "PENDENTE":
            case "EM_PRODUCAO":
                return ABAS.PEDIDOS;

            case "AGUARDANDO_SEPARACAO":
                return ABAS.SEPARACAO;

            case "SEPARADO":
                return ABAS.RETIRADA;

            case "FINALIZADO":
            case "FATURADO":
            case "ENTREGUE":
            case "CANCELADO":
            default:
                return null;
        }
    }, []);

    const recarregarPedido = useCallback(
        async (pedidoId) => {
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
        },
        [fecharEdicao]
    );

    const adicionarItem = useCallback(
        async (pedidoId, produtoId, quantidade = 1) => {
            try {
                setErroEdicao("");
                await adicionarItemPedido(pedidoId, produtoId, quantidade);
                await recarregarPedido(pedidoId);
            } catch (error) {
                console.error("Erro ao adicionar item ao pedido.", error);
                setErroEdicao(
                    "Não foi possível adicionar o item ao pedido."
                );
            }
        },
        [recarregarPedido]
    );

    const incrementarItem = useCallback(
        async (pedidoId, itemId, quantidade = 1) => {
            try {
                setErroEdicao("");
                await adicionarItemPedido(
                    pedidoId,
                    undefined,
                    quantidade,
                    itemId
                );
                await recarregarPedido(pedidoId);
            } catch (error) {
                console.error(
                    "Erro ao incrementar item do pedido.",
                    error
                );
                setErroEdicao(
                    error?.response?.data?.message ||
                        "Não foi possível incrementar o item do pedido."
                );
            }
        },
        [recarregarPedido]
    );

    const alterarQuantidade = useCallback(
        async (pedidoId, itemId, quantidade) => {
            try {
                setErroEdicao("");

                const novaQuantidade = Number(quantidade);

                if (!Number.isInteger(novaQuantidade)) {
                    setErroEdicao(
                        "Informe uma quantidade inteira válida."
                    );
                    return;
                }

                if (novaQuantidade < 1) {
                    setErroEdicao(
                        "A quantidade deve ser maior que zero. Use o cancelamento para remover o item."
                    );
                    return;
                }

                await alterarQuantidadeItemPedido(
                    pedidoId,
                    itemId,
                    novaQuantidade
                );

                await recarregarPedido(pedidoId);
            } catch (error) {
                console.error(
                    "Erro ao alterar quantidade do item.",
                    error
                );
                setErroEdicao(
                    "Não foi possível alterar a quantidade do item."
                );
            }
        },
        [recarregarPedido]
    );

    const pedidosFiltrados = useMemo(() => {
        switch (aba) {
            case ABAS.PEDIDOS:
                return pedidos.filter((pedido) => {
                    if (pedido.status === "RECEBIDO" || pedido.status === "PENDENTE") {
                        return true;
                    }

                    if (pedido.status !== "APROVADO" && pedido.status !== "EM_PRODUCAO") {
                        return false;
                    }

                    const possuiProducaoPendente = pedido.itens?.some(
                        (item) =>
                            ["COZINHA", "PIZZARIA"].includes(item.setor) &&
                            !["FINALIZADO", "CANCELADO"].includes(item.statusOperacao)
                    );

                    return possuiProducaoPendente;
                });

            case ABAS.SEPARACAO:
                return separacoes.filter((pedido) => pedido.status === "AGUARDANDO_SEPARACAO");

            default:
                return [];
        }
    }, [aba, pedidos, separacoes]);

    const retiradasFiltradas = useMemo(
        () =>
            retiradas.filter(
                (pedido) => pedido.status === "SEPARADO"
            ),
        [retiradas]
    );

    const aceitarPedido = useCallback(
        async (id) => {
            await aprovarPedido(id);

            const dados = await carregarDados();

            const pedidoAtualizado = [...dados.pedidos, ...dados.separacoes, ...dados.retiradas].find(
                (pedido) => Number(pedido.id) === Number(id)
            );

            if (pedidoAtualizado) {
                const abaPedido = obterAbaPedido(pedidoAtualizado);

                if (abaPedido) {
                    setAba(abaPedido);
                }
            }
        },
        [carregarDados, obterAbaPedido, setAba]
    );

    const concluirRetirada = useCallback(
        async (id) => {
            await entregarPedido(id);
            await carregarDados();
        },
        [carregarDados]
    );

    const abrirCancelamento = useCallback((pedido) => {
        setPedidoSelecionado(pedido);
        setMostrarModalCancelamento(true);
    }, []);

    const fecharCancelamento = useCallback(() => {
        setMostrarModalCancelamento(false);
        setPedidoSelecionado(null);
    }, []);

    useEffect(() => {
        pedidoDirecionadoPendenteRef.current =
            pedidoDirecionadoId ?? null;
    }, [pedidoDirecionadoId]);

    useEffect(() => {
        let ativo = true;

        async function carregar() {
           const [balcaoResponse, separacaoResponse, retiradaResponse] = await Promise.all([
               listarBalcao(),
               listarSeparacao(),
               listarRetirada()
           ]);

            if (!ativo) {
                return;
            }

            setPedidos(balcaoResponse.data || []);
            setSeparacoes(separacaoResponse.data || []);
            setRetiradas(retiradaResponse.data || []);

            const pedidoDirecionado = [
                ...(balcaoResponse.data || []),
                ...(separacaoResponse.data || []),
                ...(retiradaResponse.data || [])
            ].find(
                (pedido) =>
                    Number(pedido.id) ===
                    Number(pedidoDirecionadoPendenteRef.current)
            );

            if (pedidoDirecionado) {
                const abaPedido =
                    obterAbaPedido(pedidoDirecionado);

                if (abaPedido) {
                    setAba(abaPedido);
                }

                setPedidoEmDestaqueId(pedidoDirecionado.id);
                pedidoDirecionadoPendenteRef.current = null;
            }
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
    }, [obterAbaPedido, setAba]);

    useEffect(() => {
        if (!pedidoDirecionadoId) {
            return undefined;
        }

        let ativo = true;
        let temporizadorDestaque;

        async function direcionarPedido() {
           const [balcaoResponse, separacaoResponse, retiradaResponse] = await Promise.all([
               listarBalcao(),
               listarSeparacao(),
               listarRetirada()
           ]);

            if (!ativo) {
                return;
            }

            const pedidosAtualizados =
                balcaoResponse.data || [];

            const separacoesAtualizadas =
                separacaoResponse.data || [];

            const retiradasAtualizadas =
                retiradaResponse.data || [];

            const pedido = [
                ...pedidosAtualizados,
                ...separacoesAtualizadas,
                ...retiradasAtualizadas
            ].find(
                (item) =>
                    Number(item.id) ===
                    Number(pedidoDirecionadoId)
            );

            setPedidos(pedidosAtualizados);
            setRetiradas(retiradasAtualizadas);
            setSeparacoes(separacoesAtualizadas);

            if (!pedido) {
                return;
            }

            const abaPedido =
                obterAbaPedido(pedido);

            if (abaPedido) {
                setAba(abaPedido);
            }

            setPedidoEmDestaqueId(pedido.id);
            setPedidoItemEmDestaqueId(
                pedidoItemDirecionadoId ?? null
            );

            pedidoDirecionadoPendenteRef.current = null;

            temporizadorDestaque = setTimeout(() => {
                if (ativo) {
                    setPedidoEmDestaqueId(null);
                    setPedidoItemEmDestaqueId(null);
                }
            }, 5000);
        }

        direcionarPedido();

        return () => {
            ativo = false;
            clearTimeout(temporizadorDestaque);
        };
    }, [
        pedidoDirecionadoId,
        pedidoItemDirecionadoId,
        obterAbaPedido,
        setAba
    ]);

    return {
        aba,
        pedidos,
        separacoes,
        retiradas,
        pedidosFiltrados,
        retiradasFiltradas,
        pedidoSelecionado,
        mostrarModalEdicao,
        mostrarModalCancelamento,
        erroEdicao,
        pedidoEmDestaqueId,
        pedidoItemEmDestaqueId,
        setPedidoSelecionado,
        setErroEdicao,
        setMostrarModalEdicao,
        setMostrarModalCancelamento,
        setAba,
        pedidoPodeSerEditado,
        abrirEdicao,
        fecharEdicao,
        carregarDados,
        recarregarPedido,
        adicionarItem,
        incrementarItem,
        alterarQuantidade,
        abrirCancelamento,
        fecharCancelamento,
        aceitarPedido,
        concluirRetirada
    };
}

export default useBalcaoPainel;
