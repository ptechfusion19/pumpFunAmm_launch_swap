# PumpFun AMM Launch and Swap

This project includes scripts to **create a PumpFun Automated Market Maker (AMM)** and **perform buy/sell operations** on the AMM using Solana.

## Features

- **Automated Market Maker (AMM) Creation**:
  - The `createPool.js` script initializes a new AMM pool on Solana.
- **Buy and Sell Operations**:
  - The `buy.js` script allows you to buy base tokens using quote tokens.
  - The `sell.js` script allows you to sell base tokens for quote tokens.

### Scripts

The following npm scripts are defined in `package.json`:

1. **Create Pool**:

   - **Command**: `npm run createPool`
   - **Description**: Creates a new AMM pool on Solana and saves the pool key to a `poolKey.json` file for later use.

2. **Buy**:

   - **Command**: `npm run buy`
   - **Description**: Executes the buy operation, allowing you to buy base tokens using quote tokens.

3. **Sell**:
   - **Command**: `npm run sell`
   - **Description**: Executes the sell operation, allowing you to sell base tokens for quote tokens.

### Setup

#### 1. **Clone the Repository**

```bash
git clone https://github.com/ptechfusion19/pumpFunAmm_launch_swap.git
cd pumpFunAmm_launch_swap

```

#### 2. **Install Dependencies**

```bash
npm install
```

#### 3. **Set Up Environment Variables**

Copy the example.env file to .env:

#### 4. Run the Scripts

To create the PumpFun AMM:

bash```
npm run createPool

````
To perform a buy operation:

bash```
npm run buy
````

To perform a sell operation:

bash```
npm run sell

```

```
