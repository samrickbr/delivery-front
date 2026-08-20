import { obterCliente } from "./checkout/clienteUtils";

import { useCheckoutCarrinho } from "./checkout/hooks/useCheckoutCarrinho";
import { useCheckoutPagamentos } from "./checkout/hooks/useCheckoutPagamentos";
import { useCheckoutRecebimento } from "./checkout/hooks/useCheckoutRecebimento";
import { useCheckoutValores } from "./checkout/hooks/useCheckoutValores";
import { useCheckoutObservacao } from "./checkout/hooks/useCheckoutObservacao";
import { useCheckoutEnvio } from "./checkout/hooks/useCheckoutEnvio";
import { useCheckoutErro } from "./checkout/hooks/useCheckoutErro";
import { useCheckoutSubmit } from "./checkout/hooks/useCheckoutSubmit";

import PedidoSucesso from "./checkout/components/PedidoSucesso";
import CheckoutContent from "./checkout/components/CheckoutContent";

function Checkout() {
    const cliente = obterCliente();

    const { observacao, setObservacao } = useCheckoutObservacao();

    const { erro, setErro } = useCheckoutErro();

    const { enviando, setEnviando, pedidoCriado, setPedidoCriado } = useCheckoutEnvio();

    const { carrinho, setCarrinho, valorProdutos } = useCheckoutCarrinho();

    const { pagamentos, totalPagamentos, adicionarPagamento, alterarPagamento, confirmarPagamento, removerPagamento } =
        useCheckoutPagamentos();

    const { tipoRecebimento, enderecoSelecionado, setEnderecoSelecionado, selecionarTipoRecebimento } =
        useCheckoutRecebimento();

    const { taxaEntrega, valorTotal, diferencaPagamento } = useCheckoutValores({
        tipoRecebimento,
        valorProdutos,
        totalPagamentos
    });

    const { prepararCheckout } = useCheckoutSubmit({
        cliente,
        carrinho,
        pagamentos,
        tipoRecebimento,
        enderecoSelecionado,
        valorTotal,
        totalPagamentos,
        observacao,
        enviando,
        setErro,
        setEnviando,
        setPedidoCriado,
        setCarrinho
    });

    /*PEDIDO CRIADO*/
    if (pedidoCriado) {
        return <PedidoSucesso pedido={pedidoCriado} />;
    }

    return (
        <CheckoutContent
            erro={erro}
            cliente={cliente}
            carrinho={carrinho}
            tipoRecebimento={tipoRecebimento}
            enderecoSelecionado={enderecoSelecionado}
            valorProdutos={valorProdutos}
            taxaEntrega={taxaEntrega}
            valorTotal={valorTotal}
            pagamentos={pagamentos}
            totalPagamentos={totalPagamentos}
            diferencaPagamento={diferencaPagamento}
            observacao={observacao}
            enviando={enviando}
            onTipoRecebimento={selecionarTipoRecebimento}
            onEndereco={setEnderecoSelecionado}
            onAdicionarPagamento={adicionarPagamento}
            onAlterarPagamento={alterarPagamento}
            onConfirmarPagamento={confirmarPagamento}
            onRemoverPagamento={removerPagamento}
            onObservacao={setObservacao}
            onPrepararCheckout={prepararCheckout}
        />
    );
}

export default Checkout;
