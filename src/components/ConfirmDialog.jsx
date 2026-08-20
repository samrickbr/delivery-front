import { useEffect, useRef } from "react";

function ConfirmDialog({ show, titulo, mensagem, onConfirm, onCancel }) {
    const confirmarRef = useRef(null);

    useEffect(() => {
        if (!show) return;

        const timer = setTimeout(() => {
            confirmarRef.current?.focus();
        }, 50);

        return () => clearTimeout(timer);
    }, [show]);

    if (!show) return null;

    return (
        <div
            className="modal d-block"
            style={{
                backgroundColor: "rgba(0,0,0,.5)"
            }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div
                    className="modal-content"
                    onKeyDown={(e) => {
                        if (e.key === "Escape") {
                            onCancel();
                        }

                        if (e.key === "Enter") {
                            onConfirm();
                        }
                    }}
                    tabIndex={0}
                >
                    <div className="modal-header">
                        <h5 className="modal-title">{titulo}</h5>
                    </div>

                    <div className="modal-body">{mensagem}</div>

                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onCancel}>
                            Cancelar
                        </button>

                        <button ref={confirmarRef} className="btn btn-primary" onClick={onConfirm}>
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;
