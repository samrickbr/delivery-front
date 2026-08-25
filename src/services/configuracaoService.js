import api from "./api";

/* ==========================================================
   CONFIGURAÇÕES
========================================================== */

export async function buscarTaxaEntrega() {
    return api.get("/configuracoes/taxa-entrega");
}
