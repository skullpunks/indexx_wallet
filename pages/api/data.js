import { Network } from "alchemy-sdk";
export let tokens = {
  mainnet: [
    {
      name: "INEX",
      address: "0x02082bE81e0b8BE7D7bdAa75A2706B20EdCD9BF9",
    },
    {
      name: "IN500",
      address: "0xABE6d850A3CBfa544DAB3c57B29A1924ff27E38c",
    },
    {
      name: "INXC",
      address: "0x0d7C838a0cba5c7A486ca9771fF9217FBd9B9A49",
    },
    {
      name: "INUSD+",
      address: "0x8bA9A63cac81B09509360d0A027dCE14F90F6779",
    },
    {
      name: "INXP",
      address: "0x3A0bbd58EBEBBcF6F8e6cAd408f17f59Fab68836",
    },
    {
      name: "USDT",
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    },
    {
      name: "BNB",
      address: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
    },
    {
      name: "USDC",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
    {
      name: "BUSD",
      address: "0x4Fabb145d64652a948d72533023f6E7A623C7C53",
    },

    {
      name: "MATIC",
      address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
    },

    {
      name: "OKB",
      address: "0x75231F58b43240C9718Dd58B4967c5114342a86c",
    },

    {
      name: "stETH",
      address: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
    },
    {
      name: "anyLTC",
      address: "0x0aBCFbfA8e3Fda8B7FBA18721Caf7d5cf55cF5f5",
    },
    {
      name: "SHIB",
      address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
    },
    {
      name: "THETA",
      address: "0x3883f5e181fccaF8410FA61e12b59BAd963fb645",
    },
  ],

  goerli: [
    {
      name: "INEX",
      address: "0x674d7916e8B7ccD3Bc54eDf2a1274F683501413a",
    },
    {
      name: "IN500",
      address: "0xD1feBC83Bc784cE3F21986FcEBA08791072046A1",
    },
    {
      name: "INXC",
      address: "0x172aa1665048C95F1cD8586191dE02E84EC69079",
    },
    {
      name: "INUSD+",
      address: "0x72ADA7cc2d933134010d6ccdd14512E6B0fd0761",
    },
    {
      name: "INXP",
      address: "0xd98f0397B65e3bD1F6433eB044242136B2C842a6",
    },
    {
      name: "WBTC",
      address: "0xD8c4F6e84D6f6A0D39d25a3F42F15351303a6Af5",
    },

    {
      name: "WETH",
      address: "0x695364ffAA20F205e337f9e6226e5e22525838d9",
    },
    {
      name: "USDC",
      address: "0x8C1170519FE80dc2d56eB95B073D5C3203208985",
    },
  ],
};

export let alchemyApps = {
  goerli: {
    apiKey: "OINpsQZSN0z6VRLC1jL5YYrLmQiYGARE",
    network: Network.ETH_GOERLI,
  },

  mainnet: {
    apiKey: "Ye6S888IuNTfAGGPQf2C_ZRvXJD9YQdQ",
    network: Network.ETH_MAINNET,
  },
};
export let chains = [
  {
    name: "mainnet",
    label: "Ethereum Mainnet",
    chain_id: 1,
  },
  {
    name: "goerli",
    label: "Goerli test network",
    chain_id: 5,
  },
];

export let GoerliProviders = {
  goerli: "https://goerli.infura.io/v3/e3562069a1d44d18aa58a3ea55ccf21a",
  mainnet: "https://mainnet.infura.io/v3/e3562069a1d44d18aa58a3ea55ccf21a",
};

export let buyMethods = [
  {
    title: "Indexx.ai",
    description: "You can easily buy, sell or swap crypto from indexx.ai",
    logo: "https://indexx-exchange.s3.ap-northeast-1.amazonaws.com/indexxLogoSmall.png"
  },
  {
    title: "Coinbase Pay",
    description:
      "You can easily buy or transfer crypto with your Coinbase account.",
    logo: `https://uploads-ssl.webflow.com/5f9a1900790900e2b7f25ba1/60f6a9afaba0af0029922d6d_Coinbase%20Wallet.png`,
  },

  {
    title: "Transak",
    description:
      "Transak supports credit & debit cards, Apple Pay, MobiKwik, and bank transfers (depending on location) in 100+ countries. ETH deposits directly into your MetaMask account.",
    logo: `https://mms.businesswire.com/media/20220425005854/en/1431513/22/logo_transparent.jpg`,
  },
  {
    title: "MoonPay",
    description:
      "MoonPay supports popular payment methods, including Visa, Mastercard, Apple / Google / Samsung Pay, and bank transfers in 145+ countries. Tokens deposit into your MetaMask account.",
    logo: `https://www.moonpay.com/assets/logo-full-purple.svg`,
  },
  {
    title: "Wyre",
    description:
      "Easy onboarding for purchases up to $ 1000. Fast interactive high limit purchase verification. Supports Debit/Credit Card, Apple Pay, Bank Transfers. Available in 100+ countries. Tokens deposit into your MetaMask Account",
    logo: `https://images.g2crowd.com/uploads/product/image/social_landscape/social_landscape_e97458783e493c9b8e5e8da0aaa92dfd/wyre.png`,
  },
];
export let currencyOf = {
  goerli: "ETH",
  mainnet: "ETH",
};
