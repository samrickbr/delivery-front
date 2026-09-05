import { useNavigate } from "react-router-dom";
import { formatarValor } from "../checkoutUtils";
import { obterNumeroPedido } from "../../../../utils/pedidoUtils";

function PedidoSucesso({ pedido }) {
    const navigate = useNavigate();
    const numeroPedido = obterNumeroPedido(pedido);

    return (
        <div className="card mt-4 border-0 shadow-sm">
            <div className="card-body text-center p-4 p-md-5">
                <div
                    className="d-flex align-items-center justify-content-center bg-success-subtle text-success rounded-circle mx-auto mb-3"
                    style={{
                        width: "64px",
                        height: "64px",
                        fontSize: "1.75rem"
                    }}
                    aria-hidden="true"
                >
                    ✓
                </div>

                <h2 className="h3 mb-2">Pedido enviado com sucesso!</h2>

                {numeroPedido !== "-" && (
                    <p className="fs-5 mb-2">
                        Pedido: <strong>{numeroPedido}</strong>
                    </p>
                )}

                <p className="text-muted mb-4">Seu pedido foi recebido e será processado.</p>

                {pedido?.valorTotal !== undefined && pedido?.valorTotal !== null && (
                    <p className="mb-4">
                        <span className="text-muted">Total do pedido: </span>
                        <strong>{formatarValor(pedido.valorTotal)}</strong>
                    </p>
                )}

                <button
                    type="button"
                    className="btn btn-outline-primary rounded-pill"
                    onClick={() => navigate("/cardapio")}
                >
                    Voltar ao cardápio
                </button>

                <button
                    type="button"
                    className="btn btn-primary rounded-pill"
                    onClick={() => navigate("/acompanhar-pedido")}
                >
                    Acompanhar pedido
                </button>
            </div>
        </div>
    );
}

export default PedidoSucesso;
