import { useCallback, useEffect, useMemo, useState } from "react";

import {
    listarBalcao,
    listarRetirada,
    aprovarPedido,
    conferirPedido,
    entregarPedido,
    adicionarItemPedido,
    alterarQuantidadeItemPedido,
    removerItemPedido
} from "../../services/pedidoService";

import { ABAS } from "./balcaoAbas";

// ============================================================
// Hook centralizado para a regra de negócio do balcão.
// Mantém o estado do painel, carregamento de dados e ações
// de edição/cancelamento em um único ponto para reduzir o
// acoplamento do componente visual.
// ============================================================
function useBalcaoPainel({ aba: abaControlada, onAbaChange }) {
    const [pedidos, setPedidos] = useState([]);
    const [retiradas, setRetiradas] = useState([]);
    const [abaInterna, setAbaInterna] = useState(ABAS.PEDIDOS);
    const aba = abaControlada ?? abaInterna;

    const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
    const [mostrarModalEdicao, setMostrarModalEdicao] = useState(false);
    const [mostrarModalCancelamento, setMostrarModalCancelamento] = useState(false);
    const [erroEdicao, setErroEdicao] = useState("");

    const pedidoPodeSerEditado = useCallback((pedido) => {
        return !["FATURADO", "ENTREGUE", "CANCELADO"].includes(pedido?.status);
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
        setPedidos(response.data || []);
    }, []);

    const carregarRetiradas = useCallback(async () => {
        const response = await listarRetirada();
        setRetiradas(response.data || []);
    }, []);

    const carregarDados = useCallback(async () => {
        await Promise.all([carregarPedidos(), carregarRetiradas()]);
    }, [carregarPedidos, carregarRetiradas]);

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
                setErroEdicao("Não foi possível adicionar o item ao pedido.");
            }
        },
        [recarregarPedido]
    );

    const alterarQuantidade = useCallback(
        async (pedidoId, itemId, quantidade) => {
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
        },
        [recarregarPedido]
    );

    const removerItem = useCallback(
        async (pedidoId, itemId) => {
            try {
                setErroEdicao("");
                await removerItemPedido(pedidoId, itemId);
                await recarregarPedido(pedidoId);
            } catch (error) {
                console.error("Erro ao remover item do pedido.", error);
                setErroEdicao("Não foi possível remover o item do pedido.");
            }
        },
        [recarregarPedido]
    );

    const possuiItemBalcaoDisponivel = useCallback((pedido) => {
        return pedido.itens?.some((item) => item.setor === "BALCAO" && item.statusOperacao !== "CANCELADO");
    }, []);

    const pedidosFiltrados = useMemo(() => {
        return pedidos.filter((pedido) => {
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
    }, [aba, pedidos, possuiItemBalcaoDisponivel]);

    const retiradasFiltradas = useMemo(() => retiradas.filter((pedido) => pedido.status === "SEPARADO"), [retiradas]);

    const aceitarPedido = useCallback(
        async (id) => {
            await aprovarPedido(id);
            await carregarDados();
        },
        [carregarDados]
    );

    const conferir = useCallback(
        async (id) => {
            await conferirPedido(id);
            await carregarDados();
        },
        [carregarDados]
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
        let ativo = true;

        async function carregar() {
            const [balcaoResponse, retiradaResponse] = await Promise.all([listarBalcao(), listarRetirada()]);

            if (!ativo) {
                return;
            }

            setPedidos(balcaoResponse.data || []);
            setRetiradas(retiradaResponse.data || []);
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

    return {
        aba,
        pedidos,
        retiradas,
        pedidosFiltrados,
        retiradasFiltradas,
        pedidoSelecionado,
        mostrarModalEdicao,
        mostrarModalCancelamento,
        erroEdicao,
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
        alterarQuantidade,
        removerItem,
        abrirCancelamento,
        fecharCancelamento,
        aceitarPedido,
        conferir,
        concluirRetirada
    };
}

export default useBalcaoPainel;
