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
    enderecos,
    carregandoCliente,
    valorProdutos,
    taxaEntrega,
    valorTotal,
    pagamentos,
    totalPagamentos,
    observacao,
    pedidoPreparado,
    formasPagamento,
    carregandoFormasPagamento,
    erroFormasPagamento,
    onTipoRecebimento,
    onEndereco,
    onSelecionarFormaPagamento,
    onAlterarPagamento,
    onConfirmarPagamento,
    onRemoverPagamento,
    onObservacao,
    onPrepararCheckout,
    onNovoEndereco
}) {
    return (
        <>
            <CheckoutHeader />

            <CheckoutErro erro={erro} />

            {pedidoPreparado && (
                <div className="alert alert-success" role="alert">
                    <strong className="d-block mb-1">Checkout validado</strong>

                    <span className="small">
                        O payload do pedido foi preparado localmente. O envio definitivo será conectado na próxima
                        microetapa.
                    </span>
                </div>
            )}

            <div className="row g-2 align-items-start">
                <div className="col-12 col-lg-8">
                    <div className="d-flex flex-column gap-2">
                        <ClienteResumo cliente={cliente} />

                        <PedidoItens carrinho={carrinho} />

                        <TipoRecebimento
                            tipoRecebimento={tipoRecebimento}
                            onChange={onTipoRecebimento}
                            disabled={carregandoCliente}
                        />

                        {tipoRecebimento === TIPOS_RECEBIMENTO.ENTREGA && (
                            <EnderecoEntrega
                                enderecos={enderecos}
                                enderecoSelecionado={enderecoSelecionado}
                                onChange={onEndereco}
                                disabled={carregandoCliente}
                                carregando={carregandoCliente}
                                onNovoEndereco={onNovoEndereco}
                            />
                        )}

                        {tipoRecebimento === TIPOS_RECEBIMENTO.RETIRADA && (
                            <section className="card border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <div
                                            className="d-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-circle"
                                            style={{
                                                width: "48px",
                                                height: "48px",
                                                flexShrink: 0
                                            }}
                                            aria-hidden="true"
                                        >
                                            🏪
                                        </div>

                                        <div>
                                            <h2 className="h5 mb-1">Retirada no local</h2>

                                            <p className="text-muted small mb-0">
                                                Seu pedido ficará disponível para retirada neste endereço.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border rounded-3 p-3 bg-light">
                                        <div className="fw-semibold">Rota da Casa</div>

                                        <div className="text-muted">Avenida Ivo Jangada, 348</div>

                                        <div className="text-muted">Centro — Imbaú/PR</div>
                                    </div>
                                </div>
                            </section>
                        )}

                        <Pagamentos
                            formasPagamento={formasPagamento}
                            carregando={carregandoFormasPagamento}
                            erro={erroFormasPagamento}
                            pagamentos={pagamentos}
                            valorTotal={valorTotal}
                            onSelecionarForma={onSelecionarFormaPagamento}
                            onAlterarValor={onAlterarPagamento}
                            onConfirmar={onConfirmarPagamento}
                            onRemover={onRemoverPagamento}
                        />

                        <Observacao value={observacao} onChange={onObservacao} disabled={carregandoCliente} />
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
                            enviando={false}
                            disabled={carregandoCliente || carrinho.length === 0}
                            onClick={onPrepararCheckout}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default CheckoutContent;
