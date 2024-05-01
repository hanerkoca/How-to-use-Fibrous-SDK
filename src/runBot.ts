// Import Libraries
import { Router as FibrousRouter } from "fibrous-router-sdk";
import { Account, RpcProvider, Call, json, Contract, uint256, constants } from "starknet";
import { parseUnits, formatUnits } from "ethers";
import { BigNumber } from "@ethersproject/bignumber";
import { formatBalance } from "./formatBalance"; 
import { config } from "./config"; 

async function get_token_price() {
    // Create a new router instance
    const router = new FibrousRouter();
    // Get the supported tokens
    const token_prices = await router.supportedTokens();
    const eth_price = token_prices.eth.price;
    const usdc_price = token_prices.usdc.price;
    const USDT_price = token_prices.USDT.price;
    const dai_price = token_prices.dai.price;
    const strk_price = token_prices.STRK.price;
    
    console.log("Getting token prices...");
    return { eth_price, usdc_price, USDT_price, dai_price, strk_price };
};

async function getTokenBalance(account: any, tokenContract: any, decimals: number) {
    const tokenBalance = await tokenContract.balanceOf(account.address);
    const tokenBalanceBN = uint256.uint256ToBN(tokenBalance.balance);
    return Number(formatBalance(tokenBalanceBN, decimals));
};

async function findTokenWithMaxBalance(account: any, token_list: any[]) {
    let maxToken = null;
    let maxBalance = 0;
    let maxBalance_usd = 0;

    // Find the highest value token in account from token_list
    for (const token of token_list) {
        const tokenContract = new Contract(token.abi, token.address, account);
        const pre_balance = await getTokenBalance(account, tokenContract, token.decimals);
        const balance = pre_balance * token.usd_price

        if (balance > maxBalance_usd) {
            maxToken = token.symbol;
            maxBalance = (balance/token.usd_price);
            maxBalance_usd = balance;
        }
    }
    
    return { maxToken, maxBalance, maxBalance_usd };
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
    const strkAddress = "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";

    const fs = require('fs');

    const compiledERC20 = json.parse(fs.readFileSync('./compiledContract/erc20ETH.json').toString("ascii")).abi;

    const { eth_price, usdc_price, USDT_price, dai_price, strk_price } = await get_token_price();

    // Token list
    const token_list = [
        { symbol: "eth", address: ethAddress, abi: compiledERC20, decimals: await new Contract(compiledERC20, ethAddress, account).decimals(), usd_price: eth_price },
        { symbol: "usdc", address: usdcAddress, abi: compiledERC20, decimals: await new Contract(compiledERC20, usdcAddress, account).decimals(), usd_price: usdc_price },
        { symbol: "USDT", address: usdtAddress, abi: compiledERC20, decimals: await new Contract(compiledERC20, usdtAddress, account).decimals(), usd_price: USDT_price },
        { symbol: "dai", address: daiAddress, abi: compiledERC20, decimals: await new Contract(compiledERC20, daiAddress, account).decimals(), usd_price: dai_price },
        { symbol: "STRK", address: strkAddress, abi: compiledERC20, decimals: await new Contract(compiledERC20, strkAddress, account).decimals(), usd_price: strk_price },    
    ];

    const { maxToken, maxBalance, maxBalance_usd } = await findTokenWithMaxBalance(account, token_list);
    
    console.log( `Max. token in account: ${maxToken}, Amount of: ${maxBalance_usd} USD` );
    
    return { maxToken: maxToken ? maxToken : '', maxBalance }; 
};

