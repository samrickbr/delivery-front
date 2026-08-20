export function montarPedido({ cliente, observacao, pagamentos, tipoRecebimento, enderecoSelecionado, carrinho }) {
    return {
        clienteNome: cliente.nome?.trim() || "",
        clienteWhatsapp: cliente.telefone || cliente.whatsapp || "",
        observacao: observacao.trim(),
        pagamentos: pagamentos.map((pagamento) => ({
            formaPagamentoId: Number(pagamento.formaPagamentoId),
            valor: Number(pagamento.valor)
        })),
        tipoRecebimento,
        enderecoId: tipoRecebimento === "ENTREGA" ? Number(enderecoSelecionado) : null,
        itens: carrinho.map((item) => ({
            produtoId: item.id,
            quantidade: item.quantidade
        }))
    };
}
