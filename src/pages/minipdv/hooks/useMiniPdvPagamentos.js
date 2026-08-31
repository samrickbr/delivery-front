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
    return {
        ...forma,
        id: Number(forma.id),
        atalho: obterAtalho(forma.descricao),
        disponivel: obterAtalho(forma.descricao) !== "K"
    };
}

function useMiniPdvPagamentos(valorVenda = 0, formasPagamento = []) {
    const [pagamentos, setPagamentos] = useState([]);
    const [valorRecebimento, setValorRecebimento] = useState("");

    const formas = Array.isArray(formasPagamento) ? formasPagamento.map(normalizarFormaPagamento) : [];

    const totalVenda = Number(valorVenda) || 0;

    const totalPagamentos = pagamentos.reduce((total, pagamento) => total + (Number(pagamento.valor) || 0), 0);

    const restante = Math.max(totalVenda - totalPagamentos, 0);

    const possuiDinheiro = pagamentos.some((pagamento) => pagamento.atalho === "D");

    const troco = possuiDinheiro && totalPagamentos > totalVenda ? totalPagamentos - totalVenda : 0;

    function encontrarForma(formaPagamentoId) {
        const id = Number(formaPagamentoId);

        return formas.find((forma) => Number(forma.id) === id);
    }

    function adicionarPagamento(formaPagamentoId, valor) {
        const id = Number(formaPagamentoId);
        const valorNumerico = Number(valor);

        if (!id || valorNumerico <= 0) {
            return false;
        }

        const forma = encontrarForma(id);

        if (!forma || !forma.disponivel) {
            return false;
        }

        setPagamentos((atuais) => [
            ...atuais,
            {
                formaPagamentoId: id,
                valor: valorNumerico,
                atalho: forma.atalho
            }
        ]);

        return true;
    }

    function adicionarPagamentoPorAtalho(atalho) {
        const codigo = String(atalho || "")
            .trim()
            .toUpperCase();

        const forma = formas.find((item) => item.atalho === codigo && item.disponivel);

        if (!forma) {
            return false;
        }

        const valor = Number(valorRecebimento);

        if (valor <= 0) {
            return false;
        }

        const sucesso = adicionarPagamento(forma.id, valor);

        if (sucesso) {
            setValorRecebimento("");
        }

        return sucesso;
    }

    function alterarPagamento(indice, formaPagamentoId, valor) {
        const id = Number(formaPagamentoId);
        const valorNumerico = Number(valor);

        if (!id || valorNumerico <= 0) {
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
                          atalho: forma.atalho
                      }
                    : pagamento
            )
        );
    }

    function removerPagamento(indice) {
        setPagamentos((atuais) => atuais.filter((_, index) => index !== indice));
    }

    function limparPagamentos() {
        setPagamentos([]);
        setValorRecebimento("");
    }

    function definirValorRecebimento(valor) {
        setValorRecebimento(valor);
    }

    function obterPagamentosParaEnvio() {
        let restanteParaEnviar = totalVenda;

        return pagamentos
            .map((pagamento) => {
                const valor = Number(pagamento.valor) || 0;

                if (restanteParaEnviar <= 0) {
                    return null;
                }

                const valorParaEnviar = Math.min(valor, restanteParaEnviar);

                restanteParaEnviar -= valorParaEnviar;

                return {
                    formaPagamentoId: Number(pagamento.formaPagamentoId),
                    valor: valorParaEnviar
                };
            })
            .filter(Boolean);
    }

    const pagamentoCompleto = totalPagamentos >= totalVenda && totalVenda > 0;

    return {
        formasPagamento: formas,
        pagamentos,
        totalPagamentos,
        restante,
        troco,
        valorRecebimento,
        pagamentoCompleto,
        adicionarPagamento,
        adicionarPagamentoPorAtalho,
        alterarPagamento,
        removerPagamento,
        limparPagamentos,
        definirValorRecebimento,
        obterPagamentosParaEnvio
    };
}

export default useMiniPdvPagamentos;
