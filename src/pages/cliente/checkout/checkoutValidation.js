import { formatarValor } from "./checkoutUtils";

export function validarCheckout({
    carrinho,
    cliente,
    tipoRecebimento,
    enderecoSelecionado,
    pagamentos,
    valorTotal,
    totalPagamentos
}) {
    if (carrinho.length === 0) {
        return "Seu carrinho está vazio.";
    }

    if (!cliente.clienteId) {
        return "Cliente não identificado. Volte para a identificação.";
    }

    if (tipoRecebimento === "ENTREGA" && !enderecoSelecionado) {
        return "Selecione um endereço para entrega.";
    }

    if (pagamentos.length === 0) {
        return "Adicione pelo menos uma forma de pagamento.";
    }

    for (const pagamento of pagamentos) {
        if (!pagamento.formaPagamentoId) {
            return "Selecione a forma de pagamento.";
        }

        if (!pagamento.valor || Number(pagamento.valor) <= 0) {
            return "Informe um valor válido para cada pagamento.";
        }

        if (!pagamento.confirmado) {
            return "Confirme todos os pagamentos antes de validar o checkout.";
        }
    }

    if (valorTotal === null) {
        return "O total oficial do pedido ainda não está disponível.";
    }

    if (Math.abs(totalPagamentos - valorTotal) > 0.009) {
        return `A soma dos pagamentos deve corresponder ao total de ${formatarValor(valorTotal)}.`;
    }

    return null;
}
