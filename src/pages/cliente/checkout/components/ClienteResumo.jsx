function ClienteResumo({ cliente }) {
    return (
        <div className="mb-4">
            <h5>Cliente</h5>

            <div className="border rounded p-3">
                <p className="mb-1">
                    <strong>Nome:</strong> {cliente.nome || "Não disponível"}
                </p>

                <p className="mb-1">
                    <strong>CPF:</strong> {cliente.cpf || "Não disponível"}
                </p>

                <p className="mb-0">
                    <strong>WhatsApp:</strong> {cliente.telefone || cliente.whatsapp || "Não disponível"}
                </p>
            </div>
        </div>
    );
}

export default ClienteResumo;
