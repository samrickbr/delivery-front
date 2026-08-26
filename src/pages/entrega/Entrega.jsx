import { useCallback, useEffect, useState } from "react";
import PedidoCard from "../../components/pedido/PedidoCard";
import {
    listarEntregaOperacao,
    sairEntrega,
    entregarPedido
} from "../../services/pedidoService";

function Entrega() {
    const [pedidos, setPedidos] = useState([]);
    const [aba, setAba] = useState("separacao");
    const [carregando, setCarregando] = useState(false);

    const carregarPedidos = useCallback(async () => {
        setCarregando(true);

        try {
            const response = await listarEntregaOperacao();
            setPedidos(response.data);
        } finally {
            setCarregando(false);
        }
    }, []);

    async function sairParaEntrega(id) {
        await sairEntrega(id);
        await carregarPedidos();
    }

    async function confirmarEntrega(id) {
        await entregarPedido(id);
        await carregarPedidos();
    }

useEffect(() => {
    const inicializar = async () => {
        await carregarPedidos();
    };

    inicializar();

    const intervalo = setInterval(() => {
        if (!document.hidden) {
            carregarPedidos();
        }
    }, 10000);

    return () => clearInterval(intervalo);
}, [carregarPedidos]);

    const pedidosSeparacao = pedidos.filter(
        (pedido) => pedido.status === "SEPARADO"
    );

    const pedidosEmEntrega = pedidos.filter(
        (pedido) => pedido.status === "SAIU_ENTREGA"
    );

    const pedidosExibidos =
        aba === "separacao"
            ? pedidosSeparacao
            : pedidosEmEntrega;

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Entrega</h1>

            <div className="mb-4">
                <button
                    className={`btn me-2 ${
                        aba === "separacao"
                            ? "btn-primary"
                            : "btn-outline-primary"
                    }`}
                    onClick={() => setAba("separacao")}
                >
                    📦 Separação ({pedidosSeparacao.length})
                </button>

                <button
                    className={`btn ${
                        aba === "entrega"
                            ? "btn-success"
                            : "btn-outline-success"
                    }`}
                    onClick={() => setAba("entrega")}
                >
                    🚚 Em entrega ({pedidosEmEntrega.length})
                </button>
            </div>

            {carregando && (
                <div className="text-center my-5">
                    <div className="spinner-border" />
                </div>
            )}

            {!carregando && (
                <div className="row">
                    {pedidosExibidos.map((pedido) => (
                        <div
                            className="col-12 col-md-6"
                            key={pedido.id}
                        >
                            <PedidoCard
                                pedido={pedido}
                                mostrarValor={true}
                            >
                                {pedido.status === "SEPARADO" && (
                                    <button
                                        className="btn btn-primary w-100"
                                        onClick={() =>
                                            sairParaEntrega(pedido.id)
                                        }
                                    >
                                        🚚 Sair para entrega
                                    </button>
                                )}

                                {pedido.status === "SAIU_ENTREGA" && (
                                    <button
                                        className="btn btn-success w-100"
                                        onClick={() =>
                                            confirmarEntrega(pedido.id)
                                        }
                                    >
                                        ✅ Confirmar entrega
                                    </button>
                                )}
                            </PedidoCard>
                        </div>
                    ))}
                </div>
            )}

            {!carregando &&
                pedidosExibidos.length === 0 && (
                    <div className="text-center mt-5">
                        <h4>Nenhum pedido nesta etapa.</h4>
                    </div>
                )}
        </div>
    );
}

export default Entrega;
