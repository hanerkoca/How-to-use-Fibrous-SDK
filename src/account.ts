import { Account, CairoVersion, RpcProvider, constants } from "starknet";

export function account(
    privateKey: string,
    accountAddress: string,
    isCairo1: string,
) {
    enum NetworkName {
        SN_MAIN = "SN_MAIN",
        SN_GOERLI = "SN_GOERLI",
    }
    const provider = new RpcProvider({
        nodeUrl: constants.NetworkName.SN_MAIN
    });

    const account0 = new Account(
        provider,
        accountAddress,
        privateKey,
        isCairo1 as CairoVersion,
    );
    return account0;
};