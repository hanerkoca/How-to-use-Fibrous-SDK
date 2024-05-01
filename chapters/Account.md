# Account

## Getting existing account

The Account [file](/src/account.ts) under the src folder is for getting the existing account.<br>
For that we need **RPC Provider**, **Public Key** and **Private Key** from our accounts.

For Provider to use there are 2 options, first one is from starknet library.<br>
Second one is your rpc. You can create an API Key on infura.
```bash
# Option 1 (It is for example for Mainnet).
const provider = new RpcProvider({ nodeUrl: constants.NetworkName.SN_MAIN });

# Option 2
const provider = new RpcProvider({ nodeUrl: "https://starknet-mainnet.infura.io/v3/" + "YOUR_API_KEY" });
```

### Infura API Key

You can create an account on [Infura](https://app.infura.io/) and create a new API Key.<br>
After that you can choose which Endpoint you use, in that case you can choose just Starknet Mainnet.<br>
Note: For free accounts, up to 100.000 requests are allowed daily.
Recommend: It is better to use RpcProvider with free Infura account instead of Starknet's default provider "constants.NetworkName.SN_MAIN".

---

## Public and Private Keys

As you know **Private Key** is important and secret information.<br>
Please don't share it!!!

How to hide it in script?<br>
We should create a config function and a file with env format.

First of all install the dotenv with npm...
```bash
npm install dotenv
```

After that, terminal may need to reset.

Create a config [file](/src/config.ts) and env format for private key under src folder.<br>
In the [file](/src/.env) with env format, there should be the private key.<br>
Instead of "YOUR_PRIVATE_KEY" write down your private key.<br>
From your wallet you can get the private key from "Privacy & Security".

---

## Balance of Account

Let's try to getting balance of our account.<br>
In this [file](/src/accountBalance.ts) you should provide some informations, as we talk above.<br>
- Provider (Mainnet from starknet or your rpc with API Key).
- YOUR_ACCOUNT_ADDRESS
- YOUR_PRIVATE_KEY without hiding or using config with env format.

Script is written with typescript (ts format), it needs to be converted to js format.
```bash
# Go to the src folder again.
cd src
```
```bash
tsc accountBalance.ts
```

After converting js file, let's see the balance of account.
```bash
node accountBalance.js
```

As a result you should see like below:<br>

Getting token prices...<br>
eth, Amount of: 33.74372843924649 USD<br>
usdc, Amount of: 0 USD<br>
USDT, Amount of: 314.162102165808 USD<br>
dai, Amount of: 0 USD

---

For an example of [Fibrous Bot](/chapters/Fibrous%20Bot.md), please refer to the next step.