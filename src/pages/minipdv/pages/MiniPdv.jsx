import { useState } from "react";

import MiniPdvProdutos from "../components/MiniPdvProdutos";
import MiniPdvCarrinho from "../components/MiniPdvCarrinho";
import MiniPdvCliente from "../components/MiniPdvCliente";
import MiniPdvEndereco from "../components/MiniPdvEndereco";
import MiniPdvAcoes from "../components/MiniPdvAcoes";

import useMiniPdv from "../hooks/useMiniPdv";
import useMiniPdvCarrinho from "../hooks/useMiniPdvCarrinho";

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

    const { carrinho, valorProdutos, adicionarProduto, diminuirProduto, removerProduto, limparCarrinho } =
        useMiniPdvCarrinho();

    function limparNovaVenda() {
        limparVenda();
        limparCarrinho();
    }

    const novaVenda = aba === ABA_PDV;

    return (
        <div className="container-fluid py-3">
            <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                    <h1 className="h4 mb-0">SIGIN — Mini PDV</h1>

                    <small className="text-muted">Centro Operacional</small>
                </div>

                {novaVenda && <span className="badge text-bg-secondary">Venda em atendimento</span>}
            </div>

            <div className="mb-4">
                <button
                    className={`btn me-2 ${novaVenda ? "btn-dark" : "btn-outline-dark"}`}
                    onClick={() => setAba(ABA_PDV)}
                >
                    PDV
                </button>

                <button
                    className={`btn me-2 ${aba === ABAS.PEDIDOS ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setAba(ABAS.PEDIDOS)}
                >
                    📥 Pedidos
                </button>

                <button
                    className={`btn me-2 ${aba === ABAS.CONFERENCIA ? "btn-info" : "btn-outline-info"}`}
                    onClick={() => setAba(ABAS.CONFERENCIA)}
                >
                    ✔ Conferência
                </button>

                <button
                    className={`btn me-2 ${aba === ABAS.SEPARACAO ? "btn-success" : "btn-outline-success"}`}
                    onClick={() => setAba(ABAS.SEPARACAO)}
                >
                    📦 Separação
                </button>

                <button
                    className={`btn ${aba === ABAS.RETIRADA ? "btn-warning" : "btn-outline-warning"}`}
                    onClick={() => setAba(ABAS.RETIRADA)}
                >
                    🛍️ Retirada
                </button>
            </div>

            {erro && novaVenda && <div className="alert alert-danger py-2">{erro}</div>}

            {novaVenda ? (
                <div className="row g-3">
                    {/* =====================================================
                        ÁREA OPERACIONAL
                    ====================================================== */}
                    <div className="col-12 col-lg-5 col-xl-4">
                        <div className="d-flex flex-column gap-3">
                            <div>
                                <MiniPdvProdutos
                                    carrinho={carrinho}
                                    onAdicionarProduto={adicionarProduto}
                                    onDiminuirProduto={diminuirProduto}
                                />
                            </div>

                            <div className="overflow-auto">
                                <MiniPdvCliente
                                    cliente={cliente}
                                    onClienteSelecionado={selecionarCliente}
                                    onDefinirEntrega={definirEntrega}
                                    onDefinirRetirada={definirRetirada}
                                />

                                {tipoRecebimento === "ENTREGA" && (
                                    <div className="mt-3">
                                        <MiniPdvEndereco
                                            cliente={cliente}
                                            enderecos={enderecos}
                                            endereco={endereco}
                                            carregando={carregandoEnderecos}
                                            erro={erroEnderecos}
                                            onEnderecoSelecionado={selecionarEndereco}
                                            onCadastrarEndereco={() => {}}
                                        />
                                    </div>
                                )}

                                <div className="mt-3">
                                    <MiniPdvAcoes
                                        podeFinalizar={podeFinalizar && carrinho.length > 0}
                                        carregando={carregando}
                                        onFinalizar={() => {}}
                                        onEnviarBalcao={() => {}}
                                        onLimpar={limparNovaVenda}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* =====================================================
                        TICKET
                    ====================================================== */}
                    <div className="col-12 col-lg-7 col-xl-8">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body d-flex flex-column p-0">
                                <div className="p-3 border-bottom">
                                    <h2 className="h5 mb-0">Venda</h2>

                                    <small className="text-muted">Itens da venda atual</small>
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
                                        valorProdutos={valorProdutos}
                                        onAdicionarProduto={adicionarProduto}
                                        onDiminuirProduto={diminuirProduto}
                                        onRemoverProduto={removerProduto}
                                        onLimparCarrinho={limparCarrinho}
                                    />
                                </div>

                                <div className="border-top p-4">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <span className="fs-5 fw-semibold">Total</span>

                                        <strong className="fs-2">R$ {Number(valorProdutos).toFixed(2)}</strong>
                                    </div>

                                    {tipoRecebimento === "ENTREGA" && endereco && (
                                        <div className="text-muted small mt-2">
                                            Entrega para {endereco.logradouro || endereco.rua}
                                            {endereco.numero ? `, ${endereco.numero}` : ""}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <BalcaoPainel aba={aba} onAbaChange={setAba} exibirAbas={false} />
            )}
        </div>
    );
}

export default MiniPdv;
