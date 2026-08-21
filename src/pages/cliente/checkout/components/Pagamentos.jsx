import { formatarValor, FORMAS_PAGAMENTO } from "../checkoutUtils";

function Pagamentos({
    pagamentos,
    totalPagamentos,
    diferencaPagamento,
    onAdicionar,
    onAlterar,
    onConfirmar,
    onRemover,
    disabled
}) {
    return (
        <section className="card border-0 shadow-sm">
            <div className="card-body px-3 py-2">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-2">
                    <div>
                        <strong>Forma de pagamento</strong>

                        <span className="text-muted small ms-2">
                            {pagamentos.length} {pagamentos.length === 1 ? "pagamento" : "pagamentos"}
                        </span>
                    </div>

                    <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={onAdicionar}
                        disabled={disabled}
                    >
                        + Adicionar pagamento
                    </button>
                </div>

                {pagamentos.length === 0 ? (
                    <div className="text-muted small py-1">Nenhum pagamento adicionado.</div>
                ) : (
                    <div className="d-flex flex-column gap-2">
                        {pagamentos.map((pagamento, index) => (
                            <div key={index} className="border rounded-3 p-2">
                                <div className="row g-2 align-items-center">
                                    <div className="col-12 col-md-5">
                                        <select
                                            className="form-select"
                                            value={pagamento.formaPagamentoId}
                                            onChange={(e) => onAlterar(index, "formaPagamentoId", e.target.value)}
                                            disabled={disabled}
                                        >
                                            <option value="">Forma de pagamento</option>

                                            {FORMAS_PAGAMENTO.map((forma) => (
                                                <option key={forma.id} value={forma.id}>
                                                    {forma.nome}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-12 col-md-3">
                                        <input
                                            className="form-control"
                                            type="number"
                                            min="0.01"
                                            step="0.01"
                                            placeholder="Valor"
                                            value={pagamento.valor}
                                            onChange={(e) => onAlterar(index, "valor", e.target.value)}
                                            disabled={disabled}
                                        />
                                    </div>

                                    <div className="col-6 col-md-2">
                                        <button
                                            type="button"
                                            className={
                                                pagamento.confirmado
                                                    ? "btn btn-success w-100"
                                                    : "btn btn-outline-success w-100"
                                            }
                                            onClick={() => onConfirmar(index)}
                                            disabled={disabled || !pagamento.formaPagamentoId || !pagamento.valor}
                                        >
                                            {pagamento.confirmado ? "OK ✓" : "OK"}
                                        </button>
                                    </div>

                                    <div className="col-6 col-md-2">
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger w-100"
                                            onClick={() => onRemover(index)}
                                            disabled={disabled}
                                        >
                                            Remover
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="d-flex flex-wrap justify-content-end gap-3 mt-2 pt-2 border-top small">
                    <span>
                        Pagamentos: <strong>{formatarValor(totalPagamentos)}</strong>
                    </span>

                    {diferencaPagamento !== null && (
                        <span>
                            Diferença: <strong>{formatarValor(diferencaPagamento)}</strong>
                        </span>
                    )}
                </div>
            </div>
        </section>
    );
}

export default Pagamentos;
