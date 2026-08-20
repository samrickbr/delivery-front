import { useMemo, useState } from "react";
import { criarPedido } from "../../services/pedidoService";

const TIPOS_RECEBIMENTO = {
    RETIRADA: "RETIRADA",
    ENTREGA: "ENTREGA"
};

const FORMAS_PAGAMENTO = [
    {
        id: 1,
        nome: "PIX"
    },
    {
        id: 2,
        nome: "Cartão"
    },
    {
        id: 3,
        nome: "Dinheiro"
    }
];

function formatarValor(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function obterCliente() {
    try {
        return JSON.parse(sessionStorage.getItem("cliente")) || {};
    } catch {
        return {};
    }
}

function Checkout() {
    const cliente = obterCliente();

    const [tipoRecebimento, setTipoRecebimento] = useState(TIPOS_RECEBIMENTO.RETIRADA);

    const [enderecoSelecionado, setEnderecoSelecionado] = useState("");

    const [pagamentos, setPagamentos] = useState([]);

    const [observacao, setObservacao] = useState("");

    const [erro, setErro] = useState("");

    const [enviando, setEnviando] = useState(false);

    const [pedidoCriado, setPedidoCriado] = useState(null);

    const [carrinho, setCarrinho] = useState(() => {
        try {
            return JSON.parse(sessionStorage.getItem("carrinho")) || [];
        } catch {
            return [];
        }
    });

    const valorProdutos = useMemo(() => {
        return carrinho.reduce((total, item) => {
            return total + Number(item.preco || 0) * Number(item.quantidade || 0);
        }, 0);
    }, [carrinho]);

    /*
     * Nesta etapa:
     * - retirada = taxa 0
     * - entrega = aguarda cálculo oficial do Backend
     */
    const taxaEntrega = tipoRecebimento === TIPOS_RECEBIMENTO.RETIRADA ? 0 : null;

    const valorTotal = taxaEntrega === null ? null : valorProdutos + taxaEntrega;

    const totalPagamentos = useMemo(() => {
        return pagamentos.reduce((total, pagamento) => total + Number(pagamento.valor || 0), 0);
    }, [pagamentos]);

    const diferencaPagamento = valorTotal === null ? null : valorTotal - totalPagamentos;

    function adicionarPagamento() {
        setPagamentos((estado) => [
            ...estado,
            {
                formaPagamentoId: "",
                valor: "",
                confirmado: false
            }
        ]);

        setErro("");
    }

    function alterarPagamento(index, campo, valor) {
        setPagamentos((estado) =>
            estado.map((pagamento, pagamentoIndex) =>
                pagamentoIndex === index
                    ? {
                          ...pagamento,
                          [campo]: valor,
                          confirmado: false
                      }
                    : pagamento
            )
        );

        setErro("");
    }

    function confirmarPagamento(index) {
        setPagamentos((estado) =>
            estado.map((pagamento, pagamentoIndex) =>
                pagamentoIndex === index
                    ? {
                          ...pagamento,
                          confirmado: true
                      }
                    : pagamento
            )
        );

        setErro("");
    }

    function removerPagamento(index) {
        setPagamentos((estado) => estado.filter((_, pagamentoIndex) => pagamentoIndex !== index));

        setErro("");
    }

    function selecionarTipoRecebimento(tipo) {
        setTipoRecebimento(tipo);
        setErro("");

        if (tipo === TIPOS_RECEBIMENTO.RETIRADA) {
            setEnderecoSelecionado("");
        }
    }

    function validarCheckout() {
        if (carrinho.length === 0) {
            setErro("Seu carrinho está vazio.");
            return false;
        }

        if (!cliente.clienteId) {
            setErro("Cliente não identificado. Volte para a identificação.");
            return false;
        }

        if (tipoRecebimento === TIPOS_RECEBIMENTO.ENTREGA && !enderecoSelecionado) {
            setErro("Selecione um endereço para entrega.");
            return false;
        }

        if (pagamentos.length === 0) {
            setErro("Adicione pelo menos uma forma de pagamento.");
            return false;
        }

        for (const pagamento of pagamentos) {
            if (!pagamento.formaPagamentoId) {
                setErro("Selecione a forma de pagamento.");
                return false;
            }

            if (!pagamento.valor || Number(pagamento.valor) <= 0) {
                setErro("Informe um valor válido para cada pagamento.");
                return false;
            }

            if (!pagamento.confirmado) {
                setErro("Confirme todos os pagamentos antes de validar o checkout.");
                return false;
            }
        }

        if (valorTotal === null) {
            setErro("O total oficial do pedido ainda não está disponível.");
            return false;
        }

        if (Math.abs(totalPagamentos - valorTotal) > 0.009) {
            setErro(`A soma dos pagamentos deve corresponder ao total de ${formatarValor(valorTotal)}.`);
            return false;
        }

        return true;
    }

    async function prepararCheckout() {
        setErro("");

        if (!validarCheckout()) {
            return;
        }

        if (enviando) {
            return;
        }

        const pedido = {
            clienteNome: cliente.nome?.trim() || "",
            clienteWhatsapp: cliente.telefone || cliente.whatsapp || "",
            observacao: observacao.trim(),
            pagamentos: pagamentos.map((pagamento) => ({
                formaPagamentoId: Number(pagamento.formaPagamentoId),
                valor: Number(pagamento.valor)
            })),
            tipoRecebimento,
            enderecoId: tipoRecebimento === TIPOS_RECEBIMENTO.ENTREGA ? Number(enderecoSelecionado) : null,
            itens: carrinho.map((item) => ({
                produtoId: item.id,
                quantidade: item.quantidade
            }))
        };

        try {
            setEnviando(true);

            console.log("Enviando pedido:", pedido);

            const response = await criarPedido(pedido);

            setPedidoCriado(response.data);

            sessionStorage.removeItem("carrinho");

            setCarrinho([]);
        } catch (error) {
            console.error(error);

            setErro(error?.response?.data?.message || "Não foi possível enviar o pedido. Tente novamente.");
        } finally {
            setEnviando(false);
        }
    }

    if (pedidoCriado) {
        return (
            <div className="card mt-4 shadow">
                <div className="card-body">
                    <div className="text-center">
                        <h2>Pedido recebido!</h2>

                        <p className="mb-3">Seu pedido foi enviado com sucesso.</p>

                        {pedidoCriado.id && <h3 className="mb-3">Pedido #{pedidoCriado.id}</h3>}

                        {pedidoCriado.status && (
                            <p className="mb-2">
                                <strong>Status:</strong> {pedidoCriado.status}
                            </p>
                        )}

                        {pedidoCriado.valorTotal !== undefined && (
                            <p className="mb-3">
                                <strong>Total:</strong> {formatarValor(pedidoCriado.valorTotal)}
                            </p>
                        )}

                        <p className="text-muted mb-0">Em breve você receberá atualizações sobre o pedido.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card mt-4 shadow">
            <div className="card-body">
                <h3 className="mb-4">Revisar pedido</h3>

                {erro && (
                    <div className="alert alert-danger" role="alert">
                        {erro}
                    </div>
                )}

                {/* CLIENTE */}
                <div className="mb-4">
                    <h5>Cliente</h5>

                    <div className="border rounded p-3">
                        <p className="mb-1">
                            <strong>Nome:</strong> {cliente.nome || "Não disponível"}
                        </p>

                        <p className="mb-1">
                            <strong>CPF:</strong> {cliente.cpf || "Não disponível"}
                        </p>

                        <p className="mb-0">
                            <strong>WhatsApp:</strong> {cliente.telefone || cliente.whatsapp || "Não disponível"}
                        </p>
                    </div>
                </div>

                {/* PEDIDO */}
                <div className="mb-4">
                    <h5>Pedido</h5>

                    {carrinho.length === 0 ? (
                        <div className="alert alert-warning">Seu carrinho está vazio.</div>
                    ) : (
                        <ul className="list-group mb-3">
                            {carrinho.map((item) => {
                                const valorItem = Number(item.preco || 0) * Number(item.quantidade || 0);

                                return (
                                    <li
                                        key={item.id}
                                        className="list-group-item d-flex justify-content-between align-items-center"
                                    >
                                        <span>
                                            {item.quantidade}x {item.nome}
                                        </span>

                                        <strong>{formatarValor(valorItem)}</strong>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* TIPO DE RECEBIMENTO */}
                <div className="mb-4">
                    <h5>Como deseja receber?</h5>

                    <div className="d-grid gap-2">
                        <button
                            type="button"
                            className={
                                tipoRecebimento === TIPOS_RECEBIMENTO.RETIRADA
                                    ? "btn btn-primary"
                                    : "btn btn-outline-primary"
                            }
                            onClick={() => selecionarTipoRecebimento(TIPOS_RECEBIMENTO.RETIRADA)}
                            disabled={enviando}
                        >
                            Retirar no local
                        </button>

                        <button
                            type="button"
                            className={
                                tipoRecebimento === TIPOS_RECEBIMENTO.ENTREGA
                                    ? "btn btn-primary"
                                    : "btn btn-outline-primary"
                            }
                            onClick={() => selecionarTipoRecebimento(TIPOS_RECEBIMENTO.ENTREGA)}
                            disabled={enviando}
                        >
                            Receber por entrega
                        </button>
                    </div>
                </div>

                {/* ENDEREÇO */}
                {tipoRecebimento === TIPOS_RECEBIMENTO.ENTREGA && (
                    <div className="mb-4">
                        <h5>Endereço de entrega</h5>

                        <div className="alert alert-warning">
                            O endpoint de endereços do cliente ainda não está exposto pelo Delivery Back.
                        </div>

                        <input
                            className="form-control"
                            type="number"
                            placeholder="enderecoId"
                            value={enderecoSelecionado}
                            onChange={(e) => setEnderecoSelecionado(e.target.value)}
                            disabled={enviando}
                        />
                    </div>
                )}

                {/* VALORES */}
                <div className="border rounded p-3 mb-4">
                    <h5>Valores</h5>

                    <div className="d-flex justify-content-between mb-1">
                        <span>Produtos</span>

                        <strong>{formatarValor(valorProdutos)}</strong>
                    </div>

                    <div className="d-flex justify-content-between mb-1">
                        <span>Taxa de entrega</span>

                        <strong>{taxaEntrega === null ? "A calcular pelo Backend" : formatarValor(taxaEntrega)}</strong>
                    </div>

                    <hr />

                    <div className="d-flex justify-content-between">
                        <strong>Total</strong>

                        <strong>{valorTotal === null ? "Aguardando Backend" : formatarValor(valorTotal)}</strong>
                    </div>
                </div>

                {/* PAGAMENTOS */}
                <div className="mb-4">
                    <h5 className="mb-3">Pagamentos</h5>

                    {pagamentos.length === 0 && (
                        <div className="alert alert-secondary">Nenhum pagamento adicionado.</div>
                    )}

                    {pagamentos.map((pagamento, index) => (
                        <div key={index} className="border rounded p-3 mb-3">
                            <div className="fw-semibold mb-3">Pagamento {index + 1}</div>

                            <div className="row g-2 align-items-end">
                                <div className="col-md-5">
                                    <label className="form-label">Forma de pagamento</label>

                                    <select
                                        className="form-select"
                                        value={pagamento.formaPagamentoId}
                                        onChange={(e) => alterarPagamento(index, "formaPagamentoId", e.target.value)}
                                        disabled={enviando}
                                    >
                                        <option value="">Selecione</option>

                                        {FORMAS_PAGAMENTO.map((forma) => (
                                            <option key={forma.id} value={forma.id}>
                                                {forma.nome}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label">Valor</label>

                                    <input
                                        className="form-control"
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        placeholder="0,00"
                                        value={pagamento.valor}
                                        onChange={(e) => alterarPagamento(index, "valor", e.target.value)}
                                        disabled={enviando}
                                    />
                                </div>

                                <div className="col-md-3 d-flex gap-2">
                                    <button
                                        type="button"
                                        className={
                                            pagamento.confirmado
                                                ? "btn btn-success flex-grow-1"
                                                : "btn btn-outline-success flex-grow-1"
                                        }
                                        onClick={() => confirmarPagamento(index)}
                                        disabled={enviando || !pagamento.formaPagamentoId || !pagamento.valor}
                                    >
                                        {pagamento.confirmado ? "OK" : "OK"}
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        onClick={() => removerPagamento(index)}
                                        disabled={enviando}
                                    >
                                        Remover
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="text-center mb-3">
                        <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={adicionarPagamento}
                            disabled={enviando}
                        >
                            + Adicionar pagamento
                        </button>
                    </div>

                    <div className="border rounded p-3">
                        <div className="d-flex justify-content-between">
                            <span>Total dos pagamentos</span>

                            <strong>{formatarValor(totalPagamentos)}</strong>
                        </div>

                        {diferencaPagamento !== null && (
                            <div className="d-flex justify-content-between mt-2">
                                <span>Diferença</span>

                                <strong>{formatarValor(diferencaPagamento)}</strong>
                            </div>
                        )}
                    </div>
                </div>

                {/* OBSERVAÇÃO */}
                <div className="mb-4">
                    <h5>Observação</h5>

                    <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Observação do pedido (opcional)"
                        value={observacao}
                        onChange={(e) => setObservacao(e.target.value)}
                        disabled={enviando}
                    />
                </div>

                {/* RESUMO */}
                <div className="border rounded p-3 mb-4">
                    <h5>Resumo final</h5>

                    <p className="mb-1">
                        <strong>Cliente:</strong> {cliente.nome || "Não disponível"}
                    </p>

                    <p className="mb-1">
                        <strong>Recebimento:</strong> {tipoRecebimento}
                    </p>

                    {tipoRecebimento === TIPOS_RECEBIMENTO.ENTREGA && (
                        <p className="mb-1">
                            <strong>Endereço:</strong> {enderecoSelecionado || "Não selecionado"}
                        </p>
                    )}

                    <p className="mb-1">
                        <strong>Total:</strong> {valorTotal === null ? "Aguardando Backend" : formatarValor(valorTotal)}
                    </p>

                    <p className="mb-0">
                        <strong>Pagamentos:</strong> {formatarValor(totalPagamentos)}
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-success btn-lg w-100"
                    disabled={enviando || carrinho.length === 0}
                    onClick={prepararCheckout}
                >
                    {enviando ? "Enviando pedido..." : "Validar checkout"}
                </button>
            </div>
        </div>
    );
}

export default Checkout;
