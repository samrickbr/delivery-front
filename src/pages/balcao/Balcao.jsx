import { useEffect, useState } from "react";
import api from "../../services/api";
import PedidoCard from "../../components/pedido/PedidoCard";

function Balcao() {
    const [pedidos, setPedidos] = useState([]);

    async function carregarPedidos() {
        const response = await api.get("/pedidos/balcao");
        setPedidos(response.data);
    }

    async function aprovarPedido(id) {
        await api.put(`/pedidos/${id}/aprovar`);
        carregarPedidos();
    }

    useEffect(() => {
        carregarPedidos();

        const intervalo = setInterval(() => {
            carregarPedidos();
        }, 10000);

        return () => clearInterval(intervalo);
    }, []);

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Balcão</h1>

            <div className="row">
                {pedidos.map((pedido) => (
                    <div className="col-md-6" key={pedido.id}>
                        <PedidoCard pedido={pedido}>
                            <h5>Itens</h5>

                            <ul>
                                {pedido.itens.map((item) => (
                                    <li key={item.id}>
                                        {item.quantidade}x {item.produto}
                                    </li>
                                ))}
                            </ul>

                            <hr />

                            <h5>
                                Total: R${" "}
                                {pedido.valorTotal?.toLocaleString("pt-BR", {
                                    minimumFractionDigits: 2
                                })}
                            </h5>

                            <button className="btn btn-success w-100" onClick={() => aprovarPedido(pedido.id)}>
                                Confirmar Recebimento
                            </button>
                        </PedidoCard>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Balcao;
