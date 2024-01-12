# Examples

## Supported Tokens

Let's see the supported tokens [file](/src/supportedTokens.ts) under the src folder.<br>
That script connect with fibrous router and get the informations about tokens.

Script is written with typescript (ts format), it needs to be converted to js format.
```bash
# Let's go first to the src folder
cd src
```
```bash
tsc supportedTokens.ts
```

If you don't have tsc, just install it with npm.
```bash
npm install -g typescript
```

After converting ts file to js file, you can see in src folder a new js file as **supportedTokens.js**.<br>
Let's see which tokens we are getting...
```bash
node supportedTokens.js
```

As a result you can see bunch of tokens like below:<br>

.<br>
.<br>
.<br>
usdc: {<br>
  address: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',<br>
  name: 'usd-coin',<br>
  symbol: 'usdc',<br>
  decimals: 6,<br>
  price: '1.001',<br>
  imageUrl: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png?1696506694',<br>
  valuable: true,<br>
  verified: true<br>
},<br>
.<br>
.<br>
.<br>

---

## Route

Let's have a look the route [file](/src/route.ts) between eth - usdc.<br>
Again we need to convert our ts file to js file.
```bash
tsc route.ts
```

After creating the js file, run it...
```bash
node route.js
```

As a result we get the best route from sdk like below:<br>

route {<br>
  success: true,<br>
  inputToken: {<br>
    address: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',<br>
    decimals: 18,<br>
    isBase: false,<br>
    isNative: true,<br>
    name: 'Ether',<br>
    symbol: 'eth',<br>
    price: 2252.25,<br>
    verified: true<br>
  },<br>
  inputAmount: '1000000000000000000',<br>
  outputToken: {<br>
    address: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',<br>
    decimals: 6,<br>
    isBase: false,<br>
    isNative: false,<br>
    name: 'usd-coin',<br>
    symbol: 'usdc',<br>
    price: 1,<br>
    verified: true,<br>
    reserve: { type: 'BigNumber', hex: '0x018204c71cd5' }<br>
  },<br>
  outputAmount: '2249562970',<br>
  time: 0.366,<br>
  estimatedGasUsed: '0',<br>
  route: [ { percent: '100%', swaps: [Array] } ],<br>
  bestQuotesByProtocols: [<br>
    '0',<br>
    '2237008599',<br>
    '0',<br>
    '0',<br>
    '2249562970',<br>
    '2249574509',<br>
    '2182044320'<br>
  ]<br>
}<br>

---

If you want to try a route with another tokens, you can change them in route.ts file...
```bash
# Input token, let's try this time usdc
const tokenInAddress = tokens["usdc"].address;

# Output token, try usdc swap to dai
const tokenOutAddress = tokens["dai"].address;

# Here is defining decimal of token, which we want to swap
const tokenInDecimals = tokens["usdc"].decimals;

# And how much we want to swap, let's try 1000$
const inputAmount = BigNumber.from(parseUnits("1000", tokenInDecimals));
```

After changing script we need to save ts file and convert again to js file.
```bash
tsc route.ts
```

```bash
node route.js
```

---

For [Account](/chapters/Account.md) instructions, please refer to the next step.