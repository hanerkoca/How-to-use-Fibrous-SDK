export function formatBalance(qty: bigint, decimalsObj: { decimals: bigint }): string {
    const decimalPlaces = Number(decimalsObj.decimals);
    const balance = String("0").repeat(decimalPlaces) + qty.toString();
    const rightCleaned = balance.slice(-decimalPlaces).replace(/(\d)0+$/gm, '$1');
    const leftCleaned = BigInt(balance.slice(0, balance.length - decimalPlaces)).toString();
    return leftCleaned + "." + rightCleaned;
}