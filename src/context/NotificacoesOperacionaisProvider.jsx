import { useCallback, useEffect, useRef, useState } from "react";

import { conectarEventosProducao } from "../services/eventoProducaoService";
import { buscarPedido } from "../services/pedidoService";
import { obterNumeroPedido } from "../utils/pedidoUtils";
import NotificacoesOperacionaisContext from "./notificacoesOperacionaisContext";

const DEDUPLICACAO_MS = 10000;

function criarNotificacao(evento, tipo, pedido) {
    const item = pedido.itens?.find((pedidoItem) => Number(pedidoItem.id) === Number(evento.pedidoItemId));

    return {
        id: `${tipo}-${evento.pedidoId}${evento.pedidoItemId ? `-${evento.pedidoItemId}` : ""}-${Date.now()}`,
        tipo,
        pedidoId: evento.pedidoId,
        pedidoItemId: evento.pedidoItemId,
        numeroPedido: obterNumeroPedido(pedido),
        produto: item?.produto,
        setor: evento.setor,
        status: evento.status
    };
}

export function NotificacoesOperacionaisProvider({ children }) {
    const [notificacoes, setNotificacoes] = useState([]);
    const [pedidosProntosIds, setPedidosProntosIds] = useState([]);
    const eventosRecentesRef = useRef(new Map());

    const adicionarNotificacao = useCallback(async (evento, tipo) => {
        if (!evento?.pedidoId) {
            return;
        }

        const chave = `${tipo}-${evento.pedidoId}${evento.pedidoItemId ? `-${evento.pedidoItemId}` : ""}`;
        const agora = Date.now();
        const ultimoEvento = eventosRecentesRef.current.get(chave);

        if (ultimoEvento && agora - ultimoEvento < DEDUPLICACAO_MS) {
            return;
        }

        eventosRecentesRef.current.set(chave, agora);

        try {
            const response = await buscarPedido(evento.pedidoId);
            const pedido = response.data || {};

            setNotificacoes((atuais) => [...atuais, criarNotificacao(evento, tipo, pedido)]);
        } catch (error) {
            eventosRecentesRef.current.delete(chave);
            console.error("Erro ao carregar pedido para notificação operacional.", error);
        }
    }, []);

    const dispensarNotificacao = useCallback((notificacaoId) => {
        setNotificacoes((atuais) => atuais.filter((notificacao) => notificacao.id !== notificacaoId));
    }, []);

    const removerDestaquePedidoPronto = useCallback((pedidoId) => {
        setPedidosProntosIds((atuais) => atuais.filter((id) => Number(id) !== Number(pedidoId)));
    }, []);

    useEffect(() => {
        return conectarEventosProducao({
            onNovoPedido: (evento) => {
                if (evento?.tipo === "NOVO_PEDIDO") {
                    adicionarNotificacao(evento, "NOVO_PEDIDO");
                }
            },
            onPedidoPronto: (evento) => {
                if (evento?.tipo === "PEDIDO_PRONTO") {
                    setPedidosProntosIds((atuais) =>
                        atuais.some((id) => Number(id) === Number(evento.pedidoId)) ? atuais : [...atuais, evento.pedidoId]
                    );
                    adicionarNotificacao(evento, "PEDIDO_PRONTO");
                }
            },
            onPedidoItemFinalizado: (evento) => {
                if (evento?.tipo === "PEDIDO_ITEM_FINALIZADO") {
                    adicionarNotificacao(evento, "PEDIDO_ITEM_FINALIZADO");
                }
            },
            onErro: (error) => {
                console.error("Erro ao receber notificações operacionais.", error);
            }
        });
    }, [adicionarNotificacao]);

    return (
        <NotificacoesOperacionaisContext.Provider
            value={{ notificacoes, pedidosProntosIds, dispensarNotificacao, removerDestaquePedidoPronto }}
        >
            {children}
        </NotificacoesOperacionaisContext.Provider>
    );
}
