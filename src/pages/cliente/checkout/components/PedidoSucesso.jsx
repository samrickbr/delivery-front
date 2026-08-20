import { formatarValor } from "../checkoutUtils";

function PedidoSucesso({ pedido }) {
    return (
        <div className="card mt-4 shadow">
            <div className="card-body">
                <div className="text-center">
                    <h2>Pedido recebido!</h2>

                    <p className="mb-3">Seu pedido foi enviado com sucesso.</p>

                    {pedido.id && <h3 className="mb-3">Pedido #{pedido.id}</h3>}

                    {pedido.status && (
                        <p className="mb-2">
                            <strong>Status:</strong> {pedido.status}
                        </p>
                    )}

                    {pedido.valorTotal !== undefined && (
                        <p className="mb-3">
                            <strong>Total:</strong> {formatarValor(pedido.valorTotal)}
                        </p>
                    )}

                    <p className="text-muted mb-0">Em breve você receberá atualizações sobre o pedido.</p>
                </div>
            </div>
        </div>
    );
}

export default PedidoSucesso;