async function main(
    tokenSymbolIn: String,
    tokenAmount: String,
    tokenSymbolOut: String,
    slippage_: number,
) { 
    // Defines the provider
    const provider = new RpcProvider({ nodeUrl: constants.NetworkName.SN_MAIN });
    //const provider = new RpcProvider({ nodeUrl: "https://starknet-mainnet.infura.io/v3/" + "YOUR_API_KEY" });
    await provider.getChainId();
    
    // Defines the router
    const fibrous = new FibrousRouter();

    // Get the supported tokens from FibrousRouter
    const tokens = await fibrous.supportedTokens();
    const eth_price = tokens.eth.price;
    const strk_price = tokens.STRK.price;
    const tokenInAddress = tokens[tokenSymbolIn.toString()].address;
    const tokenOutAddress = tokens[tokenSymbolOut.toString()].address;
    const tokenInDecimals = tokens[tokenSymbolIn.toString()].decimals;
    const tokenOutDecimals = tokens[tokenSymbolOut.toString()].decimals;
    
    const inputAmount = BigNumber.from(parseUnits(tokenAmount.toString(), tokenInDecimals));

    // Get the best route for swap
    const route = await fibrous.getBestRoute(
        inputAmount,
        tokenInAddress,
        tokenOutAddress,
    );

    if (route.success) {
        const input_amount = formatUnits((route.inputAmount), tokenInDecimals);
        const output_amount = formatUnits((route.outputAmount), tokenOutDecimals);
    } else {
        console.error('Failed to get the route');
    }

    // Applies the account with private key and account address
    const privateKey = config.privateKey;
    const accountAddress = "YOUR_ACCOUNT_ADDRESS";
    
    // Or you can write down your private key. If you activate that one, please delete the code(line:13).
    //const privateKey = "YOUR_PRIVATE_KEY";
    
    // https://www.starknetjs.com/docs/guides/connect_account
    const account = new Account(provider, accountAddress, privateKey);

    // Applies the slippage amount and receiver address (it is same as account address)
    const slippage = slippage_;
    // slippage: The maximum acceptable slippage of the buyAmount amount. 
    // slippage formula = slippage * 100
    // value 0.005 is %0.5, 0.05 is 5%, 0.01 is %1, 0.001 is %0.1 ...
    const receiverAddress = accountAddress;

    // Builds a Starknet approve transaction
    const approveCall:Call = await fibrous.buildApprove(
          inputAmount,
          tokenInAddress,
    );
    
    // Builds a Starknet transaction out of the route response
    const swapCall:Call = await fibrous.buildTransaction(
        inputAmount,
        tokenInAddress,
        tokenOutAddress,
        slippage,
        receiverAddress,
    );

    // Calculate the profit-loss
    if(tokenSymbolIn==="eth" && tokenSymbolOut==="STRK") {
        const routeResult = (output_amount*strk_price)-(input_amount*eth_price);

        // Calculate the estimate fee for swap
        const estimateFee = await account.estimateFee([approveCall, swapCall]);
        const gas_fee = Number(estimateFee.overall_fee)/1e18;
        const overall_fee = (gas_fee*eth_price/45);
        const profit_loss = (routeResult-overall_fee);
        const profit_loss_adj = parseFloat(profit_loss.toFixed(6));

        return (profit_loss_adj);

    } else if(tokenSymbolIn==="STRK" && tokenSymbolOut==="eth") {
        const routeResult = (output_amount*eth_price)-(input_amount*strk_price);

        // Calculate the estimate fee for swap
        const estimateFee = await account.estimateFee([approveCall, swapCall]);
        const gas_fee = Number(estimateFee.overall_fee)/1e18;
        const overall_fee = (gas_fee*eth_price/45);
        const profit_loss = (routeResult-overall_fee);
        const profit_loss_adj = parseFloat(profit_loss.toFixed(6));

        return (profit_loss_adj);
    
    } else if(tokenSymbolIn==="eth") {
        const routeResult = (output_amount)-(input_amount*eth_price);

        // Calculate the estimate fee for swap
        const estimateFee = await account.estimateFee([approveCall, swapCall]);
        const gas_fee = Number(estimateFee.overall_fee)/1e18;
        const overall_fee = (gas_fee*eth_price/45);
        const profit_loss = (routeResult-overall_fee);
        const profit_loss_adj = parseFloat(profit_loss.toFixed(6));

        return (profit_loss_adj);

    } else if(tokenSymbolOut==="eth") {
        const routeResult = (output_amount*eth_price)-(input_amount);

        // Calculate the estimate fee for swap
        const estimateFee = await account.estimateFee([approveCall, swapCall]);
        const gas_fee = Number(estimateFee.overall_fee)/1e18;
        const overall_fee = (gas_fee*eth_price/45);
        const profit_loss = (routeResult-overall_fee);
        const profit_loss_adj = parseFloat(profit_loss.toFixed(6));

        return (profit_loss_adj);

    } else if(tokenSymbolIn==="STRK") {
        const routeResult = (output_amount)-(input_amount*strk_price);

        // Calculate the estimate fee for swap
        const estimateFee = await account.estimateFee([approveCall, swapCall]);
        const gas_fee = Number(estimateFee.overall_fee)/1e18;
        const overall_fee = (gas_fee*eth_price/45);
        const profit_loss = (routeResult-overall_fee);
        const profit_loss_adj = parseFloat(profit_loss.toFixed(6));

        return (profit_loss_adj);

    } else if(tokenSymbolOut==="STRK") {
        const routeResult = (output_amount*strk_price)-(input_amount);

        // Calculate the estimate fee for swap
        const estimateFee = await account.estimateFee([approveCall, swapCall]);
        const gas_fee = Number(estimateFee.overall_fee)/1e18;
        const overall_fee = (gas_fee*eth_price/45);
        const profit_loss = (routeResult-overall_fee);
        const profit_loss_adj = parseFloat(profit_loss.toFixed(6));

        return (profit_loss_adj);

    } else {
        const routeResult = (output_amount-input_amount);

        // Calculate the estimate fee for swap
        const estimateFee = await account.estimateFee([approveCall, swapCall]);
        const gas_fee = Number(estimateFee.overall_fee)/1e18;
        const overall_fee = (gas_fee*eth_price/45);
        const profit_loss = (routeResult-overall_fee);
        const profit_loss_adj = parseFloat(profit_loss.toFixed(6));

        return profit_loss_adj;
    }
};

