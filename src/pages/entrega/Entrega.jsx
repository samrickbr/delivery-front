import { useEffect, useState } from "react";
import api from "../../services/api";
import PedidoCard from "../../components/pedido/PedidoCard";

function Entrega() {
    const [pedidos, setPedidos] = useState([]);
    const [aba, setAba] = useState("separacao");

    async function carregarPedidos() {
        const response = await api.get("/pedidos/entrega-operacao");
        setPedidos(response.data);
    }

    async function sairEntrega(id) {
        await api.put(`/pedidos/${id}/sair-entrega`);
        await carregarPedidos();
    }

    async function confirmarEntrega(id) {
        await api.put(`/pedidos/${id}/entregar`);
        await carregarPedidos();
    }

    useEffect(() => {
        const intervalo = setInterval(() => {
            if (!document.hidden) {
                carregarPedidos();
            }
        }, 10000);

        return () => clearInterval(intervalo);
    }, []);

    const pedidosSeparacao = pedidos.filter((pedido) => pedido.status === "SEPARADO");

    const pedidosEmEntrega = pedidos.filter((pedido) => pedido.status === "SAIU_ENTREGA");

    const pedidosExibidos = aba === "separacao" ? pedidosSeparacao : pedidosEmEntrega;

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Entrega</h1>

            <div className="mb-4">
                <button
                    className={`btn me-2 ${aba === "separacao" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setAba("separacao")}
                >
                    📦 Separação ({pedidosSeparacao.length})
                </button>

                <button
                    className={`btn ${aba === "entrega" ? "btn-success" : "btn-outline-success"}`}
                    onClick={() => setAba("entrega")}
                >
                    🚚 Em entrega ({pedidosEmEntrega.length})
                </button>
            </div>

            <div className="row">
                {pedidosExibidos.map((pedido) => (
                    <div className="col-md-6" key={pedido.id}>
                        <PedidoCard pedido={pedido} mostrarValor={true}>
                            {pedido.status === "SEPARADO" && (
                                <button className="btn btn-primary w-100" onClick={() => sairEntrega(pedido.id)}>
                                    🚚 Sair para entrega
                                </button>
                            )}

                            {pedido.status === "SAIU_ENTREGA" && (
                                <button className="btn btn-success w-100" onClick={() => confirmarEntrega(pedido.id)}>
                                    ✅ Confirmar entrega
                                </button>
                            )}
                        </PedidoCard>
                    </div>
                ))}
            </div>

            {pedidosExibidos.length === 0 && (
                <div className="text-center mt-5">
                    <h4>Nenhum pedido nesta etapa.</h4>
                </div>
            )}
        </div>
    );
}

export default Entrega;
