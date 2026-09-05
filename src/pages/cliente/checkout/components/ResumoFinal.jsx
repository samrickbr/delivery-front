import { TIPOS_RECEBIMENTO, formatarValor } from "../checkoutUtils";

function formatarEndereco(endereco) {
    if (!endereco) {
        return "Não selecionado";
    }

    const linhaPrincipal = [endereco.logradouro, endereco.numero].filter(Boolean).join(", ");

    const linhaSecundaria = [endereco.bairro, endereco.cidade, endereco.uf].filter(Boolean).join(" - ");

    return [linhaPrincipal, linhaSecundaria].filter(Boolean).join(" • ");
}

function ResumoFinal({ cliente, tipoRecebimento, enderecoSelecionado, enderecos, valorTotal }) {
    const nomeCliente = cliente?.nome || "Não disponível";

    const recebimento =
        tipoRecebimento === TIPOS_RECEBIMENTO.ENTREGA
            ? "Entrega"
            : tipoRecebimento === TIPOS_RECEBIMENTO.RETIRADA
              ? "Retirada no local"
              : "Não selecionado";

    const endereco = enderecos?.find((item) => String(item.id) === String(enderecoSelecionado));

    return (
        <section className="card border-0 shadow-sm">
            <div className="card-body px-3 py-2">
                <strong className="d-block mb-2">Resumo final</strong>

                <div className="d-flex justify-content-between small mb-1">
                    <span className="text-muted">Cliente</span>

                    <strong className="text-end ms-2">{nomeCliente}</strong>
                </div>

                <div className="d-flex justify-content-between small mb-1">
                    <span className="text-muted">Recebimento</span>

                    <strong>{recebimento}</strong>
                </div>

                {tipoRecebimento === TIPOS_RECEBIMENTO.ENTREGA && (
                    <div className="small mb-1">
                        <span className="text-muted d-block">Endereço de entrega</span>

                        <strong className="d-block">{formatarEndereco(endereco)}</strong>

                        {endereco?.complemento && (
                            <span className="text-muted d-block">Complemento: {endereco.complemento}</span>
                        )}
                    </div>
                )}

                <div className="d-flex justify-content-between small">
                    <span className="text-muted">Total</span>

                    <strong>{valorTotal === null ? "Aguardando" : formatarValor(valorTotal)}</strong>
                </div>
            </div>
        </section>
    );
}

export default ResumoFinal;
