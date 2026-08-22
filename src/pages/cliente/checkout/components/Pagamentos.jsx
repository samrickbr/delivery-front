function formatarValor(valor) {
    return `R$ ${Number(valor || 0)
        .toFixed(2)
        .replace(".", ",")}`;
}

function Pagamentos({
    formasPagamento,
    carregando,
    erro,
    pagamentos,
    valorTotal,
    onSelecionarForma,
    onAlterarValor,
    onConfirmar,
    onRemover
}) {
    const totalPago = pagamentos.reduce((total, pagamento) => {
        return total + (Number(pagamento.valor) || 0);
    }, 0);

    const diferenca = valorTotal === null ? null : Number(valorTotal) - totalPago;
    const falta = diferenca !== null && diferenca > 0 ? diferenca : 0;
    const troco = diferenca !== null && diferenca < 0 ? Math.abs(diferenca) : 0;

    const formasSelecionadas = pagamentos.map((pagamento) => Number(pagamento.formaPagamentoId));

    function adicionarForma(event) {
        const formaPagamentoId = Number(event.target.value);

        if (!formaPagamentoId) {
            return;
        }

        onSelecionarForma(formaPagamentoId);
    }

    function alterarValor(index, event) {
        onAlterarValor(index, event.target.value);
    }

    function confirmar(index) {
        onConfirmar(index);
    }

    return (
        <section className="card border-0 shadow-sm mb-3">
            <div className="card-body py-3">
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 className="fw-semibold mb-0">Pagamento</h5>

                    {valorTotal !== null && (
                        <div className="d-flex align-items-center gap-3 small">
                            <span className="text-muted">
                                Total: <strong>{formatarValor(valorTotal)}</strong>
                            </span>

                            <span className="text-muted">
                                Pago: <strong>{formatarValor(totalPago)}</strong>
                            </span>

                            {falta > 0 && (
                                <span className="text-danger fw-semibold">Falta: {formatarValor(falta)}</span>
                            )}

                            {troco > 0 && (
                                <span className="text-success fw-semibold">Troco: {formatarValor(troco)}</span>
                            )}
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
                    <>
                        {pagamentos.length > 0 && (
                            <div className="d-flex flex-column gap-2 mb-3">
                                {pagamentos.map((pagamento, index) => {
                                    const forma = formasPagamento.find(
                                        (item) => Number(item.id) === Number(pagamento.formaPagamentoId)
                                    );

                                    return (
                                        <div
                                            key={`${pagamento.formaPagamentoId}-${index}`}
                                            className="border rounded-3 px-3 py-2"
                                        >
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="flex-grow-1">
                                                    <div className="fw-semibold">
                                                        {forma?.descricao || "Forma de pagamento"}
                                                    </div>
                                                </div>

                                                <div
                                                    className="input-group input-group-sm"
                                                    style={{ maxWidth: "150px" }}
                                                >
                                                    <span className="input-group-text">R$</span>

                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        min="0.01"
                                                        step="0.01"
                                                        value={pagamento.valor ?? ""}
                                                        onChange={(event) => alterarValor(index, event)}
                                                        aria-label={`Valor do pagamento ${forma?.descricao || ""}`}
                                                    />
                                                </div>

                                                <button
                                                    type="button"
                                                    className="btn btn-success btn-sm"
                                                    disabled={!pagamento.valor}
                                                    onClick={() => confirmar(index)}
                                                >
                                                    {pagamento.confirmado ? "Confirmado" : "Confirmar"}
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => onRemover(index)}
                                                    title="Remover pagamento"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className="d-flex align-items-center gap-2">
                            <label htmlFor="nova-forma-pagamento" className="form-label mb-0 fw-semibold">
                                Adicionar forma:
                            </label>

                            <select
                                id="nova-forma-pagamento"
                                className="form-select form-select-sm"
                                style={{ maxWidth: "240px" }}
                                value=""
                                onChange={adicionarForma}
                            >
                                <option value="">Selecione...</option>

                                {formasPagamento
                                    .filter((forma) => !formasSelecionadas.includes(Number(forma.id)))
                                    .map((forma) => (
                                        <option key={forma.id} value={forma.id}>
                                            {forma.descricao}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        {pagamentos.length === 0 && (
                            <div className="text-muted small mt-2">Adicione uma forma de pagamento para continuar.</div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}

export default Pagamentos;
