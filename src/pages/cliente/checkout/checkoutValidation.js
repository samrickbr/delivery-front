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

    if (tipoRecebimento === "ENTREGA" && valorTotal === null) {
        return "A taxa de entrega ainda não está disponível pelo Backend.";
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
            return "Confirme todos os pagamentos antes de continuar.";
        }
    }

    if (valorTotal === null) {
        return "O total oficial do pedido ainda não está disponível.";
    }

    if (totalPagamentos < valorTotal) {
        return "A soma dos pagamentos não pode ser menor que o total do pedido.";
    }

    return null;
}
