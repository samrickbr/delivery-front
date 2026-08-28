function MiniPdvPagamentos({
    formasPagamento = [],
    pagamentos = [],
    onAdicionarPagamento,
    onAlterarPagamento,
    onRemoverPagamento,
}) {
    return (
        <div className="card border-0 shadow-sm">
            <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <h2 className="h5 mb-0">
                        Pagamento
                    </h2>

                    <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={onAdicionarPagamento}
                    >
                        Adicionar
                    </button>
                </div>

                {pagamentos.length === 0 ? (
                    <div className="text-muted text-center py-3">
                        Nenhum pagamento informado.
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-3">
                        {pagamentos.map(
                            (pagamento, index) => (
                                <div
                                    key={index}
                                    className="border rounded p-3"
                                >
                                    <div className="row g-2 align-items-end">
                                        <div className="col-12 col-md-6">
                                            <label className="form-label">
                                                Forma de pagamento
                                            </label>

                                            <select
                                                className="form-select"
                                                value={
                                                    pagamento.formaPagamentoId ??
                                                    ""
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    onAlterarPagamento(
                                                        index,
                                                        {
                                                            ...pagamento,
                                                            formaPagamentoId:
                                                                event
                                                                    .target
                                                                    .value
                                                                    ? Number(
                                                                          event
                                                                              .target
                                                                              .value
                                                                      )
                                                                    : null,
                                                        }
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    Selecione
                                                </option>

                                                {formasPagamento.map(
                                                    (
                                                        forma
                                                    ) => (
                                                        <option
                                                            key={
                                                                forma.id
                                                            }
                                                            value={
                                                                forma.id
                                                            }
                                                        >
                                                            {forma.nome ||
                                                                forma.descricao ||
                                                                forma.codigo}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>

                                        <div className="col-12 col-md-4">
                                            <label className="form-label">
                                                Valor
                                            </label>

                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                className="form-control"
                                                value={
                                                    pagamento.valor ??
                                                    ""
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    onAlterarPagamento(
                                                        index,
                                                        {
                                                            ...pagamento,
                                                            valor:
                                                                event
                                                                    .target
                                                                    .value,
                                                        }
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="col-12 col-md-2">
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger w-100"
                                                onClick={() =>
                                                    onRemoverPagamento(
                                                        index
                                                    )
                                                }
                                            >
                                                Remover
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MiniPdvPagamentos;
