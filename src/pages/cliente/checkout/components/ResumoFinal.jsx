import { TIPOS_RECEBIMENTO, formatarValor } from "../checkoutUtils";

function ResumoFinal({ cliente, tipoRecebimento, enderecoSelecionado, valorTotal, totalPagamentos }) {
    const nomeCliente = cliente?.nome || "Não disponível";

    const recebimento = tipoRecebimento === TIPOS_RECEBIMENTO.ENTREGA ? "Entrega" : "Retirada no local";

    return (
        <section className="card border-0 shadow-sm">
            <div className="card-body px-3 py-2">
                <strong className="d-block mb-2">Resumo final</strong>

                <div className="d-flex justify-content-between small mb-1">
                    <span className="text-muted">Cliente</span>

                    <strong className="text-end ms-2">{nomeCliente}</strong>
                </div>

                <div className="d-flex justify-content-between small mb-1">
                    <span className="text-muted">Recebimento</span>

                    <strong>{recebimento}</strong>
                </div>

                {tipoRecebimento === TIPOS_RECEBIMENTO.ENTREGA && (
                    <div className="d-flex justify-content-between small mb-1">
                        <span className="text-muted">Endereço</span>

                        <strong className="text-end ms-2">{enderecoSelecionado || "Não selecionado"}</strong>
                    </div>
                )}

                <div className="d-flex justify-content-between small mb-1">
                    <span className="text-muted">Total</span>

                    <strong>{valorTotal === null ? "Aguardando" : formatarValor(valorTotal)}</strong>
                </div>

                <div className="d-flex justify-content-between small">
                    <span className="text-muted">Pagamentos</span>

                    <strong>{formatarValor(totalPagamentos)}</strong>
                </div>
            </div>
        </section>
    );
}

export default ResumoFinal;
