import test from "node:test";
import assert from "node:assert/strict";

import {
    calcularTroco,
    calcularValorVenda,
    montarPagamentosParaEnvio,
    normalizarListaFormasPagamento,
    validarPagamento
} from "./miniPdvUtils.js";

test("normaliza formas de pagamento mesmo quando a resposta chega aninhada", () => {
    const payload = {
        data: {
            content: [
                { id: 1, ativo: true, descricao: "Dinheiro" },
                { id: 2, ativo: true, descricao: "Pix" }
            ]
        }
    };

    assert.deepEqual(normalizarListaFormasPagamento(payload), payload.data.content);
});

test("calcula troco corretamente com múltiplos pagamentos em dinheiro", () => {
    const pagamentos = [
        { formaPagamentoId: 2, valor: 20, atalho: "D" },
        { formaPagamentoId: 1, valor: 30, atalho: "P" },
        { formaPagamentoId: 2, valor: 90, atalho: "D" }
    ];

    assert.equal(calcularTroco({ pagamentos, valorVenda: 100 }), 40);
});

test("monta pagamentos sem gerar troco inconsistente com dinheiro multipartido", () => {
    const pagamentos = [
        { formaPagamentoId: 2, valor: 30, atalho: "D" },
        { formaPagamentoId: 1, valor: 40, atalho: "P" },
        { formaPagamentoId: 2, valor: 40, atalho: "D" }
    ];

    assert.deepEqual(montarPagamentosParaEnvio(pagamentos, 100), {
        ok: true,
        pagamentos: [
            { formaPagamentoId: 2, valor: 30 },
            { formaPagamentoId: 1, valor: 40 },
            { formaPagamentoId: 2, valor: 30 }
        ]
    });
});

test("calcula o valor total da venda com taxa de entrega", () => {
    assert.equal(calcularValorVenda({ valorProdutos: 80, tipoRecebimento: "ENTREGA", taxaEntrega: 12.5 }), 92.5);
    assert.equal(calcularValorVenda({ valorProdutos: 80, tipoRecebimento: "RETIRADA", taxaEntrega: 12.5 }), 80);
});

test("valida pagamento considerando a taxa de entrega", () => {
    const erro = validarPagamento({
        pagamentos: [{ formaPagamentoId: 1, valor: 92.5, atalho: "P" }],
        valorProdutos: 80,
        totalPagamentos: 92.5,
        tipoRecebimento: "ENTREGA",
        taxaEntrega: 12.5
    });

    assert.equal(erro, "");
});

test("aceita troco quando o dinheiro é usado junto com outra forma de pagamento", () => {
    const pagamentos = [
        { formaPagamentoId: 1, valor: 15, atalho: "P" },
        { formaPagamentoId: 3, valor: 20, atalho: "D" }
    ];

    assert.equal(
        validarPagamento({
            pagamentos,
            valorProdutos: 30,
            totalPagamentos: 35,
            tipoRecebimento: "RETIRADA",
            taxaEntrega: 0
        }),
        ""
    );

    assert.equal(calcularTroco({ pagamentos, valorVenda: 30 }), 5);
});
