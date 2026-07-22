import { useEffect, useState } from "react";
import api from "../../services/api";

function Cozinha() {
    const [pedidos, setPedidos] = useState([]);
    async function carregarPedidos() {
       const response = await api.get("/pedidos/cozinha");

       console.log(response.data);

       setPedidos(response.data);
    }
    async function iniciarProducao(id) {
        await api.put(`/pedidos/${id}/producao`);
        carregarPedidos();
    }
    async function finalizarPedido(id) {
        await api.put(`/pedidos/${id}/finalizar`);
        carregarPedidos();
    }
    useEffect(() => {
        carregarPedidos();
    }, []);
    return (
        <div className="container mt-4">
            <h1 className="mb-4">
                Cozinha
            </h1>
            <div className="row">
                {pedidos.map(pedido => (
                    <div
                        className="col-md-6"
                        key={pedido.id}
                    >
                        <div className="card mb-3 shadow">
                            <div className="card-body">
                                <h3>
                                    Pedido #{pedido.id}
                                </h3>
                                <hr />
                                <p>
                                    <strong>
                                        Cliente:
                                    </strong>{" "}
                                    {pedido.clienteNome}
                                </p>
                                <p>
                                    <strong>
                                        Status:
                                    </strong>{" "}
                                    {pedido.status}
                                </p>
                                <p>
                                    <strong>
                                        Total:
                                    </strong>{" "}
                                    R$ {pedido.valorTotal}
                                </p>
                                {
                                    pedido.status === "APROVADO" && (
                                        <button
                                            className="btn btn-primary"
                                            onClick={() =>
                                                iniciarProducao(pedido.id)
                                            }
                                        >
                                            Iniciar produção
                                        </button>
                                    )
                                }
                                {
                                    pedido.status === "EM_PRODUCAO" && (
                                        <button
                                            className="btn btn-success"
                                            onClick={() =>
                                                finalizarPedido(pedido.id)
                                            }
                                        >
                                            Finalizar pedido
                                        </button>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default Cozinha;