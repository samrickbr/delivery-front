import { useEffect, useState } from "react";
import api from "../../services/api";
import PedidoActions from "../PedidoActions";
import PedidoCard from "./PedidoCard";

function OperacaoPedidos({ setor, titulo }) {
    const [pedidos, setPedidos] = useState([]);
    const [aba, setAba] = useState("producao");
    const [filtro, setFiltro] = useState("TODOS");
    const [categorias, setCategorias] = useState([]);

    async function carregarCategorias() {
        const response = await api.get("/categorias");
        setCategorias(response.data);
    }

    async function carregarPedidos() {
        const response = await api.get(`/pedidos/cozinha?setor=${setor}`);
        setPedidos(response.data);
    }

    async function carregarFinalizados() {
        const response = await api.get("/pedidos/finalizados");
        setPedidos(response.data);
    }

    useEffect(() => {
        carregarCategorias();
    }, []);

    useEffect(() => {
        function atualizar() {
            if (aba === "producao") {
                carregarPedidos();
            } else {
                carregarFinalizados();
            }
        }

        atualizar();

        const intervalo = setInterval(atualizar, 10000);

        return () => clearInterval(intervalo);
    }, [aba]);

    const pedidosFiltrados =
        aba === "finalizados"
            ? pedidos
            : filtro === "TODOS"
                ? pedidos
                : pedidos.filter((pedido) =>
                    pedido.itens?.some(
                        (item) => item.categoria === filtro
                    )
                );

    const categoriasComQuantidade = categorias.map((categoria) => ({
        ...categoria,
        quantidade: pedidos.filter((pedido) =>
            pedido.itens?.some(
                (item) => item.categoria === categoria.nome
            )
        ).length
    }));

    return (
        <div className="container mt-4">

            <h1 className="mb-4">{titulo}</h1>

            <div className="mb-4">
                <button
                    className={`btn ${aba === "producao" ? "btn-primary" : "btn-outline-primary"} me-2`}
                    onClick={() => {
                        setAba("producao");
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

            {aba === "producao" && (
                <div className="mb-3">
                    <button
                        className={`btn me-2 ${filtro === "TODOS" ? "btn-dark" : "btn-outline-dark"}`}
                        onClick={() => setFiltro("TODOS")}
                    >
                        Todos ({pedidos.length})
                    </button>

                    {categoriasComQuantidade.map((categoria) => (
                        <button
                            key={categoria.id}
                            className={`btn me-2 ${filtro === categoria.nome ? "btn-dark" : "btn-outline-dark"}`}
                            onClick={() => setFiltro(categoria.nome)}
                        >
                            {categoria.nome} ({categoria.quantidade})
                        </button>
                    ))}
                </div>
            )}

            <div className="row">
                {pedidosFiltrados.map((pedido) => (
                    <div className="col-md-6" key={pedido.id}>
                        <PedidoCard pedido={pedido}>
                            {aba === "producao" && (
                                <PedidoActions
                                    pedido={pedido}
                                    onAtualizar={carregarPedidos}
                                />
                            )}
                        </PedidoCard>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default OperacaoPedidos;