import { useState } from "react";

import MiniPdvProdutos from "../components/MiniPdvProdutos";
import MiniPdvCarrinho from "../components/MiniPdvCarrinho";
import MiniPdvCliente from "../components/MiniPdvCliente";
import MiniPdvEndereco from "../components/MiniPdvEndereco";
import MiniPdvPagamentos from "../components/MiniPdvPagamentos";
import MiniPdvAcoes from "../components/MiniPdvAcoes";

import useMiniPdv from "../hooks/useMiniPdv";
import useMiniPdvCarrinho from "../hooks/useMiniPdvCarrinho";
import useMiniPdvFormasPagamento from "../hooks/useMiniPdvFormasPagamento";
import useMiniPdvPagamentos from "../hooks/useMiniPdvPagamentos";

import { criarPedidoOperacional } from "../../../services/pedidoService";

import BalcaoPainel from "../../../components/pedido/BalcaoPainel";
import { ABAS } from "../../../components/pedido/balcaoAbas";

const ABA_PDV = "pdv";

function MiniPdv() {
    const [aba, setAba] = useState(ABA_PDV);

    const {
        cliente,
        endereco,
        enderecos,
        tipoRecebimento,

        carregando,
        carregandoEnderecos,

        erro,
        erroEnderecos,

        podeFinalizar,

        selecionarCliente,
        selecionarEndereco,

        definirEntrega,
        definirRetirada,

        limparVenda
    } = useMiniPdv();

    const {
        carrinho,
        valorProdutos,
        adicionarProduto,
        diminuirProduto,
        removerProduto,
        limparCarrinho
    } = useMiniPdvCarrinho();

    const {
        formasPagamento,
        carregando: carregandoFormasPagamento,
        erro: erroFormasPagamento
    } = useMiniPdvFormasPagamento();

    const {
        pagamentos,
        totalPagamentos,
        adicionarPagamento,
        alterarPagamento,
        removerPagamento,
        limparPagamentos
    } = useMiniPdvPagamentos();

    function limparNovaVenda() {
        limparVenda();
        limparCarrinho();
        limparPagamentos();
    }

    function validarPagamento() {
        if (!pagamentos.length) {
            return "Informe pelo menos uma forma de pagamento.";
        }

        const pagamentoInvalido = pagamentos.some(
            (pagamento) =>
                !pagamento.formaPagamentoId ||
                Number(pagamento.valor) <= 0
        );

        if (pagamentoInvalido) {
            return "Informe a forma e o valor de todos os pagamentos.";
        }

        if (Math.abs(totalPagamentos - valorProdutos) > 0.01) {
            return "O total dos pagamentos precisa corresponder ao total da venda.";
        }

        return "";
    }

    async function finalizarVenda() {
        if (!cliente?.id && !cliente?.nome) {
            return;
        }

        if (!carrinho.length) {
            return;
        }

        if (!podeFinalizar) {
            return;
        }

        const erroPagamento = validarPagamento();

        if (erroPagamento) {
            window.alert(erroPagamento);
            return;
        }

        const pedido = {
            clienteNome:
                cliente.nome?.trim() ||
                cliente.nomeCompleto?.trim() ||
                "",

            clienteWhatsapp:
                cliente.telefone ||
                cliente.whatsapp ||
                "",

            observacao: "",

            pagamentos: pagamentos.map((pagamento) => ({
                formaPagamentoId: Number(
                    pagamento.formaPagamentoId
                ),
                valor: Number(pagamento.valor)
            })),

            tipoRecebimento,

            enderecoId:
                tipoRecebimento === "ENTREGA"
                    ? Number(endereco?.id)
                    : null,

            itens: carrinho.map((item) => ({
                produtoId: item.id,
                quantidade: Number(item.quantidade)
            }))
        };

        try {
            // O estado carregando do useMiniPdv é mantido
            // para não alterar a estrutura do hook nesta etapa.
            const response = await criarPedidoOperacional(pedido);

            console.log(
                "Venda operacional criada.",
                response.data
            );

            window.alert("Venda finalizada com sucesso.");

            limparNovaVenda();
        } catch (error) {
            console.error(
                "Erro ao finalizar venda operacional.",
                error
            );

            const mensagem =
                error?.response?.data?.message ||
                "Não foi possível finalizar a venda.";

            window.alert(mensagem);
        }
    }

    function enviarParaBalcao() {
        if (!carrinho.length) {
            return;
        }

        const erroPagamento = validarPagamento();

        if (erroPagamento) {
            window.alert(erroPagamento);
            return;
        }

        window.alert(
            "O envio para balcão será integrado ao fluxo operacional."
        );
    }

    const novaVenda = aba === ABA_PDV;

    const podeFinalizarVenda =
        podeFinalizar &&
        carrinho.length > 0 &&
        pagamentos.length > 0 &&
        Math.abs(totalPagamentos - valorProdutos) <= 0.01;

    return (
        <div className="container-fluid py-3">
            <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                    <h1 className="h4 mb-0">
                        SIGIN — Mini PDV
                    </h1>

                    <small className="text-muted">
                        Centro Operacional
                    </small>
                </div>

                {novaVenda && (
                    <span className="badge text-bg-secondary">
                        Venda em atendimento
                    </span>
                )}
            </div>

            <div className="mb-4">
                <button
                    type="button"
                    className={`btn me-2 ${
                        novaVenda
                            ? "btn-dark"
                            : "btn-outline-dark"
                    }`}
                    onClick={() => setAba(ABA_PDV)}
                >
                    PDV
                </button>

                <button
                    type="button"
                    className={`btn me-2 ${
                        aba === ABAS.PEDIDOS
                            ? "btn-primary"
                            : "btn-outline-primary"
                    }`}
                    onClick={() => setAba(ABAS.PEDIDOS)}
                >
                    📥 Pedidos
                </button>

                <button
                    type="button"
                    className={`btn me-2 ${
                        aba === ABAS.CONFERENCIA
                            ? "btn-info"
                            : "btn-outline-info"
                    }`}
                    onClick={() =>
                        setAba(ABAS.CONFERENCIA)
                    }
                >
                    ✔ Conferência
                </button>

                <button
                    type="button"
                    className={`btn me-2 ${
                        aba === ABAS.SEPARACAO
                            ? "btn-success"
                            : "btn-outline-success"
                    }`}
                    onClick={() =>
                        setAba(ABAS.SEPARACAO)
                    }
                >
                    📦 Separação
                </button>

                <button
                    type="button"
                    className={`btn ${
                        aba === ABAS.RETIRADA
                            ? "btn-warning"
                            : "btn-outline-warning"
                    }`}
                    onClick={() =>
                        setAba(ABAS.RETIRADA)
                    }
                >
                    🛍️ Retirada
                </button>
            </div>

            {erro && novaVenda && (
                <div className="alert alert-danger py-2">
                    {erro}
                </div>
            )}

            {novaVenda ? (
                <div className="row g-3">
                    <div className="col-12 col-lg-5 col-xl-4">
                        <div className="d-flex flex-column gap-3">
                            <MiniPdvProdutos
                                carrinho={carrinho}
                                onAdicionarProduto={
                                    adicionarProduto
                                }
                                onDiminuirProduto={
                                    diminuirProduto
                                }
                            />

                            <MiniPdvCliente
                                cliente={cliente}
                                onClienteSelecionado={
                                    selecionarCliente
                                }
                                onDefinirEntrega={
                                    definirEntrega
                                }
                                onDefinirRetirada={
                                    definirRetirada
                                }
                            />

                            {tipoRecebimento ===
                                "ENTREGA" && (
                                <MiniPdvEndereco
                                    cliente={cliente}
                                    enderecos={enderecos}
                                    endereco={endereco}
                                    carregando={
                                        carregandoEnderecos
                                    }
                                    erro={erroEnderecos}
                                    onEnderecoSelecionado={
                                        selecionarEndereco
                                    }
                                    onCadastrarEndereco={() => {}}
                                />
                            )}

                            <MiniPdvPagamentos
                                formasPagamento={
                                    formasPagamento
                                }
                                pagamentos={pagamentos}
                                onAdicionarPagamento={
                                    adicionarPagamento
                                }
                                onAlterarPagamento={
                                    alterarPagamento
                                }
                                onRemoverPagamento={
                                    removerPagamento
                                }
                            />

                            {erroFormasPagamento && (
                                <div className="alert alert-danger py-2 mb-0">
                                    {
                                        erroFormasPagamento
                                    }
                                </div>
                            )}

                            {carregandoFormasPagamento && (
                                <div className="text-muted small">
                                    Carregando formas de pagamento...
                                </div>
                            )}

                            <MiniPdvAcoes
                                podeFinalizar={
                                    podeFinalizarVenda
                                }
                                carregando={carregando}
                                onFinalizar={
                                    finalizarVenda
                                }
                                onEnviarBalcao={
                                    enviarParaBalcao
                                }
                                onLimpar={
                                    limparNovaVenda
                                }
                            />
                        </div>
                    </div>

                    <div className="col-12 col-lg-7 col-xl-8">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body d-flex flex-column p-0">
                                <div className="p-3 border-bottom">
                                    <h2 className="h5 mb-0">
                                        Venda
                                    </h2>

                                    <small className="text-muted">
                                        Itens da venda atual
                                    </small>
                                </div>

                                <div
                                    className="flex-grow-1"
                                    style={{
                                        minHeight: 0,
                                        overflowY: "auto"
                                    }}
                                >
                                    <MiniPdvCarrinho
                                        carrinho={carrinho}
                                        valorProdutos={
                                            valorProdutos
                                        }
                                        onAdicionarProduto={
                                            adicionarProduto
                                        }
                                        onDiminuirProduto={
                                            diminuirProduto
                                        }
                                        onRemoverProduto={
                                            removerProduto
                                        }
                                        onLimparCarrinho={
                                            limparCarrinho
                                        }
                                    />
                                </div>

                                <div className="border-top p-4">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <span className="fs-5 fw-semibold">
                                            Total
                                        </span>

                                        <strong className="fs-2">
                                            R${" "}
                                            {Number(
                                                valorProdutos
                                            ).toFixed(2)}
                                        </strong>
                                    </div>

                                    <div className="d-flex align-items-center justify-content-between mt-2">
                                        <span className="text-muted">
                                            Pagamentos
                                        </span>

                                        <span
                                            className={
                                                Math.abs(
                                                    totalPagamentos -
                                                        valorProdutos
                                                ) <= 0.01
                                                    ? "text-success fw-semibold"
                                                    : "text-danger fw-semibold"
                                            }
                                        >
                                            R${" "}
                                            {Number(
                                                totalPagamentos
                                            ).toFixed(2)}
                                        </span>
                                    </div>

                                    {cliente && (
                                        <div className="text-muted small mt-2">
                                            Cliente:{" "}
                                            {cliente.nome ||
                                                cliente.nomeCompleto ||
                                                "Cliente"}
                                        </div>
                                    )}

                                    {tipoRecebimento ===
                                        "ENTREGA" &&
                                        endereco && (
                                            <div className="text-muted small mt-1">
                                                Entrega para{" "}
                                                {endereco.logradouro ||
                                                    endereco.rua}
                                                {endereco.numero
                                                    ? `, ${endereco.numero}`
                                                    : ""}
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <BalcaoPainel
                    aba={aba}
                    onAbaChange={setAba}
                    exibirAbas={false}
                />
            )}
        </div>
    );
}

export default MiniPdv;
