import { useEffect, useRef } from "react";

function KeyboardAlert({ open, message, onClose }) {
    const buttonRef = useRef(null);

    useEffect(() => {
        if (!open) {
            return;
        }

        buttonRef.current?.focus();

        function handleKeyDown(event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                event.stopPropagation();
                onClose();
            }

            if (event.key === "Escape") {
                event.preventDefault();
                event.stopPropagation();
                onClose();
            }
        }

        window.addEventListener("keydown", handleKeyDown, true);

        return () => {
            window.removeEventListener("keydown", handleKeyDown, true);
        };
    }, [open, onClose]);

    if (!open) {
        return null;
    }

    return (
        <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="keyboard-alert-title"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 id="keyboard-alert-title" className="modal-title">
                            Atenção
                        </h5>
                    </div>

                    <div className="modal-body">
                        <p
                            className="mb-0"
                            style={{ whiteSpace: "pre-line" }}
                        >
                            {message}
                        </p>
                    </div>

                    <div className="modal-footer">
                        <button
                            ref={buttonRef}
                            type="button"
                            className="btn btn-primary"
                            onClick={onClose}
                        >
                            OK (Enter)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default KeyboardAlert;
