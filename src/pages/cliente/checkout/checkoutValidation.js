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

    if (!cliente?.clienteId) {
        return "Cliente não identificado. Volte para a identificação.";
    }

    if (!tipoRecebimento) {
        return "Selecione o tipo de recebimento.";
    }

    if (tipoRecebimento === "ENTREGA" && !enderecoSelecionado) {
        return "Selecione um endereço para entrega.";
    }

    if (pagamentos.length === 0) {
        return "Selecione uma forma de pagamento.";
    }

    for (const pagamento of pagamentos) {
        if (!pagamento.formaPagamentoId) {
            return "Selecione a forma de pagamento.";
        }

        if (!pagamento.valor || Number(pagamento.valor) <= 0) {
            return "Informe um valor válido para cada pagamento.";
        }

        if (!pagamento.confirmado) {
            return "Confirme o pagamento antes de continuar.";
        }
    }

    if (Number(totalPagamentos) < Number(valorTotal)) {
        return "A soma dos pagamentos não pode ser menor que o total do pedido.";
    }

    return null;
}
