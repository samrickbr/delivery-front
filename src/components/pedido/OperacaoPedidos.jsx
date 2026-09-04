import { useCallback, useEffect, useRef, useState } from "react";
import PedidoActions from "../PedidoActions";
import PedidoCard from "./PedidoCard";
import { buscarPedido, listarCozinha, listarFinalizados } from "../../services/pedidoService";
import api from "../../services/api";
import { conectarEventosProducao } from "../../services/eventoProducaoService";

async function enriquecerNumerosPedidos(pedidos) {
    return Promise.all(
        pedidos.map(async (pedido) => {
            if (pedido?.numero || pedido?.numeroPedido || pedido?.numeroComercial || !pedido?.id) {
                return pedido;
            }

            try {
                const response = await buscarPedido(pedido.id);

                return { ...pedido, ...response.data };
            } catch {
                return pedido;
            }
        })
    );
}

function OperacaoPedidos({ setor, titulo, mostrarValor = true }) {
    const [pedidos, setPedidos] = useState([]);
    const [aba, setAba] = useState("producao");
    const [filtro, setFiltro] = useState("TODOS");
    const [categorias, setCategorias] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [digitando, setDigitando] = useState(false);
    const [novoPedido, setNovoPedido] = useState(false);

    const digitandoRef = useRef(false);
    const atualizacaoPendenteRef = useRef(false);

    const alterarDigitando = useCallback((valor) => {
        digitandoRef.current = valor;
        setDigitando(valor);
    }, []);

    const carregarCategorias = useCallback(async () => {
        const response = await api.get("/categorias");
        setCategorias(response.data);
    }, []);

    const carregarPedidos = useCallback(async () => {
        const response = await listarCozinha(setor);
        setPedidos(await enriquecerNumerosPedidos(response.data || []));
    }, [setor]);

    const carregarFinalizados = useCallback(async () => {
        const response = await listarFinalizados();

        const pedidosDoSetor = response.data.filter((pedido) =>
            pedido.itens?.some((item) => item.setor === setor && item.statusOperacao !== "CANCELADO")
        );

        setPedidos(await enriquecerNumerosPedidos(pedidosDoSetor));
    }, [setor]);

    const atualizar = useCallback(async () => {
        if (digitandoRef.current) {
            atualizacaoPendenteRef.current = true;
            return;
        }

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

    const atualizarEmSegundoPlano = useCallback(async () => {
        if (digitandoRef.current) {
            atualizacaoPendenteRef.current = true;
            return;
        }

        if (aba !== "producao") {
            return;
        }

        await carregarPedidos();
    }, [aba, carregarPedidos]);

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

        return () => clearTimeout(timer);
    }, [atualizar]);

    useEffect(() => {
        return conectarEventosProducao({
            onNovoPedido: (evento) => {
                if (evento?.setor !== setor) {
                    return;
                }

                setNovoPedido(true);

                if (digitandoRef.current) {
                    atualizacaoPendenteRef.current = true;
                    return;
                }

                atualizarEmSegundoPlano();
            }
        });
    }, [setor, atualizarEmSegundoPlano]);

    useEffect(() => {
        if (digitando || !atualizacaoPendenteRef.current) {
            return;
        }

        atualizacaoPendenteRef.current = false;
        atualizarEmSegundoPlano();
    }, [digitando, atualizarEmSegundoPlano]);

    useEffect(() => {
        if (!novoPedido) {
            return;
        }

        const timer = setTimeout(() => {
            setNovoPedido(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, [novoPedido]);

    const pedidosFiltrados =
        aba === "finalizados"
            ? pedidos
            : filtro === "TODOS"
              ? pedidos
              : pedidos.filter((pedido) =>
                    pedido.itens?.some((item) => item.setor === setor && item.categoria === filtro)
                );

    const categoriasComQuantidade = categorias
        .map((categoria) => ({
            ...categoria,
            quantidade: pedidos.filter((pedido) =>
                pedido.itens?.some(
                    (item) =>
                        item.setor === setor && item.statusOperacao !== "CANCELADO" && item.categoria === categoria.nome
                )
            ).length
        }))
        .filter((categoria) => categoria.quantidade > 0);

    return (
        <div className="container mt-4 position-relative">
            <h1 className="mb-4">{titulo}</h1>

            {novoPedido && (
                <div
                    className="alert alert-success position-fixed top-0 end-0 m-3 shadow"
                    style={{ zIndex: 1050, pointerEvents: "none" }}
                    role="status"
                >
                    Novo pedido recebido.
                </div>
            )}

            <div className="mb-4">
                <button
                    className={`btn ${aba === "producao" ? "btn-primary" : "btn-outline-primary"} me-2`}
                    onClick={() => {
                        setAba("producao");
                        setFiltro("TODOS");
                    }}
                >
                    Produção
                </button>

                <button
                    className={`btn ${aba === "finalizados" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => {
                        setAba("finalizados");
                        setFiltro("TODOS");
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

            {carregando && pedidos.length === 0 && (
                <div className="text-center my-5">
                    <div className="spinner-border" />
                </div>
            )}

            <div className="row">
                {pedidosFiltrados.map((pedido) => (
                    <div className="col-12 col-md-6 col-xl-4" key={pedido.id}>
                        <PedidoCard pedido={pedido} mostrarValor={mostrarValor}>
                            {aba === "producao" && (
                                <PedidoActions
                                    pedido={pedido}
                                    setor={setor}
                                    onAtualizar={carregarPedidos}
                                    onDigitando={alterarDigitando}
                                />
                            )}
                        </PedidoCard>
                    </div>
                ))}
            </div>

            {!carregando && pedidosFiltrados.length === 0 && (
                <div className="text-center mt-5">
                    <h4>Nenhum pedido encontrado.</h4>
                </div>
            )}
        </div>
    );
}

export default OperacaoPedidos;
