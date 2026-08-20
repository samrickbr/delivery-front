import { TIPOS_RECEBIMENTO, formatarValor } from "../checkoutUtils";

function ResumoFinal({ cliente, tipoRecebimento, enderecoSelecionado, valorTotal, totalPagamentos }) {
    return (
        <div className="border rounded p-3 mb-4">
            <h5>Resumo final</h5>

            <p className="mb-1">
                <strong>Cliente:</strong> {cliente.nome || "Não disponível"}
            </p>

            <p className="mb-1">
                <strong>Recebimento:</strong> {tipoRecebimento}
            </p>

            {tipoRecebimento === TIPOS_RECEBIMENTO.ENTREGA && (
                <p className="mb-1">
                    <strong>Endereço:</strong> {enderecoSelecionado || "Não selecionado"}
                </p>
            )}

            <p className="mb-1">
                <strong>Total:</strong> {valorTotal === null ? "Aguardando Backend" : formatarValor(valorTotal)}
            </p>

            <p className="mb-0">
                <strong>Pagamentos:</strong> {formatarValor(totalPagamentos)}
            </p>
        </div>
    );
}

export default ResumoFinal;
