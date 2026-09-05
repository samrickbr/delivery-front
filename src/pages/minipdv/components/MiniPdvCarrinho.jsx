import { useEffect, useRef } from "react";
import { formatarValor } from "../../cardapio/cardapioUtils";

function MiniPdvCarrinho({
    carrinho = [],
    onAdicionarProduto,
    onDiminuirProduto,
    onRemoverProduto
}) {
    const listaItensRef = useRef(null);
    const quantidadeItensAnteriorRef = useRef(carrinho.length);

    useEffect(() => {
        const houveInclusao = carrinho.length > quantidadeItensAnteriorRef.current;

        quantidadeItensAnteriorRef.current = carrinho.length;

        if (!houveInclusao) {
            return;
        }

        const animationFrameId = requestAnimationFrame(() => {
            const listaItens = listaItensRef.current;

            if (listaItens) {
                listaItens.scrollTop = listaItens.scrollHeight;
            }
        });

        return () => cancelAnimationFrame(animationFrameId);
    }, [carrinho.length]);

    return (
        <div
            className="d-flex flex-column flex-grow-1"
            style={{
                minHeight: 0
            }}
        >
            {carrinho.length === 0 ? (
                <div className="d-flex flex-column flex-grow-1 align-items-center justify-content-center text-muted text-center p-4">
                    <div className="fs-1 mb-2">
                        +
                    </div>

                    <div className="fw-semibold">
                        Nenhum produto lançado
                    </div>

                    <small>
                        Digite o código de barras ou
                        pesquise um produto.
                    </small>
                </div>
            ) : (
                <>
                    {/* =================================================
                        CABEÇALHO DA TABELA
                    ================================================== */}
                    <div>
                        <table className="table table-sm mb-0 align-middle mini-pdv-items-table">
                            <thead className="table-light">
                                <tr>
                                    <th style={{ width: "45px" }}>
                                        Item
                                    </th>

                                    <th className="d-none d-xl-table-cell" style={{ width: "110px" }}>
                                        Código
                                    </th>

                                    <th>
                                        Descrição
                                    </th>

                                    <th
                                        className="text-center"
                                        style={{ width: "90px" }}
                                    >
                                        Qtd
                                    </th>

                                    <th
                                        className="text-end d-none d-xl-table-cell"
                                        style={{ width: "100px" }}
                                    >
                                        Unit.
                                    </th>

                                    <th
                                        className="text-end d-none d-md-table-cell"
                                        style={{ width: "100px" }}
                                    >
                                        Total
                                    </th>

                                    <th style={{ width: "45px" }} />
                                </tr>
                            </thead>
                        </table>
                    </div>

                    {/* =================================================
                        ITENS — ÚNICA ÁREA COM ROLAGEM
                    ================================================== */}
                    <div
                        ref={listaItensRef}
                        className={`flex-grow-1 ${carrinho.length > 6 ? "mini-pdv-items-scrollable" : ""}`}
                        style={{
                            minHeight: 0,
                            overflowY: "auto"
                        }}
                    >
                        <table className="table table-sm table-hover mb-0 align-middle mini-pdv-items-table">
                            <tbody>
                                {carrinho.map(
                                    (
                                        produto,
                                        index
                                    ) => {
                                        const quantidade =
                                            Number(
                                                produto.quantidade ||
                                                    0
                                            );

                                        const preco =
                                            Number(
                                                produto.preco ||
                                                    0
                                            );

                                        const total =
                                            quantidade *
                                            preco;

                                        const codigo =
                                            produto.codigoBarras ||
                                            produto.codigo ||
                                            produto.codigoInterno ||
                                            "-";

                                        return (
                                            <tr
                                                key={`${produto.id}-${index}`}
                                            >
                                                <td
                                                    style={{
                                                        width: "45px"
                                                    }}
                                                >
                                                    {index + 1}
                                                </td>

                                                <td
                                                    className="text-muted small d-none d-xl-table-cell"
                                                    style={{ width: "110px" }}
                                                >
                                                    {codigo}
                                                </td>

                                                <td className="overflow-hidden">
                                                    <div className="fw-semibold mini-pdv-item-description">
                                                        {
                                                            produto.nome
                                                        }
                                                    </div>

                                                    {produto.descricao && (
                                                        <small className="text-muted mini-pdv-item-description d-block">
                                                            {
                                                                produto.descricao
                                                            }
                                                        </small>
                                                    )}
                                                </td>

                                                <td
                                                    style={{
                                                        width: "90px"
                                                    }}
                                                >
                                                    <div className="d-flex align-items-center justify-content-center gap-1">
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-secondary"
                                                            onClick={() =>
                                                                onDiminuirProduto(
                                                                    produto
                                                                )
                                                            }
                                                        >
                                                            −
                                                        </button>

                                                        <span
                                                            className="fw-semibold px-1"
                                                            style={{
                                                                minWidth:
                                                                    "24px",
                                                                textAlign:
                                                                    "center"
                                                            }}
                                                        >
                                                            {
                                                                quantidade
                                                            }
                                                        </span>

                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-secondary"
                                                            onClick={() =>
                                                                onAdicionarProduto(
                                                                    produto
                                                                )
                                                            }
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </td>

                                                <td
                                                    className="text-end d-none d-xl-table-cell"
                                                    style={{
                                                        width: "100px"
                                                    }}
                                                >
                                                    {formatarValor(
                                                        preco
                                                    )}
                                                </td>

                                                <td
                                                    className="text-end fw-semibold d-none d-md-table-cell"
                                                    style={{
                                                        width: "100px"
                                                    }}
                                                >
                                                    {formatarValor(
                                                        total
                                                    )}
                                                </td>

                                                <td
                                                    className="text-end"
                                                    style={{
                                                        width: "45px"
                                                    }}
                                                >
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger"
                                                        title="Excluir item"
                                                        onClick={() =>
                                                            onRemoverProduto(
                                                                produto.id
                                                            )
                                                        }
                                                    >
                                                        ×
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    </div>

                </>
            )}
        </div>
    );
}

export default MiniPdvCarrinho;
