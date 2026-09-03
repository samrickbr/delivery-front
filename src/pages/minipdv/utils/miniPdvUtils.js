export const ABA_PDV = "pdv";
export const ETAPA_VENDA = "venda";
export const ETAPA_PAGAMENTO = "pagamento";

export function normalizarListaFormasPagamento(resposta) {
    if (Array.isArray(resposta)) {
        return resposta;
    }

    if (!resposta || typeof resposta !== "object") {
        return [];
    }

    const chavesParaExplorar = ["data", "content", "items", "result", "formasPagamento", "formas", "itens"];

    for (const chave of chavesParaExplorar) {
        const valor = resposta[chave];

        if (Array.isArray(valor)) {
            return valor;
        }

        if (valor && typeof valor === "object") {
            const lista = normalizarListaFormasPagamento(valor);

            if (lista.length > 0) {
                return lista;
            }
        }
    }

    return [];
}

export function filtrarItensEditaveis(itens = []) {
    if (!Array.isArray(itens)) {
        return [];
    }

    return itens.filter((item) => item?.ativo !== false && !["CANCELADO", "FINALIZADO"].includes(item?.statusOperacao));
}

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

export function calcularValorVenda({ valorProdutos = 0, tipoRecebimento = "RETIRADA", taxaEntrega = 0 }) {
    const subtotal = Number(valorProdutos) || 0;
    const taxa = Number(taxaEntrega) || 0;

    if (tipoRecebimento === "ENTREGA") {
        return subtotal + taxa;
    }

    return subtotal;
}

export function validarPagamento({
    pagamentos = [],
    valorProdutos = 0,
    totalPagamentos = 0,
    tipoRecebimento = "RETIRADA",
    taxaEntrega = 0
}) {
    if (!pagamentos.length) {
        return "Informe pelo menos uma forma de pagamento.";
    }

    if (!validarPagamentosEstrutura(pagamentos)) {
        return "Informe a forma e o valor de todos os pagamentos.";
    }

    const valorVenda = calcularValorVenda({
        valorProdutos,
        tipoRecebimento,
        taxaEntrega
    });
    const totalRecebido = Number(totalPagamentos) || 0;

    if (totalRecebido < valorVenda) {
        return "O total dos pagamentos precisa corresponder ao total da venda.";
    }

    if (totalRecebido > valorVenda) {
        const valorDinheiro = pagamentos
            .filter((pagamento) => pagamento.atalho === "D")
            .reduce((total, pagamento) => total + (Number(pagamento.valor) || 0), 0);

        const troco = totalRecebido - valorVenda;

        if (!possuiPagamentoDinheiro(pagamentos)) {
            return "Não é permitido troco sem pagamento em dinheiro.";
        }

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
    const pagamentosParaEnviar = pagamentosAtuais.map((pagamento) => ({
        ...pagamento,
        valor: Number(pagamento.valor) || 0,
        formaPagamentoId: Number(pagamento.formaPagamentoId)
    }));

    for (let indice = pagamentosParaEnviar.length - 1; indice >= 0; indice -= 1) {
        const pagamento = pagamentosParaEnviar[indice];
        const valorPagamento = Number(pagamento.valor) || 0;
        const formaPagamentoId = Number(pagamento.formaPagamentoId);

        if (!Number.isFinite(formaPagamentoId) || formaPagamentoId <= 0 || valorPagamento <= 0) {
            return {
                ok: false,
                pagamentos: []
            };
        }

        if (trocoRestante > 0 && pagamento.atalho === "D") {
            const valorAbatido = Math.min(valorPagamento, trocoRestante);
            pagamento.valor = valorPagamento - valorAbatido;
            trocoRestante = Math.max(trocoRestante - valorAbatido, 0);
        }
    }

    const pagamentosFiltrados = pagamentosParaEnviar
        .filter((pagamento) => Number(pagamento.valor) > 0)
        .map((pagamento) => ({
            formaPagamentoId: Number(pagamento.formaPagamentoId),
            valor: Number(pagamento.valor)
        }));

    if (trocoRestante > 0) {
        return {
            ok: false,
            pagamentos: []
        };
    }

    const totalEnviado = pagamentosFiltrados.reduce((total, pagamento) => total + (Number(pagamento.valor) || 0), 0);

    if (Math.abs(totalEnviado - valorVendaNumero) > 0.0001) {
        return {
            ok: false,
            pagamentos: []
        };
    }

    return {
        ok: true,
        pagamentos: pagamentosFiltrados
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