async function findbest(
    mytoken: string,
    myamount: string,
    myslippage: number,
) {
    // Tokens to check
    const tokensToCheck = ["eth", "usdc", "USDT", "dai", "STRK"]; // If you have problem with "dai", you can just remove it from the list.

    const promises = tokensToCheck
    .filter(token => token !== mytoken)
    .map(async (token) => {
        // Find the profit/loss
        try {
            const route_result = await main(mytoken, myamount, token, myslippage);
            return { token, route_result };
        } catch (error) {
            console.error(`Error processing with ${token}`, error);
            return { token, route_result: null };
        }
    });

    const results = await Promise.all(promises);

    // Filter out tokens with errors
    const validResults = results.filter(result => result.route_result !== null);

    // Find the best token based on routeResult
    const bestResult = validResults.reduce((max, current) => (current.route_result > max.route_result ? current : max), validResults[0]);

    console.log(`Best Token: ${bestResult.token} with Profit/Loss: ${bestResult.route_result}`);
    
    return { bestToken: bestResult.token, pnl: bestResult.route_result };
};

async function swapExecute(
    tokenSymbolIn: String,
    tokenAmount: String,
    tokenSymbolOut: String,
    slippage_: number,
) { 
    // Defines the provider
    const provider = new RpcProvider({ nodeUrl: constants.NetworkName.SN_MAIN });
    //const provider = new RpcProvider({ nodeUrl: "https://starknet-mainnet.infura.io/v3/" + "YOUR_API_KEY" });
    await provider.getChainId();
    
    const fibrous = new FibrousRouter();

    const tokens = await fibrous.supportedTokens();
    const tokenInAddress = tokens[tokenSymbolIn.toString()].address;
    const tokenOutAddress = tokens[tokenSymbolOut.toString()].address;
    const tokenInDecimals = tokens[tokenSymbolIn.toString()].decimals;
    
    const inputAmount = BigNumber.from(parseUnits(tokenAmount.toString(), tokenInDecimals));

    // Apply the account with private key and account address
    const privateKey = config.privateKey;
    const accountAddress = "YOUR_ACCOUNT_ADDRESS";
    
    // Or you can write down your private key. If you activate that one, please delete the code(line:13).
    //const privateKey = "YOUR_PRIVATE_KEY";
    
    // https://www.starknetjs.com/docs/guides/connect_account
    const account = new Account(provider, accountAddress, privateKey);

    const slippage = slippage_;
    const receiverAddress = accountAddress;

    const approveCall:Call = await fibrous.buildApprove(
          inputAmount,
          tokenInAddress,
    );
    
    const swapCall:Call = await fibrous.buildTransaction(
        inputAmount,
        tokenInAddress,
        tokenOutAddress,
        slippage,
        receiverAddress,
    );
    
    //Execute transaction and print the TX HASH
    const {transaction_hash: TXHASH} = await account.execute([approveCall, swapCall]);
    console.log(`${tokenAmount} Amount of ${tokenSymbolIn} swapping to ${tokenSymbolOut}. (Slippage is: ${slippage})`)
    await provider.waitForTransaction(TXHASH);
    console.log("TX HASH:", TXHASH);
};

async function run_swap() {
    // Applies the max. token of account
    const { maxToken, maxBalance } = await accountBalance();

    if (maxToken.toString() === "eth") {
        // Takes 90% of amount of eth, max. amount of other tokens 
        const maxBalance_eth = maxBalance * 0.90
        // Finds the best token with best result
        const {bestToken, pnl} = await findbest( maxToken.toString(), maxBalance_eth.toString(), 0.005 );
        
        if (pnl >= 0.00000) {
            await swapExecute( maxToken.toString(), maxBalance_eth.toString(), bestToken.toString(), 0.005 );
        } else {
            console.log("Swap does not make sense. Profit/Loss is not positive.");
            return null; // Adjust the return value as needed
        }
    } else {
        const {bestToken, pnl} = await findbest(maxToken.toString(), maxBalance.toString(), 0.005);
        if (pnl >= 0.00000) {
            await swapExecute(maxToken.toString(), maxBalance.toString(), bestToken.toString(), 0.005);
        } else {
            console.log("Swap does not make sense. Profit/Loss is not positive.");
            return null; // Adjust the return value as needed
        }
    };
};

run_swap();