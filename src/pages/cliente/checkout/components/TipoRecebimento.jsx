import { TIPOS_RECEBIMENTO } from "../checkoutUtils";

function TipoRecebimento({ tipoRecebimento, onChange, disabled }) {
    return (
        <section className="card border-0 shadow-sm">
            <div className="card-body px-3 py-2">
                <div className="d-flex flex-column flex-md-row align-items-md-center gap-2">
                    <strong className="text-nowrap">Como deseja receber?</strong>

                    <div className="d-flex gap-2 flex-grow-1">
                        <button
                            type="button"
                            className={
                                tipoRecebimento === TIPOS_RECEBIMENTO.RETIRADA
                                    ? "btn btn-primary flex-fill"
                                    : "btn btn-outline-primary flex-fill"
                            }
                            onClick={() => onChange(TIPOS_RECEBIMENTO.RETIRADA)}
                            disabled={disabled}
                        >
                            🏪 Retirar no local
                        </button>

                        <button
                            type="button"
                            className={
                                tipoRecebimento === TIPOS_RECEBIMENTO.ENTREGA
                                    ? "btn btn-primary flex-fill"
                                    : "btn btn-outline-primary flex-fill"
                            }
                            onClick={() => onChange(TIPOS_RECEBIMENTO.ENTREGA)}
                            disabled={disabled}
                        >
                            🛵 Receber por entrega
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default TipoRecebimento;
