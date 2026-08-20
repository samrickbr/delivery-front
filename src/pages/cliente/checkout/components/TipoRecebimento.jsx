import { TIPOS_RECEBIMENTO } from "../checkoutUtils";

function TipoRecebimento({ tipoRecebimento, onChange, disabled }) {
    return (
        <div className="mb-4">
            <h5>Como deseja receber?</h5>

            <div className="d-grid gap-2">
                <button
                    type="button"
                    className={
                        tipoRecebimento === TIPOS_RECEBIMENTO.RETIRADA ? "btn btn-primary" : "btn btn-outline-primary"
                    }
                    onClick={() => onChange(TIPOS_RECEBIMENTO.RETIRADA)}
                    disabled={disabled}
                >
                    Retirar no local
                </button>

                <button
                    type="button"
                    className={
                        tipoRecebimento === TIPOS_RECEBIMENTO.ENTREGA ? "btn btn-primary" : "btn btn-outline-primary"
                    }
                    onClick={() => onChange(TIPOS_RECEBIMENTO.ENTREGA)}
                    disabled={disabled}
                >
                    Receber por entrega
                </button>
            </div>
        </div>
    );
}

export default TipoRecebimento;
