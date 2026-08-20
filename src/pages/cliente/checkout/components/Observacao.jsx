function Observacao({ value, onChange, disabled }) {
    return (
        <div className="mb-4">
            <h5>Observação</h5>

            <textarea
                className="form-control"
                rows={3}
                placeholder="Observação do pedido (opcional)"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
            />
        </div>
    );
}

export default Observacao;
