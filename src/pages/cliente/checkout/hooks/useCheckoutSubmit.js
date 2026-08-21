import { validarCheckout } from "../checkoutValidation";
import { montarPedido } from "../checkoutPayload";
import { prepararPedido } from "../checkoutSubmit";

function montarObservacaoComTroco(observacao, troco) {
    const observacaoBase = observacao?.trim() || "";

    if (troco <= 0) {
        return observacaoBase;
    }

    const textoTroco = `Troco em dinheiro: R$ ${troco.toFixed(2).replace(".", ",")}`;

    return observacaoBase ? `${observacaoBase}\n${textoTroco}` : textoTroco;
}

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
    function prepararCheckout() {
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

        const troco = Math.max(0, totalPagamentos - valorTotal);

        const observacaoFinal = montarObservacaoComTroco(observacao, troco);

        const pedido = montarPedido({
            cliente,
            observacao: observacaoFinal,
            pagamentos,
            tipoRecebimento,
            enderecoSelecionado,
            carrinho
        });

        const payload = prepararPedido(pedido);

        setPedidoPreparado(payload);
    }

    return {
        prepararCheckout
    };
}
