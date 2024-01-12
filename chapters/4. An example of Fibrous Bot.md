# Fibrous Bot

The Fibrous Bot [File](./src/runBot.ts) under the src folder.
For that is required;
**RPC Provider**, **Public Key** and **Private Key** again.

And also some files are required;
- erc20ETH.json [File](./compiledContract/erc20ETH.json) for the tokens contract and abi.
- formatBalance.ts [File](./src/formatBalance.ts) to finding correct token decimals for account balance.

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

For deactivating the crontab job with terminal:
```bash
crontab -r
```