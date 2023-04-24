const EC = require('elliptic/lib/elliptic/ec')
const elliptic = require('elliptic')
export default async function handler(req, res) {
  const ec = new elliptic.ec('secp256k1')

  const publicKey = req.body.publicKey
  console.log('publicKey: ', publicKey)
  const chlg = req.body.challenge
  const signature = req.body.encryptedChallenge

  const parsedPublicKey = ec.keyFromPublic(publicKey, 'hex')
  if (!parsedPublicKey.validate()) {
    throw new Error(`Invalid public key for user with ID ${id}`)
  }
  const challenge = Buffer.from(chlg, 'hex')
  const valid = parsedPublicKey.verify(challenge, signature)
  console.log('valid: ', valid)
  if (valid) {
    res.status(200).json({ msg: 'logged in successful', success: true })
  } else {
    res.status(200).json({ msg: 'logged in failed', success: false })
  }
  // res.status(200).json({ msg: 'logged in successful', success: false })
}
