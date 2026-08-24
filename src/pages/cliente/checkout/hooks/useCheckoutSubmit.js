import { useState } from "react";

import { validarCheckout } from "../checkoutValidation";
import { montarPedido } from "../checkoutPayload";
import { prepararPedido } from "../checkoutSubmit";
import { criarPedido } from "../../../../services/pedidoService";

export function useCheckoutSubmit({
    cliente,
    carrinho,
    pagamentos,
    tipoRecebimento,
    enderecoSelecionado,
    valorTotal,
    totalPagamentos,
    observacao,
    setErro,
    setPedidoPreparado
}) {
    const [enviando, setEnviando] = useState(false);

    async function prepararCheckout() {
        if (enviando) {
            return;
        }

        setErro("");

        const erroValidacao = validarCheckout({
            carrinho,
            cliente,
            tipoRecebimento,
            enderecoSelecionado,
            pagamentos,
            valorTotal,
            totalPagamentos
        });

        if (erroValidacao) {
            setErro(erroValidacao);
            return;
        }

        const pedido = montarPedido({
            cliente,
            observacao,
            pagamentos,
            tipoRecebimento,
            enderecoSelecionado,
            carrinho
        });

        const payload = prepararPedido(pedido);

        console.log("[CHECKOUT] Confirmando pedido");
        console.log("[CHECKOUT] Payload do pedido:");
        console.log(JSON.stringify(payload, null, 2));

        setEnviando(true);

        try {
            const response = await criarPedido(payload);

            console.log("[CHECKOUT] Pedido criado com sucesso");
            console.log("[CHECKOUT] Resposta:");
            console.log(JSON.stringify(response.data, null, 2));

            setPedidoPreparado(response.data);
        } catch (error) {
            console.error("[CHECKOUT] Erro ao criar pedido:", error);

            if (error.response?.status === 401) {
                setErro("Sua sessão expirou. Faça login novamente.");
            } else if (error.response?.status === 403) {
                setErro("Você não tem autorização para realizar este pedido.");
            } else if (error.response?.status === 400) {
                setErro("Não foi possível confirmar o pedido. Verifique os dados informados.");
            } else if (error.response?.status === 409) {
                setErro("Não foi possível confirmar o pedido neste momento. Tente novamente.");
            } else if (error.response) {
                setErro("Não foi possível confirmar o pedido. Tente novamente.");
            } else {
                setErro("Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.");
            }
        } finally {
            setEnviando(false);
        }
    }

    return {
        prepararCheckout,
        enviando
    };
}
