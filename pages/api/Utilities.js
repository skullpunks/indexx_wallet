/*const ecc = require('tiny-secp256k1');
console.log(ecc.isPoint)
const { BIP32Factory } = require('bip32');
// You must wrap a tiny-secp256k1 compatible implementation
const bip32 = BIP32Factory(ecc);
const bip39 = require('bip39');
const bitcoin = require('bitcoinjs-lib'); */
export function capitalize(str) {
  let _str = String(str);
  _str = _str.toUpperCase()[0] + _str.slice(1);
  return _str;
}
export function arrayToPrivateKey(array_) {
  return Array.from(array_, (byte) => {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
}

/*
export function generateBitcoinTestAddress(mnemonic) {
  //const bip32 = BIP32Factory.default(ecc);
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const root = bip32.fromSeed(seed);

  const path = "m/49'/1'/0'/0/0";
  const child = root.derivePath(path);

  const { address } = bitcoin.payments.p2sh({
    redeem: bitcoin.payments.p2wpkh({
      pubkey: child.publicKey,
      network: bitcoin.networks.testnet,
    }),
    network: bitcoin.networks.testnet,
  });
  console.log(address, "address");
}

export function generateBitcoinMainAddress(mnemonic) {
  //const bip32 = BIP32Factory.default(ecc);
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const root = bip32.fromSeed(seed);

  const path = "m/49'/0'/0'/0";
  const child = root.derivePath(path);

  const { address } = bitcoin.payments.p2sh({
    redeem: bitcoin.payments.p2wpkh({
      pubkey: child.publicKey,
      network: bitcoin.networks.bitcoin,
    }),
    network: bitcoin.networks.bitcoin,
  });
} */