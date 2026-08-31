import { useEffect, useRef, useState } from "react";

const ATALHOS = [
    { atalho: "D", label: "Dinheiro" },
    { atalho: "P", label: "Pix" },
    { atalho: "C", label: "Cartão" }
];

const LABELS_ATALHO = {
    D: "Dinheiro",
    P: "Pix",
    C: "Cartão",
    K: "Crediário"
};

function MiniPdvPagamentoEtapa({
    valorVenda,
    pagamentos,
    totalPagamentos,
    restante,
    troco,
    valorRecebimento,
    definirValorRecebimento,
    adicionarPagamentoPorAtalho,
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [valorRecebimento, restante, totalPagamentos, valorVenda, carregando]);

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

    function confirmarForma(atalho) {
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

        // IMPORTANTE: usar o retorno síncrono (snapshot), não o state
        const resultado = adicionarPagamentoPorAtalho(codigo, valor);

        if (!resultado || !resultado.sucesso) {
            window.alert("Não foi possível registrar o pagamento. Verifique se as formas de pagamento carregaram.");
            return;
        }

        // Só finaliza se o snapshot já cobre o total
        if (resultado.pagamentoCompleto) {
            onConfirmar(resultado);
        }
    }

    function removerRecebimento(indice) {
        removerPagamento(indice);
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
                                                className="list-group-item d-flex align-items-center justify-content-between"
                                            >
                                                <span>
                                                    {LABELS_ATALHO[pagamento.atalho] ||
                                                        pagamento.descricao ||
                                                        pagamento.formaPagamentoId}
                                                </span>

                                                <div className="d-flex align-items-center gap-3">
                                                    <strong>{formatarMoeda(pagamento.valor)}</strong>

                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => removerRecebimento(indice)}
                                                        disabled={carregando}
                                                    >
                                                        Remover
                                                    </button>
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
