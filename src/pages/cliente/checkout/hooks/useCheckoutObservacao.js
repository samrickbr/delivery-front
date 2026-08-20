import { useState } from "react";

export function useCheckoutObservacao() {
    const [observacao, setObservacao] = useState("");

    return {
        observacao,
        setObservacao
    };
}
