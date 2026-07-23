import { useEffect, useRef, useState } from "react";

function InputDialog({ show, titulo, mensagem, placeholder, onConfirm, onCancel }) {
    const [valor, setValor] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        if (show) {
            setValor("");
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [show]);

    if (!show) return null;

    return (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5>{titulo}</h5>
                    </div>

                    <div className="modal-body">
                        <p>{mensagem}</p>

                        <input
                            ref={inputRef}
                            className="form-control"
                            value={valor}
                            placeholder={placeholder}
                            onChange={(e) => setValor(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && valor.trim()) {
                                    onConfirm(valor);
                                }
                                if (e.key === "Escape") {
                                    onCancel();
                                }
                            }}
                        />
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onCancel}>
                            Cancelar
                        </button>

                        <button className="btn btn-primary" disabled={!valor.trim()} onClick={() => onConfirm(valor)}>
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InputDialog;
