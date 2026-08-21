function Observacao({ value, onChange, disabled }) {
    return (
        <section className="card border-0 shadow-sm">
            <div className="card-body px-3 py-2">
                <div className="d-flex flex-column flex-md-row align-items-md-center gap-2">
                    <strong className="text-nowrap">Observação</strong>

                    <textarea
                        className="form-control"
                        rows={1}
                        placeholder="Alguma observação para o pedido? (opcional)"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={disabled}
                        style={{
                            resize: "vertical"
                        }}
                    />
                </div>
            </div>
        </section>
    );
}

export default Observacao;
