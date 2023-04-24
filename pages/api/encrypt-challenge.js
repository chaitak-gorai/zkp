const elliptic = require('elliptic')
const ec = new elliptic.ec('secp256k1') // elliptic curve used by Bitcoin
const crypto = require('crypto')

export default async function generateKeyPair(req, res) {
  const privateKey = req.body.privateKey
  const privKey = ec.keyFromPrivate(privateKey, 'hex')
  const challenge = Buffer.from(req.body.challenge.toString(), 'hex')
  const signature = privKey.sign(challenge).toDER('hex')
  console.log('signature: ', signature)
  res.status(200).json({
    encryptedChallenge: signature,
  })
}
