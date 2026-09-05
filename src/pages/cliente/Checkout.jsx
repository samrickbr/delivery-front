import { useEffect, useState } from "react";

import { useCheckoutCarrinho } from "./checkout/hooks/useCheckoutCarrinho";
import { useCheckoutPagamentos } from "./checkout/hooks/useCheckoutPagamentos";
import { useCheckoutRecebimento } from "./checkout/hooks/useCheckoutRecebimento";
import { useCheckoutValores } from "./checkout/hooks/useCheckoutValores";
import { useCheckoutObservacao } from "./checkout/hooks/useCheckoutObservacao";
import { useCheckoutErro } from "./checkout/hooks/useCheckoutErro";
import { useCheckoutSubmit } from "./checkout/hooks/useCheckoutSubmit";
import { useCheckoutCliente } from "./checkout/hooks/useCheckoutCliente";
import { useCheckoutFormasPagamento } from "./checkout/hooks/useCheckoutFormasPagamento";
import { buscarTaxaEntrega } from "../../services/configuracaoService";

import CheckoutContent from "./checkout/components/CheckoutContent";
import EnderecoModal from "./checkout/components/EnderecoModal";

function Checkout() {
    const [pedidoPreparado, setPedidoPreparado] = useState(null);
    const [enderecoModalAberto, setEnderecoModalAberto] = useState(false);

    const [taxaEntregaConfigurada, setTaxaEntregaConfigurada] = useState(null);
    const [carregandoTaxaEntrega, setCarregandoTaxaEntrega] = useState(false);

    const { cliente, enderecos, carregando: carregandoCliente, erro: erroCliente, recarregar } = useCheckoutCliente();

    const { observacao, setObservacao } = useCheckoutObservacao();

    const { erro, setErro, versaoErro } = useCheckoutErro();

    const { carrinho, setCarrinho, valorProdutos } = useCheckoutCarrinho();

    const { pagamentos, totalPagamentos, selecionarFormaPagamento, removerPagamento } = useCheckoutPagamentos();

    const {
        formasPagamento,
        carregando: carregandoFormasPagamento,
        erro: erroFormasPagamento
    } = useCheckoutFormasPagamento();

    const { tipoRecebimento, enderecoSelecionado, setEnderecoSelecionado, selecionarTipoRecebimento } =
        useCheckoutRecebimento(enderecos);

    useEffect(() => {
        if (tipoRecebimento !== "ENTREGA" || !enderecoSelecionado) {
            return;
        }

        let ativo = true;

        async function carregarTaxa() {
            setCarregandoTaxaEntrega(true);

            try {
                const response = await buscarTaxaEntrega();

                if (ativo) {
                    setTaxaEntregaConfigurada(Number(response.data));
                }
            } catch {
                if (ativo) {
                    setTaxaEntregaConfigurada(null);
                    setErro("Não foi possível consultar a taxa de entrega.");
                }
            } finally {
                if (ativo) {
                    setCarregandoTaxaEntrega(false);
                }
            }
        }

        carregarTaxa();

        return () => {
            ativo = false;
        };
    }, [tipoRecebimento, enderecoSelecionado, setErro]);

    const { taxaEntrega, valorTotal } = useCheckoutValores({
        tipoRecebimento,
        valorProdutos,
        taxaEntregaConfigurada
    });

    const { prepararCheckout, enviando } = useCheckoutSubmit({
        cliente: cliente || {},
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
    });

    async function tratarEnderecoSalvo(endereco) {
        await recarregar();

        if (endereco?.id) {
            setEnderecoSelecionado(String(endereco.id));
        }
    }

    function abrirNovoEndereco() {
        setEnderecoModalAberto(true);
    }

    function fecharEnderecoModal() {
        setEnderecoModalAberto(false);
    }

    function tratarFormaPagamento(formaPagamentoId) {
        selecionarFormaPagamento(formaPagamentoId, valorTotal);
    }

    const erroAtual = erroCliente || erro;

    return (
        <>
            <CheckoutContent
                erro={erroAtual}
                versaoErro={erroCliente ? erroCliente : versaoErro}
                cliente={cliente || {}}
                carrinho={carrinho}
                tipoRecebimento={tipoRecebimento}
                enderecoSelecionado={enderecoSelecionado}
                enderecos={enderecos}
                carregandoCliente={carregandoCliente}
                valorProdutos={valorProdutos}
                taxaEntrega={taxaEntrega}
                valorTotal={valorTotal}
                pagamentos={pagamentos}
                formasPagamento={formasPagamento}
                carregandoFormasPagamento={carregandoFormasPagamento}
                erroFormasPagamento={erroFormasPagamento}
                observacao={observacao}
                pedidoPreparado={pedidoPreparado}
                onTipoRecebimento={selecionarTipoRecebimento}
                onEndereco={setEnderecoSelecionado}
                onSelecionarFormaPagamento={tratarFormaPagamento}
                onRemoverPagamento={removerPagamento}
                onObservacao={setObservacao}
                onPrepararCheckout={prepararCheckout}
                onNovoEndereco={abrirNovoEndereco}
                enviando={enviando}
                carregandoTaxaEntrega={carregandoTaxaEntrega}
            />

            <EnderecoModal aberto={enderecoModalAberto} onFechar={fecharEnderecoModal} onSalvo={tratarEnderecoSalvo} />
        </>
    );
}

export default Checkout;
