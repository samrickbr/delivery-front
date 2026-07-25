import { useEffect, useState } from "react";
import PedidoCard from "../../components/pedido/PedidoCard";
import { listarBalcao, aceitarPedido, enviarCozinha, cancelarPedido } from "../../services/pedidoService";

function Balcao() {
    const [pedidos, setPedidos] = useState([]);

    async function carregarPedidos() {
        const response = await listarBalcao();
        setPedidos(response.data);
    }

    async function confirmarPedido(id) {
        await aceitarPedido(id);
        carregarPedidos();
    }

    async function mandarCozinha(id) {
        await enviarCozinha(id);
        carregarPedidos();
    }

    async function cancelar(id) {
        await cancelarPedido(id);
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
            <h1>Balcão</h1>

            <div className="row">
                {pedidos.map((pedido) => (
                    <div className="col-md-6" key={pedido.id}>
                        <PedidoCard pedido={pedido}>
                            <h5>Itens</h5>

                            <ul>
                                {pedido.itens?.map((item) => (
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

                            <button className="btn btn-success w-100 mb-2" onClick={() => confirmarPedido(pedido.id)}>
                                Aceitar Pedido
                            </button>

                            <button className="btn btn-primary w-100 mb-2" onClick={() => mandarCozinha(pedido.id)}>
                                Enviar para Cozinha
                            </button>

                            <button className="btn btn-danger w-100" onClick={() => cancelar(pedido.id)}>
                                Cancelar Pedido
                            </button>
                        </PedidoCard>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Balcao;
