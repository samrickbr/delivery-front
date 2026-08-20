import { useState } from "react";

export function useCheckoutErro() {
    const [erro, setErro] = useState("");

    return {
        erro,
        setErro
    };
}
