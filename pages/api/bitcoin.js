const bitcoin = require('bitcoinjs-lib');
const ecc = require('tiny-secp256k1');
const { BIP32Factory } = require('bip32');
const bip32 = BIP32Factory(ecc);
const bip39 = require('bip39');
const { ECPairFactory } = require("ecpair");
const ECPair = ECPairFactory(ecc);

function generateBitcoinMainAddressFromMnemonic(mnemonic) {
    console.log("generateBitcoinMainAddressFromMnemonic")
    // Generate a random 12-word mnemonic seed phrase
    //const mnemonic = bip39.generateMnemonic();

    // Derive the seed from the mnemonic phrase
    const seed = bip39.mnemonicToSeedSync(mnemonic);

    // Create a Bitcoin HD wallet from the seed
    //const root = bitcoin.bip32.fromSeed(seed);
    const root = bip32.fromSeed(seed);
    // Generate a Bitcoin address and private key
    const path = "m/0'/0'/0'/0/0"; // Derivation path for first address
    const keyPair = root.derivePath(path);
    const privateKey = keyPair.toWIF();
    const address = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey }).address;

    console.log(`Mnemonic: ${mnemonic}`);
    console.log(`Private Key: ${privateKey}`);
    console.log(`Address: ${address}`);

    return {
        mnemonic: mnemonic,
        privateKey: privateKey,
        address: address
    }
}

function generateBitcoinTestAddressFromMnemonic(mnemonic) {
    console.log("generateBitcoinTestAddressFromMnemonic")
    // Generate a random 12-word mnemonic seed phrase
    //const mnemonic = bip39.generateMnemonic();

    // Derive the seed from the mnemonic phrase
    const seed = bip39.mnemonicToSeedSync(mnemonic);

    // Create a Bitcoin HD wallet from the seed
    //const root = bitcoin.bip32.fromSeed(seed);
    const root = bip32.fromSeed(seed);
    // Generate a Bitcoin address and private key
    const path = "m/0'/0'/0'/0/0"; // Derivation path for first address
    const keyPair = root.derivePath(path);
    const privateKey = keyPair.toWIF();
    const address = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: bitcoin.networks.testnet }).address;

    console.log(`Mnemonic: ${mnemonic}`);
    console.log(`Private Key: ${privateKey}`);
    console.log(`Address: ${address}`);
    return {
        privateKey: privateKey,
        address: address
    }
}

function generateBitcoinMainAddressFromPrivateKey(privateKey) {
    console.log("generateBitcoinMainAddressFromPrivateKey")
    // Generate a random 12-word mnemonic seed phrase
    //const mnemonic = bip39.generateMnemonic();

    // Derive the seed from the mnemonic phrase
    //const seed = bip39.mnemonicToSeedSync(mnemonic);

    // Create a Bitcoin HD wallet from the seed
    //const root = bitcoin.bip32.fromSeed(seed);
    //const root = bip32.fromSeed(seed);
    // Generate a Bitcoin address and private key
    const path = "m/0'/0'/0'/0/0"; // Derivation path for first address
    const keyPair = bip32.fromPrivateKey(privateKey);
    const address = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey }).address;

    console.log(`Private Key: ${privateKey}`);
    console.log(`Address: ${address}`);

    return {
        privateKey: privateKey,
        address: address
    }
}

 function generateBitcoinTestAddressFromPrivateKey(privateKey) {
    console.log("generateBitcoinTestAddressFromPrivateKey")
    // Generate a random 12-word mnemonic seed phrase
    //const mnemonic = bip39.generateMnemonic();

    // Derive the seed from the mnemonic phrase
    //const seed = bip39.mnemonicToSeedSync(mnemonic);

    // Create a Bitcoin HD wallet from the seed
    //const root = bitcoin.bip32.fromSeed(seed);
    //const root = bip32.fromSeed(seed);
    // Generate a Bitcoin address and private key
    const path = "m/0'/0'/0'/0/0"; // Derivation path for first address
    const keyPair = bip32.fromPrivateKey(privateKey);
    const address = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: bitcoin.networks.testnet }).address;

    console.log(`Private Key: ${privateKey}`);
    console.log(`Address: ${address}`);

    return {
        privateKey: privateKey,
        address: address
    }
}


 function generateBitcoinMainAddressFromPrivateKeyWIF(privateKeyWIF) {
    console.log("generateBitcoinMainAddressFromPrivateKeyWIF")
    // Generate a random 12-word mnemonic seed phrase
    //const mnemonic = bip39.generateMnemonic();

    // Derive the seed from the mnemonic phrase
    //const seed = bip39.mnemonicToSeedSync(mnemonic);

    // Create a Bitcoin HD wallet from the seed
    //const root = bitcoin.bip32.fromSeed(seed);
    //const root = bip32.fromSeed(seed);
    // Generate a Bitcoin address and private key
    const path = "m/0'/0'/0'/0/0"; // Derivation path for first address
    const keyPair = ECPair.fromWIF(privateKeyWIF);
    const address = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey }).address;

    console.log(`Private Key: ${privateKeyWIF}`);
    console.log(`Address: ${address}`);

    return {
        privateKey: privateKeyWIF,
        address: address
    }
} 


 function generateBitcoinTestAddressFromPrivateKeyWIF(privateKeyWIF) {
    console.log("generateBitcoinTestAddressFromPrivateKeyWIF")
    // Generate a random 12-word mnemonic seed phrase
    //const mnemonic = bip39.generateMnemonic();

    // Derive the seed from the mnemonic phrase
    //const seed = bip39.mnemonicToSeedSync(mnemonic);

    // Create a Bitcoin HD wallet from the seed
    //const root = bitcoin.bip32.fromSeed(seed);
    //const root = bip32.fromSeed(seed);
    // Generate a Bitcoin address and private key
    const path = "m/0'/0'/0'/0/0"; // Derivation path for first address
    const keyPair = ECPair.fromWIF(privateKeyWIF);
    const address = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: bitcoin.networks.testnet }).address;

    console.log(`Private Key: ${privateKeyWIF}`);
    console.log(`Address: ${address}`);

    return {
        privateKey: privateKeyWIF,
        address: address
    }
}

module.exports = {
    generateBitcoinMainAddressFromMnemonic,
    generateBitcoinMainAddressFromPrivateKey,
    generateBitcoinMainAddressFromPrivateKeyWIF,
    generateBitcoinTestAddressFromMnemonic,
    generateBitcoinTestAddressFromPrivateKey,
    generateBitcoinTestAddressFromPrivateKeyWIF
}