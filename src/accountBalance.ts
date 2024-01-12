// Import Libraries
import { Router as FibrousRouter } from "fibrous-router-sdk";
import { config } from './config';
import { Account, RpcProvider, json, Contract, uint256, constants } from "starknet";
import { formatBalance } from './formatBalance';

async function get_token_price() {
    // Create a new router instance
    const router = new FibrousRouter();

    const token_prices = await router.supportedTokens();
    const eth_price = token_prices.eth.price;
    const usdc_price = token_prices.usdc.price;
    const USDT_price = token_prices.USDT.price;
    const dai_price = token_prices.dai.price;
    
    console.log("Getting token prices...");
    return { eth_price, usdc_price, USDT_price, dai_price };
};

async function getTokenBalance(account: any, tokenContract: any, decimals: number) {
    const tokenBalance = await tokenContract.balanceOf(account.address);
    const tokenBalanceBN = uint256.uint256ToBN(tokenBalance.balance);
    return Number(formatBalance(tokenBalanceBN, decimals));
};

async function accountBalance() {
    // Defines the provider
    const provider = new RpcProvider({ nodeUrl: constants.NetworkName.SN_MAIN });
    //const provider = new RpcProvider({ nodeUrl: "https://starknet-mainnet.infura.io/v3/" + "YOUR_API_KEY" });
    await provider.getChainId();

    // Applies the account with private key and account address
    const privateKey = config.privateKey;
    const accountAddress = "YOUR_ACCOUNT_ADDRESS";
    
    // Or you can write down your private key. If you activate that one, please delete the code(line:13).
    //const privateKey = "YOUR_PRIVATE_KEY";
    
    // https://www.starknetjs.com/docs/guides/connect_account
    const account = new Account(provider, accountAddress, privateKey);

    // Contracts of tokens
    const ethAddress = "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
    const usdcAddress = "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8";
    const usdtAddress = "0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8";
    const daiAddress = "0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3";

    const fs = require('fs');

    const compiledERC20 = json.parse(fs.readFileSync('./compiledContract/erc20ETH.json').toString("ascii")).abi;

    const { eth_price, usdc_price, USDT_price, dai_price } = await get_token_price();

    const token_list = [
        { symbol: "eth", address: ethAddress, abi: compiledERC20, decimals: await new Contract(compiledERC20, ethAddress, account).decimals(), usd_price: eth_price },
        { symbol: "usdc", address: usdcAddress, abi: compiledERC20, decimals: await new Contract(compiledERC20, usdcAddress, account).decimals(), usd_price: usdc_price },
        { symbol: "USDT", address: usdtAddress, abi: compiledERC20, decimals: await new Contract(compiledERC20, usdtAddress, account).decimals(), usd_price: USDT_price },
        { symbol: "dai", address: daiAddress, abi: compiledERC20, decimals: await new Contract(compiledERC20, daiAddress, account).decimals(), usd_price: dai_price },
    ];

    for (const token of token_list) {
        const tokenContract = new Contract(token.abi, token.address, account);
        const pre_balance = await getTokenBalance(account, tokenContract, token.decimals);
        const balance = pre_balance * token.usd_price
        
        console.log( `${token.symbol}, Amount of: ${balance} USD` );
    }
};

accountBalance();