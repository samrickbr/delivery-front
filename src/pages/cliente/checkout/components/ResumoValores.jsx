import { formatarValor } from "../checkoutUtils";

function ResumoValores({ valorProdutos, taxaEntrega, valorTotal }) {
    return (
        <section className="card border-0 shadow-sm">
            <div className="card-body px-3 py-2">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong>Resumo dos valores</strong>

                    <span className="text-muted small">Pedido</span>
                </div>

                <div className="d-flex justify-content-between small mb-1">
                    <span>Produtos</span>

                    <strong>{formatarValor(valorProdutos)}</strong>
                </div>

                <div className="d-flex justify-content-between small mb-1">
                    <span>Taxa de entrega</span>

                    <strong>{taxaEntrega === null ? "A calcular" : formatarValor(taxaEntrega)}</strong>
                </div>

                <div className="border-top mt-2 pt-2 d-flex justify-content-between align-items-center">
                    <strong>Total</strong>

                    <strong className="fs-5">{valorTotal === null ? "Aguardando" : formatarValor(valorTotal)}</strong>
                </div>
            </div>
        </section>
    );
}

export default ResumoValores;
