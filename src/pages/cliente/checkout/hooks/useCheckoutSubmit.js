import { validarCheckout } from "../checkoutValidation";
import { montarPedido } from "../checkoutPayload";
import { prepararPedido } from "../checkoutSubmit";

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

        const pedido = montarPedido({
            cliente,
            observacao,
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
