import { useEffect, useState } from "react";
import api from "../../services/api";
import PedidoActions from "../../components/PedidoActions";

function Cozinha() {
    const [pedidos, setPedidos] = useState([]);
    const [aba, setAba] = useState("cozinha");

    async function carregarPedidos() {
        const response = await api.get("/pedidos/cozinha");

        console.log(response.data);

        setPedidos(response.data);
    }

    async function carregarFinalizados() {
        const response = await api.get("/pedidos/finalizados");
        setPedidos(response.data);
    }

    useEffect(() => {
        carregarPedidos();
    }, []);

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Cozinha</h1>

            <div className="mb-4">
                <button
                    className={`btn ${aba === "cozinha" ? "btn-primary" : "btn-outline-primary"} me-2`}
                    onClick={() => {
                        setAba("cozinha");
                        carregarPedidos();
                    }}
                >
                    Produção
                </button>

                <button
                    className={`btn ${aba === "finalizados" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => {
                        setAba("finalizados");
                        carregarFinalizados();
                    }}
                >
                    Finalizados
                </button>
            </div>

            <div className="row">
                {pedidos.map((pedido) => (
                    <div className="col-md-6" key={pedido.id}>
                        <div className="card shadow mb-4 border-0">
                            <div className="card-header bg-dark text-white">
                                <h4 className="mb-0">Pedido #{pedido.id}</h4>
                            </div>
                            <div className="card-body">
                                <h5>{pedido.clienteNome}</h5>
                                <hr />
                                <p>
                                    <strong>Status:</strong>{" "}
                                    <span
                                        className={
                                            pedido.status === "APROVADO"
                                                ? "badge bg-warning text-dark"
                                                : pedido.status === "EM_PRODUCAO"
                                                  ? "badge bg-primary"
                                                  : pedido.status === "PENDENTE"
                                                    ? "badge bg-danger"
                                                    : "badge bg-success"
                                        }
                                    >
                                        {pedido.status}
                                    </span>
                                </p>
                                <p>
                                    <strong>Total:</strong>
                                    R$ {pedido.valorTotal}
                                </p>
                                {pedido.observacaoOperacao && (
                                    <div className="alert alert-warning">
                                        <strong>Observação</strong>
                                        <br />
                                        {pedido.observacaoOperacao}
                                    </div>
                                )}
                                <hr />
                                <PedidoActions pedido={pedido} onAtualizar={carregarPedidos} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default Cozinha;
