
const bitcoin = require("bitcoinjs-lib");
import * as ecc from "tiny-secp256k1";
import { BIP32Factory } from "bip32";
const bip39 = require("bip39");
const bip32 = BIP32Factory(ecc);

export function capitalize(str) {
  let _str = String(str);
  _str = _str.toUpperCase()[0] + _str.slice(1);
  console.log('str,', _str)
  return _str;
}
export function arrayToPrivateKey(array_) {
  return Array.from(array_, (byte) => {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
}


export function generateBitcoinTestAddress(mnemonic) {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const root = bip32.fromSeed(seed);

  const path = "m/0'/0'/0'/0/0"; // Derivation path for first address

  const keyPair = root.derivePath(path);
  const privateKey = keyPair.toWIF();
  const address = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: bitcoin.networks.testnet }).address;

  return {
    privateKey: privateKey,
    address: address
  }
}

export function generateBitcoinMainAddress(mnemonic) {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const root = bip32.fromSeed(seed);

  const path = "m/0'/0'/0'/0/0"; // Derivation path for first address

  const keyPair = root.derivePath(path);
  const privateKey = keyPair.toWIF();
  const address = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: bitcoin.networks.bitcoin }).address;

  return {
    privateKey: privateKey,
    address: address
  }
} 

export function generateBitcoinMainAddressFromPrivateKeyWIF(privateKeyWIF) {
  const keyPair = bitcoin.ECPair.fromWIF(privateKeyWIF);
  const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: bitcoin.networks.bitcoin });
  return {
    privateKey: privateKeyWIF,
    address: address
  }
}

export function generateBitcoinTestAddressFromPrivateKeyWIF(privateKeyWIF) {
  const keyPair = bitcoin.ECPair.fromWIF(privateKeyWIF);
  const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: bitcoin.networks.testnet });
  return {
    privateKey: privateKeyWIF,
    address: address
  }
}

export function generateBitcoinMainAddressFromPrivateKey(privateKey) {
  const keyPair = bitcoin.ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'));
  const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: bitcoin.networks.bitcoin });
  return {
    privateKey: privateKey,
    address: address
  }
}

export function generateBitcoinTestAddressFromPrivateKey(privateKey) {
  const keyPair = bitcoin.ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'));
  const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: bitcoin.networks.testnet });
  return {
    privateKey: privateKey,
    address: address
  }
}