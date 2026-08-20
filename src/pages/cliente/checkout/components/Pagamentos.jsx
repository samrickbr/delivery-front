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
        <div className="mb-4">
            <h5 className="mb-3">Pagamentos</h5>

            {pagamentos.length === 0 && <div className="alert alert-secondary">Nenhum pagamento adicionado.</div>}

            {pagamentos.map((pagamento, index) => (
                <div key={index} className="border rounded p-3 mb-3">
                    <div className="fw-semibold mb-3">Pagamento {index + 1}</div>

                    <div className="row g-2 align-items-end">
                        <div className="col-md-5">
                            <label className="form-label">Forma de pagamento</label>

                            <select
                                className="form-select"
                                value={pagamento.formaPagamentoId}
                                onChange={(e) => onAlterar(index, "formaPagamentoId", e.target.value)}
                                disabled={disabled}
                            >
                                <option value="">Selecione</option>

                                {FORMAS_PAGAMENTO.map((forma) => (
                                    <option key={forma.id} value={forma.id}>
                                        {forma.nome}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Valor</label>

                            <input
                                className="form-control"
                                type="number"
                                min="0.01"
                                step="0.01"
                                placeholder="0,00"
                                value={pagamento.valor}
                                onChange={(e) => onAlterar(index, "valor", e.target.value)}
                                disabled={disabled}
                            />
                        </div>

                        <div className="col-md-3 d-flex gap-2">
                            <button
                                type="button"
                                className={
                                    pagamento.confirmado
                                        ? "btn btn-success flex-grow-1"
                                        : "btn btn-outline-success flex-grow-1"
                                }
                                onClick={() => onConfirmar(index)}
                                disabled={disabled || !pagamento.formaPagamentoId || !pagamento.valor}
                            >
                                OK
                            </button>

                            <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() => onRemover(index)}
                                disabled={disabled}
                            >
                                Remover
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            <div className="text-center mb-3">
                <button type="button" className="btn btn-outline-primary" onClick={onAdicionar} disabled={disabled}>
                    + Adicionar pagamento
                </button>
            </div>

            <div className="border rounded p-3">
                <div className="d-flex justify-content-between">
                    <span>Total dos pagamentos</span>

                    <strong>{formatarValor(totalPagamentos)}</strong>
                </div>

                {diferencaPagamento !== null && (
                    <div className="d-flex justify-content-between mt-2">
                        <span>Diferença</span>

                        <strong>{formatarValor(diferencaPagamento)}</strong>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Pagamentos;
