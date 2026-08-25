import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { listarMeusPedidos } from "../../services/pedidoService";

function formatarData(data) {
    if (!data) {
        return "-";
    }

    const valor = new Date(data);

    if (Number.isNaN(valor.getTime())) {
        return data;
    }

    return valor.toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short"
    });
}

function formatarValor(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function formatarTipoRecebimento(tipo) {
    if (tipo === "RETIRADA") {
        return "RETIRADA";
    }

    if (tipo === "ENTREGA") {
        return "ENTREGA";
    }

    return tipo || "-";
}

function obterStatus(pedido) {
    const status = String(pedido?.status || "").toUpperCase();

    if (status === "RETIRADO") {
        return "Pedido retirado";
    }

    if (status === "ENTREGUE") {
        return "Pedido entregue";
    }

    if (status === "CANCELADO") {
        return "Pedido cancelado";
    }

    if (status === "RECEBIDO") {
        return "Aguardando aceite";
    }

    if (status === "APROVADO") {
        return "Pedido aceito";
    }

    if (status === "PRODUCAO") {
        return "Em produção";
    }

    if (status === "FINALIZADO") {
        return "Pedido pronto";
    }

    if (status === "SEPARACAO") {
        return "Em separação";
    }

    if (status === "ENTREGA") {
        return "Saiu para entrega";
    }

    return pedido?.status || "Em processamento";
}

function obterClasseStatus(pedido) {
    const status = String(pedido?.status || "").toUpperCase();

    if (status === "CANCELADO") {
        return "badge text-bg-danger";
    }

    if (["ENTREGUE", "RETIRADO"].includes(status)) {
        return "badge text-bg-success";
    }

    return "badge text-bg-primary";
}

function PedidoResumo({ pedido, mostrarItens = false }) {
    return (
        <article className="border rounded-3 p-3">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                <div>
                    <div className="fw-semibold">{formatarData(pedido.dataCriacao)}</div>

                    <div className="text-muted small">
                        Pedido #{pedido.id}
                    </div>
                </div>

                <div className="fw-semibold">
                    {formatarValor(pedido.valorTotal)}
                </div>
            </div>

            <div className="d-flex flex-wrap align-items-center gap-2 mt-3">
                <span className="badge text-bg-light border">
                    {formatarTipoRecebimento(pedido.tipoRecebimento)}
                </span>

                <span className={obterClasseStatus(pedido)}>
                    Status: {obterStatus(pedido)}
                </span>
            </div>

            {mostrarItens && (
                <div className="mt-3 pt-3 border-top">
                    <div className="fw-semibold mb-2">
                        Itens do pedido
                    </div>

                    {Array.isArray(pedido.itens) && pedido.itens.length > 0 ? (
                        <div className="d-flex flex-column gap-1">
                            {pedido.itens.map((item, index) => (
                                <div
                                    key={item.id || index}
                                    className="d-flex align-items-center gap-2"
                                >
                                    <span className="fw-semibold">
                                        {item.quantidade || 0}x
                                    </span>

                                    <span>
                                        {item.produto || "Produto não identificado"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-muted small">
                            Nenhum item encontrado.
                        </div>
                    )}
                </div>
            )}
        </article>
    );
}

function AcompanharPedido() {
    const navigate = useNavigate();

    const [pedidos, setPedidos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        let ativo = true;

        async function carregarPedidos() {
            try {
                setCarregando(true);
                setErro("");

                const response = await listarMeusPedidos();

                if (ativo) {
                    const lista = Array.isArray(response.data)
                        ? response.data
                        : [];

                    setPedidos(lista);
                }
            } catch (error) {
                if (ativo) {
                    setErro(
                        error?.response?.data?.message ||
                            "Não foi possível carregar seus pedidos."
                    );
                }
            } finally {
                if (ativo) {
                    setCarregando(false);
                }
            }
        }

        carregarPedidos();

        return () => {
            ativo = false;
        };
    }, []);

    const pedidosAtuais = useMemo(() => {
        return pedidos.filter((pedido) => {
            const status = String(pedido?.status || "").toUpperCase();

            return !["ENTREGUE", "RETIRADO", "CANCELADO"].includes(status);
        });
    }, [pedidos]);

    const historico = useMemo(() => {
        return pedidos.filter((pedido) => {
            const status = String(pedido?.status || "").toUpperCase();

            return ["ENTREGUE", "RETIRADO", "CANCELADO"].includes(status);
        });
    }, [pedidos]);

    return (
        <div className="container py-4 pb-5">
            <section className="mb-4">
                <div className="card border-0 shadow-sm">
                    <div className="card-body p-4 p-md-5">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <span className="badge text-bg-primary rounded-pill mb-2">Pedidos</span>

                                <h1 className="display-6 fw-bold mb-2">Acompanhe seu pedido</h1>

                                <p className="text-muted mb-0">Consulte o andamento do seu pedido e seu histórico.</p>
                            </div>

                            <button
                                type="button"
                                className="btn btn-outline-primary rounded-pill"
                                onClick={() => navigate("/minha-conta")}
                            >
                                Meus dados
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {erro && (
                <div className="alert alert-danger" role="alert">
                    {erro}
                </div>
            )}

            {carregando ? (
                <div className="card border-0 shadow-sm">
                    <div className="card-body py-5">
                        <div className="d-flex justify-content-center">
                            <div className="spinner-border" role="status" aria-label="Carregando pedidos" />
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <section className="card border-0 shadow-sm mb-4">
                        <div className="card-body p-4">
                            <h2 className="h4 mb-4">Pedido atual</h2>

                            {pedidosAtuais.length > 0 ? (
                                <div className="d-flex flex-column gap-3">
                                    {pedidosAtuais.map((pedido) => (
                                        <PedidoResumo key={pedido.id} pedido={pedido} mostrarItens />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-muted">Você não possui nenhum pedido em andamento.</div>
                            )}
                        </div>
                    </section>

                    <section className="card border-0 shadow-sm">
                        <div className="card-body p-4">
                            <h2 className="h4 mb-4">Histórico de pedidos</h2>

                            {historico.length === 0 ? (
                                <div className="text-muted">Nenhum pedido finalizado encontrado.</div>
                            ) : (
                                <div className="d-flex flex-column gap-3">
                                    {historico.map((pedido) => (
                                        <PedidoResumo key={pedido.id} pedido={pedido} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </>
            )}

            <div className="mt-4">
                <button
                    type="button"
                    className="btn btn-outline-primary rounded-pill"
                    onClick={() => navigate("/cardapio")}
                >
                    ← Voltar ao cardápio
                </button>
            </div>
        </div>
    );
}

export default AcompanharPedido;
