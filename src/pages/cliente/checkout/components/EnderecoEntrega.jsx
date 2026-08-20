function EnderecoEntrega({ enderecoSelecionado, onChange, disabled }) {
    return (
        <div className="mb-4">
            <h5>Endereço de entrega</h5>

            <div className="alert alert-warning">
                O endpoint de endereços do cliente ainda não está exposto pelo Delivery Back.
            </div>

            <input
                className="form-control"
                type="number"
                placeholder="enderecoId"
                value={enderecoSelecionado}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
            />
        </div>
    );
}

export default EnderecoEntrega;
