# BARK | CNFT Staking Platform

Welcome to the BARK | CNFT Staking Platform repository. This platform allows users to stake their CNFTs (Crypto Non-Fungible Tokens) on the Solana blockchain and manage their assets effectively. Built with modern web technologies, this platform offers a seamless staking experience with real-time updates and comprehensive NFT management.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Staking Management**: Stake and unstake your CNFTs with ease.
- **Real-time Updates**: Get real-time updates on staking status and NFT details.
- **Price Tracking**: Monitor the price of SOL and other relevant metrics.
- **Modular Components**: Reusable components for managing modals and tabs.
- **Security**: Secure interactions with Solana blockchain using well-established libraries.

## Technologies Used

- **Frontend**:
  - React
  - TypeScript
  - Tailwind CSS
  - @solana/web3.js
  - @metaplex-foundation/js
  - @coral-xyz/anchor

- **Backend**:
  - Node.js
  - Express
  - Solana RPC API

- **Utilities**:
  - @solana/spl-token
  - @solana/wallet-adapter-react
  - @solana/wallet-adapter-react-ui

## Installation

To get started with the BARK CNFT Staking Platform, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/barkprotocol/bark-cnft-staking-platform.git
    ```

2. **Navigate to the project directory**:
    ```bash
    cd bark-cnft-staking-platform
    ```

3. **Install dependencies**:
    ```bash
    npm install
    ```

4. **Set up environment variables**:
   Create a `.env` file in the root directory and add the required environment variables:
    ```bash
    NEXT_PUBLIC_API_ENDPOINT=https://api.domain.com
    ADMIN_WALLET=your_admin_wallet_base58_secret
    SOLANA_RPC=https://api.mainnet-beta.solana.com
    ```

5. **Run the development server**:
    ```bash
    npm run dev
    ```

6. **Open your browser**:
   Navigate to `http://localhost:3000` to see the platform in action.

## Configuration

Ensure you configure the following environment variables:

- `NEXT_PUBLIC_API_ENDPOINT`: The endpoint for your backend API.
- `ADMIN_WALLET`: Base58 encoded secret key of the admin wallet for signing transactions.
- `SOLANA_RPC`: The RPC URL for the Solana blockchain.

## Usage

- **Connecting Wallet**: Use the Connect button to link your Solana wallet.
- **Staking NFTs**: Navigate to the staking interface to stake or unstake your CNFTs.
- **Managing NFTs**: View and manage your NFTs using the provided tabs and modals.

## Contributing

We welcome contributions to the BARK CNFT Staking Platform! To contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.