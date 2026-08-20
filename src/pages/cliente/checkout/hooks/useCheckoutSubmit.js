import { validarCheckout } from "../checkoutValidation";
import { montarPedido } from "../checkoutPayload";
import { enviarPedido } from "../checkoutSubmit";

export function useCheckoutSubmit({
    cliente,
    carrinho,
    pagamentos,
    tipoRecebimento,
    enderecoSelecionado,
    valorTotal,
    totalPagamentos,
    observacao,
    enviando,
    setErro,
    setEnviando,
    setPedidoCriado,
    setCarrinho
}) {
    async function prepararCheckout() {
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

        if (enviando) {
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

        try {
            setEnviando(true);

            console.log("Enviando pedido:", pedido);

            const pedidoCriado = await enviarPedido(pedido);

            setPedidoCriado(pedidoCriado);

            sessionStorage.removeItem("carrinho");

            setCarrinho([]);
        } catch (error) {
            console.error(error);

            setErro(error?.response?.data?.message || "Não foi possível enviar o pedido. Tente novamente.");
        } finally {
            setEnviando(false);
        }
    }

    return {
        prepararCheckout
    };
}
