import { useEffect, useState } from "react";
import api from "../../services/api";
import PedidoCard from "../../components/pedido/PedidoCard";

function Entrega() {
    const [pedidos, setPedidos] = useState([]);

    async function carregarPedidos() {
        const response = await await api.get("/pedidos/entrega-operacao");
        setPedidos(response.data);
    }

   useEffect(() => {
    carregarPedidos();

    const intervalo = setInterval(() => {
        carregarPedidos();
    }, 10000);

    return () => clearInterval(intervalo);
}, []);

    return (
        <div>
            <h1 className="mb-4">Entrega</h1>

            <div className="row">
                {pedidos.map((pedido) => (
                    <div className="col-md-6" key={pedido.id}>
                        <PedidoCard pedido={pedido}>
                            {pedido.status === "FINALIZADO" && (
                                <button
                                    className="btn btn-primary"
                                    onClick={async () => {
                                        await api.put(`/pedidos/${pedido.id}/sair-entrega`);
                                        carregarPedidos();
                                    }}
                                >
                                    Sair para entrega
                                </button>
                            )}

                            {pedido.status === "SAIU_ENTREGA" && (
                                <button
                                    className="btn btn-success"
                                    onClick={async () => {
                                        await api.put(`/pedidos/${pedido.id}/entregar`);
                                        carregarPedidos();
                                    }}
                                >
                                    Entregue
                                </button>
                            )}
                        </PedidoCard>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Entrega;
