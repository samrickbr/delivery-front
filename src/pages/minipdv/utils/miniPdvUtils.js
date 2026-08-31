export const ABA_PDV = "pdv";
export const ETAPA_VENDA = "venda";
export const ETAPA_PAGAMENTO = "pagamento";

function possuiPagamentoDinheiro(pagamentos = []) {
    return pagamentos.some((pagamento) => pagamento.atalho === "D");
}

function validarPagamentosEstrutura(pagamentos = []) {
    if (!Array.isArray(pagamentos) || !pagamentos.length) {
        return false;
    }

    return pagamentos.every((pagamento) => {
        const valor = Number(pagamento.valor);
        const formaPagamentoId = Number(pagamento.formaPagamentoId);

        return Number.isFinite(formaPagamentoId) && formaPagamentoId > 0 && Number.isFinite(valor) && valor > 0;
    });
}

export function validarPagamento({ pagamentos = [], valorProdutos = 0, totalPagamentos = 0 }) {
    if (!pagamentos.length) {
        return "Informe pelo menos uma forma de pagamento.";
    }

    if (!validarPagamentosEstrutura(pagamentos)) {
        return "Informe a forma e o valor de todos os pagamentos.";
    }

    const valorVenda = Number(valorProdutos) || 0;
    const totalRecebido = Number(totalPagamentos) || 0;

    if (totalRecebido < valorVenda) {
        return "O total dos pagamentos precisa corresponder ao total da venda.";
    }

    if (totalRecebido > valorVenda && !possuiPagamentoDinheiro(pagamentos)) {
        return "Não é permitido troco sem pagamento em dinheiro.";
    }

    if (totalRecebido > valorVenda) {
        const valorDinheiro = pagamentos
            .filter((pagamento) => pagamento.atalho === "D")
            .reduce((total, pagamento) => total + (Number(pagamento.valor) || 0), 0);

        const troco = totalRecebido - valorVenda;

        if (valorDinheiro < troco) {
            return "O valor em dinheiro não cobre o troco calculado.";
        }
    }

    return "";
}

export function calcularTroco({ pagamentos = [], valorVenda = 0 }) {
    const valorVendaNumero = Number(valorVenda) || 0;
    const totalPagamentos = pagamentos.reduce((total, pagamento) => total + (Number(pagamento.valor) || 0), 0);

    const troco = totalPagamentos - valorVendaNumero;

    if (troco <= 0) {
        return 0;
    }

    if (!possuiPagamentoDinheiro(pagamentos)) {
        return 0;
    }

    return troco;
}

export function montarPagamentosParaEnvio(pagamentos = [], valorVenda) {
    const valorVendaNumero = Number(valorVenda) || 0;
    const pagamentosAtuais = Array.isArray(pagamentos) ? pagamentos : [];

    if (!validarPagamentosEstrutura(pagamentosAtuais)) {
        return {
            ok: false,
            pagamentos: []
        };
    }

    const totalRecebido = pagamentosAtuais.reduce((total, pagamento) => total + (Number(pagamento.valor) || 0), 0);

    if (totalRecebido < valorVendaNumero) {
        return {
            ok: false,
            pagamentos: []
        };
    }

    if (totalRecebido > valorVendaNumero && !possuiPagamentoDinheiro(pagamentosAtuais)) {
        return {
            ok: false,
            pagamentos: []
        };
    }

    const troco = totalRecebido - valorVendaNumero;
    let trocoRestante = troco;
    const pagamentosParaEnviar = [];

    for (const pagamento of pagamentosAtuais) {
        const valorPagamento = Number(pagamento.valor) || 0;
        const formaPagamentoId = Number(pagamento.formaPagamentoId);

        if (!Number.isFinite(formaPagamentoId) || formaPagamentoId <= 0 || valorPagamento <= 0) {
            return {
                ok: false,
                pagamentos: []
            };
        }

        let valorParaEnviar = valorPagamento;

        if (trocoRestante > 0 && possuiPagamentoDinheiro([pagamento])) {
            const valorAbatido = Math.min(valorPagamento, trocoRestante);
            valorParaEnviar = valorPagamento - valorAbatido;
            trocoRestante = Math.max(trocoRestante - valorAbatido, 0);
        }

        if (valorParaEnviar > 0) {
            pagamentosParaEnviar.push({
                formaPagamentoId,
                valor: valorParaEnviar
            });
        }
    }

    if (trocoRestante > 0) {
        return {
            ok: false,
            pagamentos: []
        };
    }

    const totalEnviado = pagamentosParaEnviar.reduce((total, pagamento) => total + (Number(pagamento.valor) || 0), 0);

    if (Math.abs(totalEnviado - valorVendaNumero) > 0.0001) {
        return {
            ok: false,
            pagamentos: []
        };
    }

    return {
        ok: true,
        pagamentos: pagamentosParaEnviar
    };
}

export function montarPedidoOperacional({
    cliente,
    endereco,
    tipoRecebimento,
    carrinho = [],
    pagamentos = [],
    valorVenda
}) {
    const resultadoPagamentos = montarPagamentosParaEnvio(pagamentos, valorVenda);

    return {
        vendaRapida: !cliente?.id,

        ...(cliente?.id
            ? {
                  clienteId: cliente.id
              }
            : {}),

        clienteNome: cliente?.nome?.trim() || cliente?.nomeCompleto?.trim() || "",

        clienteWhatsapp: cliente?.telefone || cliente?.whatsapp || "",

        observacao: "",

        pagamentos: resultadoPagamentos.ok ? resultadoPagamentos.pagamentos : [],

        tipoRecebimento,

        enderecoId: tipoRecebimento === "ENTREGA" ? Number(endereco?.id) : null,

        itens: carrinho.map((item) => ({
            produtoId: item.id,
            quantidade: Number(item.quantidade)
        }))
    };
}
