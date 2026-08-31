import { useCallback, useState } from "react";

import MiniPdvProdutos from "../components/MiniPdvProdutos";
import MiniPdvCarrinho from "../components/MiniPdvCarrinho";
import MiniPdvCliente from "../components/MiniPdvCliente";
import MiniPdvEndereco from "../components/MiniPdvEndereco";
import MiniPdvPagamentoEtapa from "../components/MiniPdvPagamentoEtapa";
import MiniPdvAcoes from "../components/MiniPdvAcoes";

import useMiniPdv from "../hooks/useMiniPdv";
import useMiniPdvCarrinho from "../hooks/useMiniPdvCarrinho";
import useMiniPdvFormasPagamento from "../hooks/useMiniPdvFormasPagamento";
import useMiniPdvPagamentos from "../hooks/useMiniPdvPagamentos";
import useMiniPdvFluxo from "../hooks/useMiniPdvFluxo";
import useMiniPdvAtalhos from "../hooks/useMiniPdvAtalhos";
import useKeyboardAlert from "../../../hooks/useKeyboardAlert";

import KeyboardAlert from "../../../components/KeyboardAlert";

import BalcaoPainel from "../../../components/pedido/BalcaoPainel";
import { ABAS } from "../../../components/pedido/balcaoAbas";

import {
    ABA_PDV,
    ETAPA_PAGAMENTO,
    ETAPA_VENDA,
    validarPagamento
} from "../utils/miniPdvUtils";

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
        restante,
        troco,
        valorRecebimento,
        adicionarPagamentoPorAtalho,
        removerPagamento,
        limparPagamentos,
        definirValorRecebimento
    } = useMiniPdvPagamentos(
        valorProdutos,
        formasPagamento
    );

    const {
        alertState,
        showAlert,
        closeAlert
    } = useKeyboardAlert();

    const {
        etapa,
        setEtapa,
        trocoFinal,
        setTrocoFinal,
        finalizarVenda,
        confirmarPagamento,
        voltarParaVenda,
        limparNovaVenda
    } = useMiniPdvFluxo({
        cliente,
        endereco,
        tipoRecebimento,
        carrinho,
        valorProdutos,
        pagamentos,
        totalPagamentos,
        limparVenda,
        limparCarrinho,
        limparPagamentos,
        podeFinalizar,
        showAlert
    });

    const solicitarLimpezaVenda = useCallback(() => {
        if (!carrinho.length) {
            limparNovaVenda();
            return;
        }

        const confirmar = window.confirm(
            "Deseja realmente cancelar e limpar a venda atual?"
        );

        if (!confirmar) {
            return;
        }

        limparNovaVenda();
    }, [
        carrinho.length,
        limparNovaVenda
    ]);

    function enviarParaBalcao() {
        if (!carrinho.length) {
            return;
        }

        const erroPagamento = validarPagamento({
            pagamentos,
            valorProdutos,
            totalPagamentos
        });

        if (erroPagamento) {
            showAlert(erroPagamento);
            return;
        }

        showAlert(
            "O envio para balcão será integrado ao fluxo operacional."
        );
    }

    useMiniPdvAtalhos({
        aba,
        etapa,
        alertOpen: alertState.open,
        trocoFinal,
        onFinalizarVenda: finalizarVenda,
        onLimparNovaVenda: solicitarLimpezaVenda,
        onVoltarParaVenda: voltarParaVenda,
        onFecharAlerta: closeAlert,
        onFecharTrocoModal: () =>
            setTrocoFinal(0)
    });

    const novaVenda = aba === ABA_PDV;

    const podeFinalizarVenda =
        podeFinalizar &&
        carrinho.length > 0;

    if (
        novaVenda &&
        etapa === ETAPA_PAGAMENTO
    ) {
        return (
            <>
                <MiniPdvPagamentoEtapa
                    valorVenda={valorProdutos}
                    pagamentos={pagamentos}
                    totalPagamentos={totalPagamentos}
                    restante={restante}
                    troco={troco}
                    valorRecebimento={valorRecebimento}
                    definirValorRecebimento={
                        definirValorRecebimento
                    }
                    adicionarPagamentoPorAtalho={
                        adicionarPagamentoPorAtalho
                    }
                    removerPagamento={
                        removerPagamento
                    }
                    onConfirmar={
                        confirmarPagamento
                    }
                    onVoltar={
                        voltarParaVenda
                    }
                    carregando={
                        carregando ||
                        carregandoFormasPagamento
                    }
                />

                <KeyboardAlert
                    open={alertState.open}
                    message={alertState.message}
                    onClose={closeAlert}
                />
            </>
        );
    }

    return (
        <>
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
                        onClick={() => {
                            setAba(ABA_PDV);
                            setEtapa(ETAPA_VENDA);
                        }}
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
                        onClick={() =>
                            setAba(ABAS.PEDIDOS)
                        }
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
                                        enderecos={
                                            enderecos
                                        }
                                        endereco={endereco}
                                        carregando={
                                            carregandoEnderecos
                                        }
                                        erro={
                                            erroEnderecos
                                        }
                                        onEnderecoSelecionado={
                                            selecionarEndereco
                                        }
                                        onCadastrarEndereco={
                                            () => {}
                                        }
                                    />
                                )}

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
                                    carregando={
                                        carregando
                                    }
                                    onFinalizar={
                                        finalizarVenda
                                    }
                                    onEnviarBalcao={
                                        enviarParaBalcao
                                    }
                                    onLimpar={
                                        solicitarLimpezaVenda
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
                                            overflowY:
                                                "auto"
                                        }}
                                    >
                                        <MiniPdvCarrinho
                                            carrinho={
                                                carrinho
                                            }
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
                                                ).toFixed(
                                                    2
                                                )}
                                            </strong>
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

            {trocoFinal > 0 && (
                <div
                    className="modal fade show d-block"
                    style={{
                        backgroundColor:
                            "rgba(0, 0, 0, 0.5)"
                    }}
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Venda finalizada
                                </h5>
                            </div>

                            <div className="modal-body text-center py-4">
                                <div className="text-muted mb-2">
                                    Troco
                                </div>

                                <strong className="display-5">
                                    R${" "}
                                    {Number(
                                        trocoFinal
                                    ).toLocaleString(
                                        "pt-BR",
                                        {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }
                                    )}
                                </strong>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    autoFocus
                                    onClick={() =>
                                        setTrocoFinal(0)
                                    }
                                >
                                    OK (Enter)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <KeyboardAlert
                open={alertState.open}
                message={alertState.message}
                onClose={closeAlert}
            />
        </>
    );
}

export default MiniPdv;
