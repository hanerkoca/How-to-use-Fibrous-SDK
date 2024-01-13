# Fibrous Bot

The Fibrous Bot [File](/src/runBot.ts) under the src folder.<br>
For that is required;<br>
**RPC Provider**, **Public Key** and **Private Key** again.

And also some files are required;
- erc20ETH.json [File](/compiledContract/erc20ETH.json) for the tokens contract and abi.
- formatBalance.ts [File](/src/formatBalance.ts) to finding correct token decimals for account balance.

Script is written with typescript (ts format), it needs to be converted to js format.
```bash
cd src
```
```bash
tsc runBot.ts
```

After converting js file, run the file.
```bash
node runBot.js
```

---

## Using it with Crontab
Crontab is a Unix-based tool for managing and automating tasks on macOS.

How to use it with terminal:
```bash
crontab -e
```

That script runs the runBot.js file every 30 seconds, save it and exit from edit page:
```bash
* * * * * /usr/local/bin/node /amm/src/runBot.js >> /amm/src/output.log 2>&1
* * * * * sleep 30; /usr/local/bin/node /amm/src/runBot.js >> /amm/src/output.log 2>&1
```

Results will be like below:

Getting token prices...<br>
Max. token in account: eth, Amount of: 143.2087496974167 USD<br>
Best Token: usdc with Profit/Loss: -1.35942<br>
Swap does not make sense. Profit/Loss is not positive.

or

Getting token prices...<br>
Max. token in account: eth, Amount of: 157.5716066121188 USD<br>
Best Token: USDT with Profit/Loss: 0.612732<br>
0.0512819758317154 Amount of eth swapping to USDT. (Slippage is: 0.005)<br>
TX HASH: TX_HASH

For deactivating the crontab job with terminal:
```bash
crontab -r
```
