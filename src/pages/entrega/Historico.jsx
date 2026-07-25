import { useEffect, useState } from "react";
import api from "../../services/api";

function Historico() {
    const [pedidos, setPedidos] = useState([]);

    async function carregarPedidos() {
        const response = await api.get("/pedidos/entregues");
        setPedidos(response.data);
    }

    useEffect(() => {
        carregarPedidos();

        const intervalo = setInterval(() => {
            carregarPedidos();
        }, 30000);

        return () => clearInterval(intervalo);
    }, []);

    return (
        <div>
            <h1 className="mb-4">Histórico de Entregas</h1>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Pedido</th>
                        <th>Cliente</th>
                        <th>Status</th>
                        <th>Valor</th>
                    </tr>
                </thead>

                <tbody>
                    {pedidos.map((pedido) => (
                        <tr key={pedido.id}>
                            <td>#{pedido.id}</td>
                            <td>{pedido.clienteNome}</td>
                            <td>
                                <span
                                    className={
                                        pedido.status === "APROVADO"
                                            ? "badge bg-warning text-dark"
                                            : pedido.status === "EM_PRODUCAO"
                                              ? "badge bg-primary"
                                              : pedido.status === "PENDENTE"
                                                ? "badge bg-danger"
                                                : pedido.status === "FINALIZADO"
                                                  ? "badge bg-success"
                                                  : pedido.status === "ENTREGUE"
                                                    ? "badge bg-success"
                                                    : pedido.status === "CANCELADO"
                                                      ? "badge bg-dark"
                                                      : pedido.status === "SAIU_ENTREGA"
                                                        ? "badge bg-info"
                                                        : "badge bg-secondary"
                                    }
                                >
                                    {pedido.status}
                                </span>
                            </td>
                            <td>
                                R${" "}
                                {pedido.valorTotal?.toLocaleString("pt-BR", {
                                    minimumFractionDigits: 2
                                })}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Historico;
