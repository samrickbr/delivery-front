import { useState } from "react";

import { useCheckoutCarrinho } from "./checkout/hooks/useCheckoutCarrinho";
import { useCheckoutPagamentos } from "./checkout/hooks/useCheckoutPagamentos";
import { useCheckoutRecebimento } from "./checkout/hooks/useCheckoutRecebimento";
import { useCheckoutValores } from "./checkout/hooks/useCheckoutValores";
import { useCheckoutObservacao } from "./checkout/hooks/useCheckoutObservacao";
import { useCheckoutErro } from "./checkout/hooks/useCheckoutErro";
import { useCheckoutSubmit } from "./checkout/hooks/useCheckoutSubmit";
import { useCheckoutCliente } from "./checkout/hooks/useCheckoutCliente";

import CheckoutContent from "./checkout/components/CheckoutContent";
import EnderecoModal from "./checkout/components/EnderecoModal";

function Checkout() {
    const [pedidoPreparado, setPedidoPreparado] = useState(null);
    const [enderecoModalAberto, setEnderecoModalAberto] = useState(false);

    const { cliente, enderecos, carregando: carregandoCliente, erro: erroCliente, recarregar } = useCheckoutCliente();

    const { observacao, setObservacao } = useCheckoutObservacao();

    const { erro, setErro } = useCheckoutErro();

    const { carrinho, valorProdutos } = useCheckoutCarrinho();

    const { pagamentos, totalPagamentos, adicionarPagamento, alterarPagamento, confirmarPagamento, removerPagamento } =
        useCheckoutPagamentos();

    const { tipoRecebimento, enderecoSelecionado, setEnderecoSelecionado, selecionarTipoRecebimento } =
        useCheckoutRecebimento(enderecos);

    const { taxaEntrega, valorTotal, diferencaPagamento } = useCheckoutValores({
        tipoRecebimento,
        valorProdutos,
        totalPagamentos
    });

    const { prepararCheckout } = useCheckoutSubmit({
        cliente: cliente || {},
        carrinho,
        pagamentos,
        tipoRecebimento,
        enderecoSelecionado,
        valorTotal,
        totalPagamentos,
        observacao,
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

    const erroAtual = erroCliente || erro;

    return (
        <>
            <CheckoutContent
                erro={erroAtual}
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
                totalPagamentos={totalPagamentos}
                diferencaPagamento={diferencaPagamento}
                observacao={observacao}
                pedidoPreparado={pedidoPreparado}
                onTipoRecebimento={selecionarTipoRecebimento}
                onEndereco={setEnderecoSelecionado}
                onAdicionarPagamento={adicionarPagamento}
                onAlterarPagamento={alterarPagamento}
                onConfirmarPagamento={confirmarPagamento}
                onRemoverPagamento={removerPagamento}
                onObservacao={setObservacao}
                onPrepararCheckout={prepararCheckout}
                onNovoEndereco={abrirNovoEndereco}
            />

            <EnderecoModal aberto={enderecoModalAberto} onFechar={fecharEnderecoModal} onSalvo={tratarEnderecoSalvo} />
        </>
    );
}

export default Checkout;
