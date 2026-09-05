import { useState } from "react";
import { criarPedido } from "../../../../services/pedidoService";
import { montarPedido } from "../checkoutPayload";
import { CAMPOS_CHECKOUT } from "../checkoutCampos";

export function useCheckoutSubmit({
    cliente,
    carrinho,
    setCarrinho,
    pagamentos,
    formasPagamento,
    tipoRecebimento,
    enderecoSelecionado,
    valorTotal,
    totalPagamentos,
    observacao,
    setObservacao,
    setErro,
    setPedidoPreparado
}) {
    const [enviando, setEnviando] = useState(false);

    function possuiPagamentoEmDinheiro() {
        return pagamentos.some((pagamento) => {
            const forma = formasPagamento.find((item) => Number(item.id) === Number(pagamento.formaPagamentoId));

            const nomeForma = forma?.descricao || forma?.nome || "";

            return nomeForma.trim().toLowerCase() === "dinheiro";
        });
    }

    function solicitarTroco(total) {
        const precisaTroco = window.confirm("Você precisa de troco?");

        if (!precisaTroco) {
            return "Cliente não solicitou troco.";
        }

        const valorTroco = window.prompt(
            `Troco para quanto?\nValor do pedido: R$ ${total.toFixed(2).replace(".", ",")}`
        );

        if (valorTroco === null) {
            return null;
        }

        const valor = Number(String(valorTroco).replace(/\./g, "").replace(",", "."));

        if (!Number.isFinite(valor) || valor <= total) {
            window.alert("Informe um valor maior que o total do pedido para calcular o troco.");

            return null;
        }

        const valorFormatado = valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

        return `Levar troco para ${valorFormatado}.`;
    }

    function adicionarObservacaoTroco(textoTroco) {
        const observacaoAtual = observacao.trim();

        return observacaoAtual ? `${observacaoAtual} ${textoTroco}` : textoTroco;
    }

    async function prepararCheckout() {
        setErro("");

        if (!cliente?.nome) {
            setErro("Cliente não identificado.", CAMPOS_CHECKOUT.CLIENTE);
            return;
        }

        if (!carrinho?.length) {
            setErro("O carrinho está vazio.", CAMPOS_CHECKOUT.CARRINHO);
            return;
        }

        if (!pagamentos?.length) {
            setErro("Selecione o tipo de recebimento.", CAMPOS_CHECKOUT.PAGAMENTO);
            return;
        }

        if (!tipoRecebimento) {
            setErro("Selecione o tipo de entrega ou retirada.", CAMPOS_CHECKOUT.TIPO_RECEBIMENTO);
            return;
        }

        if (tipoRecebimento === "ENTREGA" && !enderecoSelecionado) {
            setErro("Selecione um endereço para entrega.", CAMPOS_CHECKOUT.ENDERECO);
            return;
        }

        const total = Number(valorTotal || 0);
        const pago = Number(totalPagamentos || 0);

        if (Math.abs(pago - total) > 0.01) {
            setErro("O pagamento precisa corresponder ao valor total do pedido.", CAMPOS_CHECKOUT.VALOR_PAGAMENTO);
            return;
        }

        let observacaoFinal = observacao;

        /*
         * A pergunta de troco acontece somente aqui,
         * no momento da confirmação do pedido.
         */
        if (possuiPagamentoEmDinheiro()) {
            const textoTroco = solicitarTroco(total);

            if (textoTroco === null) {
                return;
            }

            observacaoFinal = adicionarObservacaoTroco(textoTroco);
        }

        /*
         * O Core recebe sempre o valor exato do pedido.
         * O eventual valor entregue pelo cliente para gerar
         * troco fica somente na observação.
         */
        const pagamentosFinais = pagamentos.map((pagamento) => ({
            formaPagamentoId: Number(pagamento.formaPagamentoId),
            valor: total
        }));

        const pedido = montarPedido({
            cliente,
            observacao: observacaoFinal,
            pagamentos: pagamentosFinais,
            tipoRecebimento,
            enderecoSelecionado,
            carrinho
        });

        try {
            setEnviando(true);

            const response = await criarPedido(pedido);

            setObservacao(observacaoFinal);
            setPedidoPreparado(response.data);

            sessionStorage.removeItem("carrinho");
            setCarrinho([]);

            window.dispatchEvent(new Event("carrinhoAtualizado"));
        } catch (error) {
            setErro(error?.response?.data?.message || "Não foi possível enviar o pedido. Tente novamente.");
        } finally {
            setEnviando(false);
        }
    }

    return {
        prepararCheckout,
        enviando
    };
}
