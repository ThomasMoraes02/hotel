export function createValidCpf(seed: number): string {
    const base = String(seed % 1000000000).padStart(9, "0");
    const firstDigit = calculateDigit(base, 10);
    const secondDigit = calculateDigit(`${base}${firstDigit}`, 11);
    const cpf = `${base}${firstDigit}${secondDigit}`;
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function calculateDigit(cpf: string, factor: number): number {
    let total = 0;
    for (const digit of cpf) {
        if (factor > 1) total += parseInt(digit) * factor--;
    }
    const rest = total % 11;
    return rest < 2 ? 0 : 11 - rest;
}
