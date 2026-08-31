function MiniPdvPagamentos({
    formasPagamento = [],
    pagamentos = [],
    onAdicionarPagamento,
    onAlterarPagamento,
    onRemoverPagamento
}) {
    function obterForma(formaPagamentoId) {
        return formasPagamento.find(
            (forma) =>
                Number(forma.id) === Number(formaPagamentoId)
        );
    }

    function adicionarForma(forma) {
        if (!forma?.id || !forma.disponivel) {
            return;
        }

        onAdicionarPagamento(forma.id, 0);
    }

    function alterarValor(indice, valor) {
        const pagamento = pagamentos[indice];

        if (!pagamento?.formaPagamentoId) {
            return;
        }

        onAlterarPagamento(
            indice,
            pagamento.formaPagamentoId,
            valor
        );
    }

    return (
        <div className="card border-0 shadow-sm">
            <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                        <h2 className="h6 mb-1">
                            Pagamentos
                        </h2>

                        <small className="text-muted">
                            Selecione a forma de pagamento
                        </small>
                    </div>
                </div>

                <div className="d-flex flex-wrap gap-2 mb-3">
                    {formasPagamento.map((forma) => (
                        <button
                            key={forma.id}
                            type="button"
                            className="btn btn-outline-primary"
                            disabled={!forma.disponivel}
                            onClick={() =>
                                adicionarForma(forma)
                            }
                        >
                            {forma.atalho && (
                                <strong className="me-1">
                                    ({forma.atalho})
                                </strong>
                            )}

                            {forma.descricao}

                            {!forma.disponivel && (
                                <span className="ms-1">
                                    — indisponível
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {pagamentos.length > 0 && (
                    <div className="d-flex flex-column gap-2">
                        {pagamentos.map(
                            (pagamento, indice) => {
                                const forma =
                                    obterForma(
                                        pagamento.formaPagamentoId
                                    );

                                return (
                                    <div
                                        key={`${pagamento.formaPagamentoId}-${indice}`}
                                        className="row g-2 align-items-center"
                                    >
                                        <div className="col">
                                            <div className="form-control bg-light">
                                                {forma?.descricao ||
                                                    "Forma de pagamento"}
                                            </div>
                                        </div>

                                        <div className="col-auto">
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                className="form-control"
                                                value={
                                                    pagamento.valor
                                                }
                                                onChange={(event) =>
                                                    alterarValor(
                                                        indice,
                                                        event.target
                                                            .value
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="col-auto">
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger"
                                                onClick={() =>
                                                    onRemoverPagamento(
                                                        indice
                                                    )
                                                }
                                            >
                                                Remover
                                            </button>
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                )}

                {!formasPagamento.length && (
                    <div className="text-muted small">
                        Nenhuma forma de pagamento disponível.
                    </div>
                )}
            </div>
        </div>
    );
}

export default MiniPdvPagamentos;
