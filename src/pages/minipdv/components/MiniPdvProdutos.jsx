import { useEffect, useMemo, useRef, useState } from "react";
import api from "../../../services/api";
import { formatarValor } from "../../cardapio/cardapioUtils";

function MiniPdvProdutos({
    carrinho = [],
    onAdicionarProduto
}) {
    const [produtos, setProdutos] = useState([]);
    const [busca, setBusca] = useState("");
    const [indiceSelecionado, setIndiceSelecionado] =
        useState(0);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const campoBuscaRef = useRef(null);
    const resultadosRef = useRef(null);

    useEffect(() => {
        async function carregarProdutos() {
            try {
                setCarregando(true);
                setErro("");

                const response = await api.get(
                    "/produtos/cardapio"
                );

                setProdutos(response.data || []);
            } catch (error) {
                console.error(
                    "Erro ao carregar produtos.",
                    error
                );

                setErro(
                    "Não foi possível carregar os produtos."
                );
            } finally {
                setCarregando(false);
            }
        }

        carregarProdutos();
    }, []);

    useEffect(() => {
        campoBuscaRef.current?.focus();
    }, [carregando]);

    const produtosEncontrados = useMemo(() => {
        const termo = busca.trim().toLowerCase();

        if (!termo) {
            return [];
        }

        return produtos.filter((produto) => {
            const nome = String(
                produto.nome || ""
            ).toLowerCase();

            const codigo = String(
                produto.codigoBarras ||
                    produto.codigo ||
                    produto.codigoInterno ||
                    ""
            ).toLowerCase();

            return (
                nome.includes(termo) ||
                codigo.includes(termo)
            );
        });
    }, [produtos, busca]);

    function obterQuantidade(produtoId) {
        const item = carrinho.find(
            (item) => item.id === produtoId
        );

        return Number(item?.quantidade || 0);
    }

    function selecionarProduto(produto) {
        onAdicionarProduto(produto);

        setBusca("");
        setIndiceSelecionado(0);

        requestAnimationFrame(() => {
            campoBuscaRef.current?.focus();
        });
    }

    function selecionarProdutoSelecionado() {
        if (
            produtosEncontrados.length === 0
        ) {
            return;
        }

        const produto =
            produtosEncontrados[
                indiceSelecionado
            ];

        if (!produto) {
            return;
        }

        selecionarProduto(produto);
    }

    function handleBuscaKeyDown(event) {
        if (
            event.key === "ArrowDown"
        ) {
            event.preventDefault();

            if (
                produtosEncontrados.length ===
                0
            ) {
                return;
            }

            setIndiceSelecionado(
                (indiceAtual) =>
                    (indiceAtual + 1) %
                    produtosEncontrados.length
            );

            return;
        }

        if (
            event.key === "ArrowUp"
        ) {
            event.preventDefault();

            if (
                produtosEncontrados.length ===
                0
            ) {
                return;
            }

            setIndiceSelecionado(
                (indiceAtual) =>
                    (indiceAtual -
                        1 +
                        produtosEncontrados.length) %
                    produtosEncontrados.length
            );

            return;
        }

        if (event.key === "Enter") {
            event.preventDefault();

            selecionarProdutoSelecionado();
        }

        if (event.key === "Escape") {
            event.preventDefault();

            setBusca("");
            setIndiceSelecionado(0);

            requestAnimationFrame(() => {
                campoBuscaRef.current?.focus();
            });
        }
    }

    useEffect(() => {
        const resultadoSelecionado =
            resultadosRef.current?.querySelector(
                `[data-indice="${indiceSelecionado}"]`
            );

        resultadoSelecionado?.scrollIntoView({
            block: "nearest"
        });
    }, [indiceSelecionado]);

    if (carregando) {
        return (
            <div className="card border-0 shadow-sm">
                <div className="card-body text-center py-5">
                    <div
                        className="spinner-border"
                        role="status"
                    />

                    <p className="text-muted mt-3 mb-0">
                        Carregando produtos...
                    </p>
                </div>
            </div>
        );
    }

    if (erro) {
        return (
            <div className="alert alert-danger">
                {erro}
            </div>
        );
    }

    return (
        <div className="card border-0 shadow-sm">
            <div className="card-body">
                <div className="mb-3">
                    <label
                        htmlFor="mini-pdv-busca"
                        className="form-label fw-semibold"
                    >
                        Código de barras / Produto
                    </label>

                    <input
                        ref={campoBuscaRef}
                        id="mini-pdv-busca"
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Passe o leitor ou digite o produto"
                        value={busca}
                        onChange={(event) =>
                            setBusca(
                                event.target.value
                            )
                        }
                        onKeyDown={
                            handleBuscaKeyDown
                        }
                        autoComplete="off"
                        autoFocus
                    />
                </div>

                {busca && (
                    <div>
                        {produtosEncontrados.length ===
                        0 ? (
                            <div className="alert alert-warning mb-0">
                                Produto não encontrado.
                            </div>
                        ) : (
                            <>
                                <div className="small text-muted mb-2">
                                    {produtosEncontrados.length}{" "}
                                    produto(s) encontrado(s)
                                    {" — "}
                                    ↑ ↓ navegar · ENTER
                                    selecionar · ESC
                                    limpar
                                </div>

                                <div
                                    ref={resultadosRef}
                                    className="list-group"
                                    style={{
                                        maxHeight:
                                            "360px",
                                        overflowY:
                                            "auto"
                                    }}
                                >
                                    {produtosEncontrados.map(
                                        (
                                            produto,
                                            index
                                        ) => {
                                            const selecionado =
                                                index ===
                                                indiceSelecionado;

                                            const quantidade =
                                                obterQuantidade(
                                                    produto.id
                                                );

                                            const codigo =
                                                produto.codigoBarras ||
                                                produto.codigo ||
                                                produto.codigoInterno ||
                                                "-";

                                            return (
                                                <button
                                                    key={
                                                        produto.id
                                                    }
                                                    type="button"
                                                    data-indice={
                                                        index
                                                    }
                                                    className={`list-group-item list-group-item-action ${
                                                        selecionado
                                                            ? "active"
                                                            : ""
                                                    }`}
                                                    onMouseEnter={() =>
                                                        setIndiceSelecionado(
                                                            index
                                                        )
                                                    }
                                                    onClick={() =>
                                                        selecionarProduto(
                                                            produto
                                                        )
                                                    }
                                                >
                                                    <div className="d-flex align-items-center justify-content-between gap-3">
                                                        <div className="text-start">
                                                            <div className="fw-semibold">
                                                                {
                                                                    produto.nome
                                                                }
                                                            </div>

                                                            <small
                                                                className={
                                                                    selecionado
                                                                        ? "text-white-50"
                                                                        : "text-muted"
                                                                }
                                                            >
                                                                Código:{" "}
                                                                {
                                                                    codigo
                                                                }
                                                            </small>
                                                        </div>

                                                        <div className="text-end">
                                                            <div className="fw-semibold">
                                                                {formatarValor(
                                                                    produto.preco
                                                                )}
                                                            </div>

                                                            {quantidade >
                                                                0 && (
                                                                <small
                                                                    className={
                                                                        selecionado
                                                                            ? "text-white-50"
                                                                            : "text-muted"
                                                                    }
                                                                >
                                                                    Na venda:{" "}
                                                                    {
                                                                        quantidade
                                                                    }
                                                                </small>
                                                            )}
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        }
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {!busca && (
                    <div className="text-muted text-center py-4">
                        Aguardando produto...
                        <br />
                        <small>
                            Use o leitor de código de
                            barras ou digite para
                            pesquisar.
                        </small>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MiniPdvProdutos;
