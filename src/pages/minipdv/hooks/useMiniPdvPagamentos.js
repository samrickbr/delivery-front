import { useState } from "react";

function normalizarDescricao(descricao) {
    return String(descricao || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toUpperCase();
}

/**
 * Resolve atalho a partir da descrição real retornada pelo Core.
 * Não hardcoda IDs — apenas mapeia descrição → tecla.
 */
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

        if (!id || !Number.isFinite(valorNumerico) || valorNumerico <= 0) {
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
                atalho: forma.atalho,
                descricao: forma.descricao || forma.nome || ""
            }
        ]);

        return true;
    }

    /**
     * Adiciona pagamento pelo atalho D/P/C.
     *
     * Permite múltiplos pagamentos.
     *
     * O excedente só é permitido quando o pagamento
     * excedente for em DINHEIRO, pois representa troco.
     */
    function adicionarPagamentoPorAtalho(atalho, valorOpcional) {
        const codigo = String(atalho || "")
            .trim()
            .toUpperCase();

        const forma = formas.find((item) => item.atalho === codigo && item.disponivel);

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

        /*
         * PIX e CARTÃO não podem gerar excedente.
         *
         * DINHEIRO pode exceder o restante porque
         * o excedente será tratado como troco.
         */
        if (!eDinheiro && valor > restante) {
            return {
                sucesso: false,
                mensagem: "O valor informado excede o valor restante da venda."
            };
        }

        const novo = {
            formaPagamentoId: Number(forma.id),
            valor,
            atalho: forma.atalho,
            descricao: forma.descricao || forma.nome || ""
        };

        const proximos = [...pagamentos, novo];

        const totalProximos = proximos.reduce((total, pagamento) => total + (Number(pagamento.valor) || 0), 0);

        setPagamentos(proximos);
        setValorRecebimento("");

        const possuiDinheiroProximo = proximos.some((pagamento) => pagamento.atalho === "D");

        const trocoCalc = possuiDinheiroProximo && totalProximos > totalVenda ? totalProximos - totalVenda : 0;

        return {
            sucesso: true,
            pagamentos: proximos,
            totalPagamentos: totalProximos,
            pagamentoCompleto: totalProximos >= totalVenda && totalVenda > 0,
            troco: trocoCalc
        };
    }

    function alterarPagamento(indice, formaPagamentoId, valor) {
        const id = Number(formaPagamentoId);
        const valorNumerico = Number(valor);

        if (!id || !Number.isFinite(valorNumerico) || valorNumerico <= 0) {
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
                          descricao: forma.descricao || forma.nome || ""
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

    /**
     * Monta os pagamentos para envio ao Core.
     *
     * O total enviado deve ser exatamente o valor da venda.
     *
     * Se houver excedente:
     * - pagamentos não monetários permanecem integrais;
     * - o excedente é abatido exclusivamente do DINHEIRO;
     * - o valor abatido representa o troco;
     * - o troco nunca é enviado ao Core.
     */
    function obterPagamentosParaEnvio() {
        const excedente = Math.max(totalPagamentos - totalVenda, 0);

        let excedenteRestante = excedente;

        return pagamentos
            .map((pagamento) => {
                const valor = Number(pagamento.valor) || 0;

                if (valor <= 0) {
                    return null;
                }

                let valorParaEnviar = valor;

                if (pagamento.atalho === "D" && excedenteRestante > 0) {
                    const abatimento = Math.min(valor, excedenteRestante);

                    valorParaEnviar = valor - abatimento;

                    excedenteRestante -= abatimento;
                }

                if (valorParaEnviar <= 0) {
                    return null;
                }

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
