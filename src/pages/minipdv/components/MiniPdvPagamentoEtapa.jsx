import { useCallback, useEffect, useRef, useState } from "react";

const ATALHOS = [
    {
        atalho: "D",
        label: "Dinheiro"
    },
    {
        atalho: "P",
        label: "Pix"
    },
    {
        atalho: "C",
        label: "Cartão"
    }
];

const LABELS_ATALHO = {
    D: "Dinheiro",
    P: "Pix",
    C: "Cartão",
    K: "Crediário"
};

function MiniPdvPagamentoEtapa({
    valorProdutos = 0,
    taxaEntrega = 0,
    tipoRecebimento = "RETIRADA",
    valorVenda,
    pagamentos,
    totalPagamentos,
    restante,
    troco,
    valorRecebimento,
    definirValorRecebimento,
    adicionarPagamentoPorAtalho,
    alterarPagamento,
    removerPagamento,
    onConfirmar,
    onVoltar,
    carregando = false
}) {
    const campoRecebimentoRef = useRef(null);

    const [formaSelecionada, setFormaSelecionada] = useState(null);

    useEffect(() => {
        campoRecebimentoRef.current?.focus();
        campoRecebimentoRef.current?.select();
    }, []);

    const confirmarForma = useCallback(
        (atalho) => {
            if (carregando) {
                return;
            }

            const codigo = String(atalho || "")
                .trim()
                .toUpperCase();

            if (!["D", "P", "C"].includes(codigo)) {
                return;
            }

            setFormaSelecionada(codigo);

            const valorInformado = Number(valorRecebimento);

            const valor =
                Number.isFinite(valorInformado) && valorInformado > 0
                    ? valorInformado
                    : restante > 0
                      ? restante
                      : Number(valorVenda);

            if (!Number.isFinite(valor) || valor <= 0) {
                return;
            }

            const resultado = adicionarPagamentoPorAtalho(codigo, valor);

            if (!resultado || !resultado.sucesso) {
                window.alert(resultado?.mensagem || "Não foi possível registrar o pagamento.");

                return;
            }

            if (resultado.pagamentoCompleto) {
                onConfirmar(resultado);
            }
        },
        [carregando, valorRecebimento, restante, valorVenda, adicionarPagamentoPorAtalho, onConfirmar]
    );

    useEffect(() => {
        function tratarTecla(event) {
            if (event.ctrlKey || event.altKey || event.metaKey) {
                return;
            }

            const tecla = event.key.toUpperCase();

            if (!["D", "P", "C"].includes(tecla)) {
                return;
            }

            event.preventDefault();

            confirmarForma(tecla);
        }

        window.addEventListener("keydown", tratarTecla);

        return () => {
            window.removeEventListener("keydown", tratarTecla);
        };
    }, [confirmarForma]);

    function formatarMoeda(valor) {
        return Number(valor || 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    function obterValorForma(atalho) {
        return pagamentos
            .filter((pagamento) => pagamento.atalho === atalho)
            .reduce((total, pagamento) => total + Number(pagamento.valor || 0), 0);
    }

    function alterarValor(indice, valor) {
        const pagamento = pagamentos[indice];

        if (!pagamento) {
            return;
        }

        alterarPagamento(indice, pagamento.formaPagamentoId, valor);
    }

    return (
        <div className="container-fluid py-3">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-8 col-xl-7">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <div>
                                    <h1 className="h4 mb-1">Pagamento</h1>

                                    <small className="text-muted">Informe os recebimentos da venda</small>
                                </div>

                                <div className="text-end">
                                    <div className="text-muted small">Total venda</div>

                                    <strong className="fs-3">{formatarMoeda(valorVenda)}</strong>
                                </div>
                            </div>

                            <div className="mb-4 border rounded p-3 bg-light-subtle">
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Produtos</span>
                                    <strong>{formatarMoeda(valorProdutos)}</strong>
                                </div>

                                {tipoRecebimento === "ENTREGA" && (
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Taxa de entrega</span>
                                        <strong>
                                            {taxaEntrega === null ? "Calculando..." : formatarMoeda(taxaEntrega)}
                                        </strong>
                                    </div>
                                )}

                                <div className="d-flex justify-content-between border-top pt-2">
                                    <span className="fw-semibold">Total</span>
                                    <strong className="fs-5">{formatarMoeda(valorVenda)}</strong>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="mini-pdv-valor-recebimento" className="form-label fw-semibold">
                                    Valor do recebimento
                                </label>

                                <input
                                    ref={campoRecebimentoRef}
                                    id="mini-pdv-valor-recebimento"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="form-control form-control-lg"
                                    value={valorRecebimento}
                                    onChange={(event) => definirValorRecebimento(event.target.value)}
                                    disabled={carregando}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            event.preventDefault();
                                        }
                                    }}
                                />
                            </div>

                            <div className="row g-2 mb-4">
                                {ATALHOS.map(({ atalho, label }) => (
                                    <div key={atalho} className="col-12 col-md-4">
                                        <button
                                            type="button"
                                            className={`btn w-100 ${
                                                formaSelecionada === atalho ? "btn-dark" : "btn-outline-dark"
                                            }`}
                                            onClick={() => confirmarForma(atalho)}
                                            disabled={carregando}
                                        >
                                            <strong>{label}</strong>

                                            <span className="ms-2">({atalho})</span>

                                            <div className="small mt-1">{formatarMoeda(obterValorForma(atalho))}</div>
                                        </button>
                                    </div>
                                ))}

                                <div className="col-12 col-md-4">
                                    <button type="button" className="btn btn-outline-secondary w-100" disabled>
                                        <strong>{LABELS_ATALHO.K}</strong>

                                        <span className="ms-2">(K)</span>

                                        <div className="small mt-1">Indisponível</div>
                                    </button>
                                </div>
                            </div>

                            <div className="border rounded p-3 mb-4">
                                <div className="d-flex justify-content-between">
                                    <span>Total recebimentos</span>

                                    <strong>{formatarMoeda(totalPagamentos)}</strong>
                                </div>

                                <div className="d-flex justify-content-between mt-2">
                                    <span>Restante</span>

                                    <strong>{formatarMoeda(restante)}</strong>
                                </div>

                                <div className="d-flex justify-content-between mt-2">
                                    <span>Troco</span>

                                    <strong>{formatarMoeda(troco)}</strong>
                                </div>
                            </div>

                            {pagamentos.length > 0 && (
                                <div className="mb-4">
                                    <div className="fw-semibold mb-2">Recebimentos</div>

                                    <div className="list-group">
                                        {pagamentos.map((pagamento, indice) => (
                                            <div
                                                key={`${pagamento.formaPagamentoId}-${indice}`}
                                                className="list-group-item"
                                            >
                                                <div className="d-flex align-items-center justify-content-between gap-3">
                                                    <span>
                                                        {LABELS_ATALHO[pagamento.atalho] ||
                                                            pagamento.descricao ||
                                                            pagamento.formaPagamentoId}
                                                    </span>

                                                    <div className="d-flex align-items-center gap-2">
                                                        <input
                                                            type="number"
                                                            min="0.01"
                                                            step="0.01"
                                                            className="form-control"
                                                            style={{
                                                                width: 140
                                                            }}
                                                            value={pagamento.valor}
                                                            disabled={carregando}
                                                            onChange={(event) =>
                                                                alterarValor(indice, event.target.value)
                                                            }
                                                        />

                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => removerPagamento(indice)}
                                                            disabled={carregando}
                                                        >
                                                            Remover
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="d-flex justify-content-between gap-2">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={onVoltar}
                                    disabled={carregando}
                                >
                                    Voltar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MiniPdvPagamentoEtapa;
