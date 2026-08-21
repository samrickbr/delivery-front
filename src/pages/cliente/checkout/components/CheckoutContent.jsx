import { TIPOS_RECEBIMENTO } from "../checkoutUtils";

import CheckoutHeader from "./CheckoutHeader";
import CheckoutErro from "./CheckoutErro";
import ClienteResumo from "./ClienteResumo";
import PedidoItens from "./PedidoItens";
import TipoRecebimento from "./TipoRecebimento";
import EnderecoEntrega from "./EnderecoEntrega";
import ResumoValores from "./ResumoValores";
import Pagamentos from "./Pagamentos";
import Observacao from "./Observacao";
import ResumoFinal from "./ResumoFinal";
import CheckoutButton from "./CheckoutButton";

function CheckoutContent({
    erro,
    cliente,
    carrinho,
    tipoRecebimento,
    enderecoSelecionado,
    valorProdutos,
    taxaEntrega,
    valorTotal,
    pagamentos,
    totalPagamentos,
    diferencaPagamento,
    observacao,
    enviando,
    onTipoRecebimento,
    onEndereco,
    onAdicionarPagamento,
    onAlterarPagamento,
    onConfirmarPagamento,
    onRemoverPagamento,
    onObservacao,
    onPrepararCheckout
}) {
    return (
        <>
            <CheckoutHeader />

            <CheckoutErro erro={erro} />

            <div className="row g-2 align-items-start">
                <div className="col-12 col-lg-8">
                    <div className="d-flex flex-column gap-2">
                        <ClienteResumo cliente={cliente} />

                        <PedidoItens carrinho={carrinho} />

                        <TipoRecebimento
                            tipoRecebimento={tipoRecebimento}
                            onChange={onTipoRecebimento}
                            disabled={enviando}
                        />

                        {tipoRecebimento === TIPOS_RECEBIMENTO.ENTREGA && (
                            <EnderecoEntrega
                                enderecoSelecionado={enderecoSelecionado}
                                onChange={onEndereco}
                                disabled={enviando}
                            />
                        )}

                        <Pagamentos
                            pagamentos={pagamentos}
                            totalPagamentos={totalPagamentos}
                            diferencaPagamento={diferencaPagamento}
                            onAdicionar={onAdicionarPagamento}
                            onAlterar={onAlterarPagamento}
                            onConfirmar={onConfirmarPagamento}
                            onRemover={onRemoverPagamento}
                            disabled={enviando}
                        />

                        <Observacao value={observacao} onChange={onObservacao} disabled={enviando} />
                    </div>
                </div>

                <div className="col-12 col-lg-4">
                    <div className="d-flex flex-column gap-2 sticky-lg-top" style={{ top: "1rem" }}>
                        <ResumoValores
                            valorProdutos={valorProdutos}
                            taxaEntrega={taxaEntrega}
                            valorTotal={valorTotal}
                        />

                        <ResumoFinal
                            cliente={cliente}
                            tipoRecebimento={tipoRecebimento}
                            enderecoSelecionado={enderecoSelecionado}
                            valorTotal={valorTotal}
                            totalPagamentos={totalPagamentos}
                        />

                        <CheckoutButton
                            enviando={enviando}
                            disabled={carrinho.length === 0}
                            onClick={onPrepararCheckout}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default CheckoutContent;
