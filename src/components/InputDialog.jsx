import { useEffect, useRef, useState } from "react";

function InputDialogContent({ titulo, mensagem, placeholder, onConfirm, onCancel }) {
    const [valor, setValor] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            inputRef.current?.focus();
        }, 50);

        return () => clearTimeout(timer);
    }, []);

    function confirmar() {
        if (!valor.trim()) {
            return;
        }

        onConfirm(valor);
    }

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
                                if (e.key === "Enter") {
                                    confirmar();
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

                        <button className="btn btn-primary" disabled={!valor.trim()} onClick={confirmar}>
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InputDialog({ show, titulo, mensagem, placeholder, onConfirm, onCancel }) {
    if (!show) {
        return null;
    }

    return (
        <InputDialogContent
            titulo={titulo}
            mensagem={mensagem}
            placeholder={placeholder}
            onConfirm={onConfirm}
            onCancel={onCancel}
        />
    );
}

export default InputDialog;
