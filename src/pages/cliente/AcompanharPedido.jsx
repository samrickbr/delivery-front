import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { listarMeusPedidos, buscarPedidoCliente } from "../../services/pedidoService";
import { obterNumeroPedido } from "../../utils/pedidoUtils";

const HISTORICO_POR_PAGINA = 10;

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

function obterDataPedido(pedido) {
    return pedido?.dataPedido ?? pedido?.dataCriacao;
}

function obterTimestampPedido(pedido) {
    const data = obterDataPedido(pedido);
    const timestamp = data ? new Date(data).getTime() : 0;

    return Number.isNaN(timestamp) ? 0 : timestamp;
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

    if (status === "EM_PRODUCAO") {
        return "Em produção";
    }

    if (status === "AGUARDANDO_SEPARACAO") {
        return "Em separação";
    }

    if (status === "SEPARADO") {
        return "Pedido pronto";
    }

    if (status === "SAIU_ENTREGA") {
        return "Saiu para entrega";
    }

    if (status === "FINALIZADO") {
        return "Pedido pronto";
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

const STATUS_ATUAIS = ["RECEBIDO", "APROVADO", "EM_PRODUCAO", "AGUARDANDO_SEPARACAO", "SEPARADO", "SAIU_ENTREGA"];

const STATUS_HISTORICO = ["ENTREGUE", "RETIRADO", "FINALIZADO", "CANCELADO"];

function pedidoEhAtual(pedido) {
    const status = String(pedido?.status || "").toUpperCase();

    return STATUS_ATUAIS.includes(status);
}

function pedidoEhHistorico(pedido) {
    const status = String(pedido?.status || "").toUpperCase();

    return STATUS_HISTORICO.includes(status);
}

function PedidoResumo({ pedido, mostrarItens = false }) {
    return (
        <article className="border rounded-3 p-3">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                <div>
                    <div className="fw-semibold">
                        {formatarData(obterDataPedido(pedido))}
                    </div>

                    <div className="text-muted small">
                        Pedido {obterNumeroPedido(pedido)}
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
                    <div className="fw-semibold mb-2">Itens do pedido</div>

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
                                        {item.produto ||
                                            item.produtoNome ||
                                            "Produto não identificado"}
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
    const [agora] = useState(() => Date.now());

    const [filtroStatus, setFiltroStatus] = useState("TODOS");
    const [filtroPeriodo, setFiltroPeriodo] = useState("TODOS");
    const [ordenacao, setOrdenacao] = useState("RECENTES");
    const [paginaHistorico, setPaginaHistorico] = useState(1);

    useEffect(() => {
        let ativo = true;

        async function carregarPedidos() {
            try {
                setCarregando(true);
                setErro("");

                const response = await listarMeusPedidos();
                const lista = Array.isArray(response.data) ? response.data : [];

                const pedidosDetalhados = await Promise.all(
                    lista.map(async (pedido) => {
                        if (!pedido?.id) {
                            return pedido;
                        }

                        try {
                            const detalhe = await buscarPedidoCliente(pedido.id);

                           return {
                               ...pedido,
                               numero: detalhe.data?.numero ?? pedido.numero
                           };
                        } catch {
                            return pedido;
                        }
                    })
                );

                if (ativo) {
                    setPedidos(pedidosDetalhados);
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
        return pedidos.filter(pedidoEhAtual).sort((a, b) => obterTimestampPedido(b) - obterTimestampPedido(a));
    }, [pedidos]);

    const historicoFiltrado = useMemo(() => {
        let resultado = pedidos.filter(pedidoEhHistorico);

        if (filtroStatus !== "TODOS") {
            resultado = resultado.filter((pedido) => {
                const status = String(pedido?.status || "").toUpperCase();

                return status === filtroStatus;
            });
        }

        if (filtroPeriodo !== "TODOS") {
            const dias = Number(filtroPeriodo);
            const limite = agora - dias * 24 * 60 * 60 * 1000;

            resultado = resultado.filter((pedido) => {
                const timestamp = obterTimestampPedido(pedido);

                return timestamp >= limite;
            });
        }

        resultado.sort((a, b) => {
            if (ordenacao === "ANTIGOS") {
                return obterTimestampPedido(a) - obterTimestampPedido(b);
            }

            if (ordenacao === "MAIOR_VALOR") {
                return Number(b?.valorTotal || 0) - Number(a?.valorTotal || 0);
            }

            if (ordenacao === "MENOR_VALOR") {
                return Number(a?.valorTotal || 0) - Number(b?.valorTotal || 0);
            }

            return obterTimestampPedido(b) - obterTimestampPedido(a);
        });

        return resultado;
    }, [pedidos, filtroStatus, filtroPeriodo, ordenacao, agora]);

    const totalPaginasHistorico = Math.max(
        1,
        Math.ceil(historicoFiltrado.length / HISTORICO_POR_PAGINA)
    );

    const paginaHistoricoAtual = Math.min(paginaHistorico, totalPaginasHistorico);

    const historicoPaginado = useMemo(() => {
        const inicio = (paginaHistoricoAtual - 1) * HISTORICO_POR_PAGINA;

        return historicoFiltrado.slice(inicio, inicio + HISTORICO_POR_PAGINA);
    }, [historicoFiltrado, paginaHistoricoAtual]);

    return (
        <div className="container py-4 pb-5">
            <section className="mb-4">
                <div className="card border-0 shadow-sm">
                    <div className="card-body p-4 p-md-5">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <span className="badge text-bg-primary rounded-pill mb-2">
                                    Pedidos
                                </span>

                                <h1 className="display-6 fw-bold mb-2">
                                    Acompanhe seu pedido
                                </h1>

                                <p className="text-muted mb-0">
                                    Consulte o andamento do seu pedido e seu histórico.
                                </p>
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
                            <div
                                className="spinner-border"
                                role="status"
                                aria-label="Carregando pedidos"
                            />
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
                                        <PedidoResumo
                                            key={pedido.id}
                                            pedido={pedido}
                                            mostrarItens
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-muted">
                                    Você não possui nenhum pedido em andamento.
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="card border-0 shadow-sm">
                        <div className="card-body p-4">
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                                <h2 className="h4 mb-0">
                                    Histórico de pedidos
                                </h2>

                                <div className="text-muted small">
                                    {historicoFiltrado.length} pedido(s)
                                </div>
                            </div>

                            <div className="row g-2 mb-4">
                                <div className="col-12 col-md-4">
                                    <label
                                        htmlFor="filtroStatus"
                                        className="form-label small fw-semibold"
                                    >
                                        Status
                                    </label>

                                    <select
                                        id="filtroStatus"
                                        className="form-select"
                                        value={filtroStatus}
                                        onChange={(event) =>
                                            setFiltroStatus(event.target.value)
                                        }
                                    >
                                        <option value="TODOS">
                                            Todos
                                        </option>
                                        <option value="ENTREGUE">
                                            Entregues
                                        </option>
                                        <option value="RETIRADO">
                                            Retirados
                                        </option>
                                        <option value="CANCELADO">
                                            Cancelados
                                        </option>
                                    </select>
                                </div>

                                <div className="col-12 col-md-4">
                                    <label
                                        htmlFor="filtroPeriodo"
                                        className="form-label small fw-semibold"
                                    >
                                        Período
                                    </label>

                                    <select
                                        id="filtroPeriodo"
                                        className="form-select"
                                        value={filtroPeriodo}
                                        onChange={(event) =>
                                            setFiltroPeriodo(event.target.value)
                                        }
                                    >
                                        <option value="TODOS">
                                            Todo o histórico
                                        </option>
                                        <option value="7">
                                            Últimos 7 dias
                                        </option>
                                        <option value="30">
                                            Últimos 30 dias
                                        </option>
                                        <option value="90">
                                            Últimos 90 dias
                                        </option>
                                    </select>
                                </div>

                                <div className="col-12 col-md-4">
                                    <label
                                        htmlFor="ordenacao"
                                        className="form-label small fw-semibold"
                                    >
                                        Classificar
                                    </label>

                                    <select
                                        id="ordenacao"
                                        className="form-select"
                                        value={ordenacao}
                                        onChange={(event) =>
                                            setOrdenacao(event.target.value)
                                        }
                                    >
                                        <option value="RECENTES">
                                            Mais recentes
                                        </option>
                                        <option value="ANTIGOS">
                                            Mais antigos
                                        </option>
                                        <option value="MAIOR_VALOR">
                                            Maior valor
                                        </option>
                                        <option value="MENOR_VALOR">
                                            Menor valor
                                        </option>
                                    </select>
                                </div>
                            </div>

                            {historicoFiltrado.length === 0 ? (
                                <div className="text-muted">
                                    Nenhum pedido finalizado encontrado.
                                </div>
                            ) : (
                                <>
                                    <div className="d-flex flex-column gap-3">
                                        {historicoPaginado.map((pedido) => (
                                            <PedidoResumo
                                                key={pedido.id}
                                                pedido={pedido}
                                            />
                                        ))}
                                    </div>

                                    {totalPaginasHistorico > 1 && (
                                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-4 pt-3 border-top">
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary"
                                                disabled={paginaHistorico === 1}
                                                onClick={() =>
                                                    setPaginaHistorico(
                                                        (pagina) =>
                                                            Math.max(1, pagina - 1)
                                                    )
                                                }
                                            >
                                                ← Anterior
                                            </button>

                                            <span className="small text-muted">
                                                Página {paginaHistorico} de{" "}
                                                {totalPaginasHistorico}
                                            </span>

                                            <button
                                                type="button"
                                                className="btn btn-outline-primary"
                                                disabled={
                                                    paginaHistorico ===
                                                    totalPaginasHistorico
                                                }
                                                onClick={() =>
                                                    setPaginaHistorico(
                                                        (pagina) =>
                                                            Math.min(
                                                                totalPaginasHistorico,
                                                                pagina + 1
                                                            )
                                                    )
                                                }
                                            >
                                                Próxima →
                                            </button>
                                        </div>
                                    )}
                                </>
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
