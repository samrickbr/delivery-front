import { TIPOS_RECEBIMENTO } from "../checkoutUtils";
import { CAMPOS_CHECKOUT } from "../checkoutCampos";
import { useCampoErro } from "../hooks/useCampoErro";

function TipoRecebimento({ tipoRecebimento, onChange, disabled, campoErro, versaoErro }) {
    const { ref, comErro, animando } = useCampoErro({
        campos: [CAMPOS_CHECKOUT.TIPO_RECEBIMENTO],
        campoErro,
        versaoErro
    });

    return (
        <section
            ref={ref}
            tabIndex="-1"
            className="card border-0 shadow-sm"
            style={{
                outline: comErro ? "2px solid var(--bs-danger)" : "2px solid transparent",
                boxShadow: animando ? "0 0 0 0.25rem rgba(var(--bs-danger-rgb), 0.18)" : "none",
                transition: "outline-color 150ms ease, box-shadow 150ms ease"
            }}
        >
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
