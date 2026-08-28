import { formatarValor } from "../../cardapio/cardapioUtils";

function MiniPdvCarrinho({
    carrinho = [],
    valorProdutos = 0,
    onAdicionarProduto,
    onDiminuirProduto,
    onRemoverProduto
}) {
    return (
        <div
            className="d-flex flex-column h-100"
            style={{
                minHeight: 0
            }}
        >
            {carrinho.length === 0 ? (
                <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted text-center p-4">
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
                    <div
                        className="table-responsive"
                        style={{
                            overflow: "hidden"
                        }}
                    >
                        <table className="table table-sm mb-0 align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th style={{ width: "45px" }}>
                                        Item
                                    </th>

                                    <th style={{ width: "130px" }}>
                                        Código
                                    </th>

                                    <th>
                                        Descrição
                                    </th>

                                    <th
                                        className="text-center"
                                        style={{ width: "100px" }}
                                    >
                                        Qtd
                                    </th>

                                    <th
                                        className="text-end"
                                        style={{ width: "120px" }}
                                    >
                                        Unit.
                                    </th>

                                    <th
                                        className="text-end"
                                        style={{ width: "120px" }}
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
                        className="flex-grow-1"
                        style={{
                            minHeight: 0,
                            overflowY: "auto",
                            overflowX: "hidden"
                        }}
                    >
                        <table className="table table-sm table-hover mb-0 align-middle">
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
                                                    className="text-muted small"
                                                    style={{
                                                        width: "130px"
                                                    }}
                                                >
                                                    {codigo}
                                                </td>

                                                <td>
                                                    <div className="fw-semibold">
                                                        {
                                                            produto.nome
                                                        }
                                                    </div>

                                                    {produto.descricao && (
                                                        <small className="text-muted">
                                                            {
                                                                produto.descricao
                                                            }
                                                        </small>
                                                    )}
                                                </td>

                                                <td
                                                    style={{
                                                        width: "100px"
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
                                                    className="text-end"
                                                    style={{
                                                        width: "120px"
                                                    }}
                                                >
                                                    {formatarValor(
                                                        preco
                                                    )}
                                                </td>

                                                <td
                                                    className="text-end fw-semibold"
                                                    style={{
                                                        width: "120px"
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

                    {/* =================================================
                        RODAPÉ FIXO DO TICKET
                    ================================================== */}
                    <div className="border-top bg-body p-3">
                        <div className="d-flex align-items-center justify-content-between">
                            <span className="fs-5 fw-semibold">
                                SUBTOTAL
                            </span>

                            <strong className="fs-2">
                                {formatarValor(
                                    valorProdutos
                                )}
                            </strong>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default MiniPdvCarrinho;
