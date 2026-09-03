import { useState } from "react";

function normalizarDescricao(descricao) {
    return String(descricao || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toUpperCase();
}

function obterAtalho(descricao) {
    const normalizada = normalizarDescricao(descricao);

    if (normalizada.includes("DINHEIRO")) {
        return "D";
    }

    if (normalizada.includes("PIX")) {
        return "P";
    }

    if (normalizada.includes("CARTAO")) {
        return "C";
    }

    if (normalizada.includes("CREDIARIO")) {
        return "K";
    }

    return null;
}

function normalizarFormaPagamento(forma) {
    const atalho = obterAtalho(forma.descricao || forma.nome);

    return {
        ...forma,
        id: Number(forma.id),
        atalho,
        disponivel: atalho !== null && atalho !== "K"
    };
}

function useMiniPdvPagamentos(valorVenda = 0, formasPagamento = []) {
    const [pagamentos, setPagamentos] = useState([]);
    const [valorRecebimento, setValorRecebimento] = useState("");

    const formas = Array.isArray(formasPagamento)
        ? formasPagamento.map(normalizarFormaPagamento)
        : [];

    const totalVenda = Number(valorVenda) || 0;

    const totalPagamentos = pagamentos.reduce(
        (total, pagamento) =>
            total + (Number(pagamento.valor) || 0),
        0
    );

    const restante = Math.max(
        totalVenda - totalPagamentos,
        0
    );

    const possuiDinheiro = pagamentos.some(
        (pagamento) => pagamento.atalho === "D"
    );

    const troco =
        possuiDinheiro && totalPagamentos > totalVenda
            ? totalPagamentos - totalVenda
            : 0;

    function encontrarForma(formaPagamentoId) {
        const id = Number(formaPagamentoId);

        return formas.find(
            (forma) => Number(forma.id) === id
        );
    }

    function adicionarPagamentoPorAtalho(
        atalho,
        valorOpcional
    ) {
        const codigo = String(atalho || "")
            .trim()
            .toUpperCase();

        const forma = formas.find(
            (item) =>
                item.atalho === codigo &&
                item.disponivel
        );

        if (!forma) {
            return {
                sucesso: false,
                mensagem: "Forma de pagamento não disponível."
            };
        }

        let valor = Number(valorOpcional);

        if (!Number.isFinite(valor) || valor <= 0) {
            valor = Number(valorRecebimento);
        }

        if (!Number.isFinite(valor) || valor <= 0) {
            valor = restante > 0 ? restante : totalVenda;
        }

        if (!Number.isFinite(valor) || valor <= 0) {
            return {
                sucesso: false,
                mensagem: "Informe um valor válido para o pagamento."
            };
        }

        const eDinheiro = forma.atalho === "D";

        if (!eDinheiro && valor > restante) {
            return {
                sucesso: false,
                mensagem:
                    "O valor informado excede o valor restante da venda."
            };
        }

        const novoPagamento = {
            formaPagamentoId: Number(forma.id),
            valor,
            atalho: forma.atalho,
            descricao:
                forma.descricao ||
                forma.nome ||
                "",
            existente: false
        };

        const proximos = [
            ...pagamentos,
            novoPagamento
        ];

        const totalProximos = proximos.reduce(
            (total, pagamento) =>
                total + (Number(pagamento.valor) || 0),
            0
        );

        const possuiDinheiroProximo =
            proximos.some(
                (pagamento) =>
                    pagamento.atalho === "D"
            );

        const trocoCalculado =
            possuiDinheiroProximo &&
            totalProximos > totalVenda
                ? totalProximos - totalVenda
                : 0;

        const pagamentoCompleto =
            totalProximos >= totalVenda &&
            totalVenda > 0;

        setPagamentos(proximos);
        setValorRecebimento("");

        return {
            sucesso: true,
            pagamentos: proximos,
            totalPagamentos: totalProximos,
            pagamentoCompleto,
            troco: trocoCalculado
        };
    }

    function alterarPagamento(
        indice,
        formaPagamentoId,
        valor
    ) {
        const id = Number(formaPagamentoId);
        const valorNumerico = Number(valor);

        if (
            !id ||
            !Number.isFinite(valorNumerico) ||
            valorNumerico <= 0
        ) {
            return;
        }

        const forma = encontrarForma(id);

        if (!forma || !forma.disponivel) {
            return;
        }

        setPagamentos((atuais) =>
            atuais.map((pagamento, index) =>
                index === indice
                    ? {
                          ...pagamento,
                          formaPagamentoId: id,
                          valor: valorNumerico,
                          atalho: forma.atalho,
                          descricao:
                              forma.descricao ||
                              forma.nome ||
                              ""
                      }
                    : pagamento
            )
        );
    }

    function removerPagamento(indice) {
        setPagamentos((atuais) =>
            atuais.filter(
                (_, index) => index !== indice
            )
        );
    }

    function limparPagamentos() {
        setPagamentos([]);
        setValorRecebimento("");
    }

    function definirValorRecebimento(valor) {
        setValorRecebimento(valor);
    }

    function carregarPagamentos(
        pagamentosExistentes = []
    ) {
        if (!Array.isArray(pagamentosExistentes)) {
            setPagamentos([]);
            setValorRecebimento("");
            return;
        }

        const pagamentosNormalizados =
            pagamentosExistentes
                .map((pagamento) => {
                    const forma = encontrarForma(
                        pagamento.formaPagamentoId ??
                            pagamento.formaPagamento?.id
                    );

                    if (!forma) {
                        return null;
                    }

                    return {
                        formaPagamentoId:
                            Number(forma.id),
                        valor:
                            Number(pagamento.valor) || 0,
                        atalho: forma.atalho,
                        descricao:
                            forma.descricao ||
                            forma.nome ||
                            "",
                        existente: true
                    };
                })
                .filter(
                    (pagamento) =>
                        pagamento &&
                        pagamento.valor > 0
                );

        setPagamentos(pagamentosNormalizados);
        setValorRecebimento("");
    }

    return {
        formasPagamento: formas,
        pagamentos,
        totalPagamentos,
        restante,
        troco,
        valorRecebimento,

        pagamentoCompleto:
            totalPagamentos >= totalVenda &&
            totalVenda > 0,

        adicionarPagamentoPorAtalho,
        alterarPagamento,
        removerPagamento,
        limparPagamentos,
        definirValorRecebimento,
        carregarPagamentos
    };
}

export default useMiniPdvPagamentos;
