import { formatarValor } from "../checkoutUtils";

function ResumoValores({ valorProdutos, taxaEntrega, valorTotal }) {
    return (
        <div className="border rounded p-3 mb-4">
            <h5>Valores</h5>

            <div className="d-flex justify-content-between mb-1">
                <span>Produtos</span>

                <strong>{formatarValor(valorProdutos)}</strong>
            </div>

            <div className="d-flex justify-content-between mb-1">
                <span>Taxa de entrega</span>

                <strong>{taxaEntrega === null ? "A calcular pelo Backend" : formatarValor(taxaEntrega)}</strong>
            </div>

            <hr />

            <div className="d-flex justify-content-between">
                <strong>Total</strong>

                <strong>{valorTotal === null ? "Aguardando Backend" : formatarValor(valorTotal)}</strong>
            </div>
        </div>
    );
}

export default ResumoValores;
