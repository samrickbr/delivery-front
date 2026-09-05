import { CAMPOS_CHECKOUT } from "../checkoutCampos";
import { useCampoErro } from "../hooks/useCampoErro";

function formatarValor(valor) {
    return `R$ ${Number(valor || 0)
        .toFixed(2)
        .replace(".", ",")}`;
}

function Pagamentos({ formasPagamento, carregando, erro, pagamentos, valorTotal, onSelecionarForma, campoErro, versaoErro }) {
    const { ref, comErro, animando } = useCampoErro({
        campos: [CAMPOS_CHECKOUT.PAGAMENTO, CAMPOS_CHECKOUT.VALOR_PAGAMENTO],
        campoErro,
        versaoErro
    });

    const formasSelecionadas = pagamentos.map((pagamento) => Number(pagamento.formaPagamentoId));

    const totalSelecionado = pagamentos.length > 0 ? Number(valorTotal) || 0 : 0;

    return (
        <section
            ref={ref}
            tabIndex="-1"
            className="card border-0 shadow-sm mb-3"
            style={{
                outline: comErro ? "2px solid var(--bs-danger)" : "2px solid transparent",
                boxShadow: animando ? "0 0 0 0.25rem rgba(var(--bs-danger-rgb), 0.18)" : "none",
                transition: "outline-color 150ms ease, box-shadow 150ms ease"
            }}
        >
            <div className="card-body py-3">
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 className="fw-semibold mb-0">Pagamento</h5>

                    {valorTotal !== null && (
                        <div className="small text-muted">
                            Total: <strong>{formatarValor(valorTotal)}</strong>
                        </div>
                    )}
                </div>

                {carregando && (
                    <div className="d-flex align-items-center text-muted small py-2">
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                        Carregando formas de pagamento...
                    </div>
                )}

                {!carregando && erro && (
                    <div className="alert alert-danger py-2 mb-0" role="alert">
                        {erro}
                    </div>
                )}

                {!carregando && !erro && formasPagamento.length === 0 && (
                    <div className="alert alert-warning py-2 mb-0" role="alert">
                        Nenhuma forma de pagamento está disponível no momento.
                    </div>
                )}

                {!carregando && !erro && formasPagamento.length > 0 && (
                    <div className="d-flex flex-column gap-2">
                        {formasPagamento.map((forma) => {
                            const selecionada = formasSelecionadas.includes(Number(forma.id));

                            return (
                                <label
                                    key={forma.id}
                                    className={`border rounded-3 px-3 py-3 d-flex align-items-center gap-3 ${
                                        selecionada ? "border-primary bg-light" : ""
                                    }`}
                                    style={{ cursor: "pointer" }}
                                >
                                    <input
                                        type="checkbox"
                                        className="form-check-input mt-0"
                                        checked={selecionada}
                                        onChange={() => onSelecionarForma(forma.id)}
                                    />

                                    <span className="fw-semibold">{forma.descricao}</span>

                                    {selecionada && (
                                        <span className="ms-auto text-success small fw-semibold">Selecionado</span>
                                    )}
                                </label>
                            );
                        })}

                        {pagamentos.length === 0 && (
                            <div className="text-muted small mt-2">
                                Selecione uma forma de pagamento para continuar.
                            </div>
                        )}

                        {pagamentos.length > 0 && (
                            <div className="alert alert-info py-2 mt-2 mb-0">
                                Valor do pedido: <strong>{formatarValor(totalSelecionado)}</strong>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}

export default Pagamentos;
