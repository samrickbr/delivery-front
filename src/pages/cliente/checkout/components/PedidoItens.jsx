import { formatarValor } from "../checkoutUtils";

function PedidoItens({ carrinho }) {
    const quantidadeTotal = carrinho.reduce((total, item) => total + Number(item.quantidade || 0), 0);

    return (
        <section className="card border-0 shadow-sm">
            <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h2 className="h6 mb-0">Itens do pedido</h2>

                        <span className="text-muted small">Produtos selecionados</span>
                    </div>

                    <span className="badge text-bg-light border rounded-pill">
                        {quantidadeTotal} {quantidadeTotal === 1 ? "item" : "itens"}
                    </span>
                </div>

                {carrinho.length === 0 ? (
                    <div className="alert alert-warning mb-0">Seu carrinho está vazio.</div>
                ) : (
                    <div className="d-flex flex-column">
                        {carrinho.map((item) => {
                            const quantidade = Number(item.quantidade || 0);
                            const valorUnitario = Number(item.preco || 0);
                            const valorItem = valorUnitario * quantidade;

                            return (
                                <div key={item.id} className="d-flex align-items-center gap-3 py-2 border-bottom">
                                    {item.imagem ? (
                                        <img
                                            src={item.imagem}
                                            alt={item.nome}
                                            className="rounded-3"
                                            style={{
                                                width: "56px",
                                                height: "56px",
                                                objectFit: "cover",
                                                flexShrink: 0
                                            }}
                                        />
                                    ) : (
                                        <div
                                            className="d-flex align-items-center justify-content-center bg-body-secondary rounded-3"
                                            style={{
                                                width: "56px",
                                                height: "56px",
                                                flexShrink: 0
                                            }}
                                        >
                                            🍽️
                                        </div>
                                    )}

                                    <div className="flex-grow-1 min-w-0">
                                        <h3 className="h6 mb-0">{item.nome}</h3>

                                        <span className="text-muted small">
                                            {quantidade}x {formatarValor(valorUnitario)}
                                        </span>
                                    </div>

                                    <strong className="text-nowrap">{formatarValor(valorItem)}</strong>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}

export default PedidoItens;
