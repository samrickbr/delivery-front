import { useCallback, useEffect, useState } from "react";
import PedidoActions from "../PedidoActions";
import PedidoCard from "./PedidoCard";
import { listarCozinha, listarFinalizados } from "../../services/pedidoService";
import api from "../../services/api";

function OperacaoPedidos({ setor, titulo, mostrarValor = true }) {
    const [pedidos, setPedidos] = useState([]);
    const [aba, setAba] = useState("producao");
    const [filtro, setFiltro] = useState("TODOS");
    const [categorias, setCategorias] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [digitando, setDigitando] = useState(false);

    const carregarCategorias = useCallback(async () => {
        const response = await api.get("/categorias");
        setCategorias(response.data);
    }, []);

    const carregarPedidos = useCallback(async () => {
        const response = await listarCozinha(setor);
        setPedidos(response.data);
    }, [setor]);

    const carregarFinalizados = useCallback(async () => {
        const response = await listarFinalizados();
        setPedidos(response.data);
    }, []);

    const atualizar = useCallback(async () => {
        setCarregando(true);

        try {
            if (aba === "producao") {
                await carregarPedidos();
            } else {
                await carregarFinalizados();
            }
        } finally {
            setCarregando(false);
        }
    }, [aba, carregarPedidos, carregarFinalizados]);

    useEffect(() => {
        const timer = setTimeout(() => {
            carregarCategorias();
        }, 0);

        return () => clearTimeout(timer);
    }, [carregarCategorias]);

    useEffect(() => {
        const timer = setTimeout(() => {
            atualizar();
        }, 0);

        const intervalo = setInterval(() => {
            if (!document.hidden && !digitando) {
                atualizar();
            }
        }, 10000);

        return () => {
            clearTimeout(timer);
            clearInterval(intervalo);
        };
    }, [atualizar, digitando]);

    const pedidosFiltrados =
        aba === "finalizados"
            ? pedidos
            : filtro === "TODOS"
              ? pedidos
              : pedidos.filter((pedido) => pedido.itens?.some((item) => item.categoria === filtro));

    const categoriasComQuantidade = categorias.map((categoria) => ({
        ...categoria,
        quantidade: pedidos.filter((pedido) => pedido.itens?.some((item) => item.categoria === categoria.nome)).length
    }));

    return (
        <div className="container mt-4">
            <h1 className="mb-4">{titulo}</h1>

            <div className="mb-4">
                <button
                    className={`btn ${aba === "producao" ? "btn-primary" : "btn-outline-primary"} me-2`}
                    onClick={() => {
                        setAba("producao");
                    }}
                >
                    Produção
                </button>

                <button
                    className={`btn ${aba === "finalizados" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => {
                        setAba("finalizados");
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

            {carregando && (
                <div className="text-center my-5">
                    <div className="spinner-border" />
                </div>
            )}

            {!carregando && (
                <div className="row">
                    {pedidosFiltrados.map((pedido) => (
                        <div className="col-12 col-md-6 col-xl-4" key={pedido.id}>
                            <PedidoCard pedido={pedido} mostrarValor={mostrarValor}>
                                {aba === "producao" && (
                                    <PedidoActions
                                        pedido={pedido}
                                        setor={setor}
                                        onAtualizar={carregarPedidos}
                                        onDigitando={setDigitando}
                                    />
                                )}
                            </PedidoCard>
                        </div>
                    ))}
                </div>
            )}

            {!carregando && pedidosFiltrados.length === 0 && (
                <div className="text-center mt-5">
                    <h4>Nenhum pedido encontrado.</h4>
                </div>
            )}
        </div>
    );
}

export default OperacaoPedidos;
