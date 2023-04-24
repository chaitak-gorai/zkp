// import { generateKeyPair } from 'crypto'
// import { promisify } from 'util'
// export default async function handler(req, res) {
//   try {
//     const { username } = req.body

//     const { publicKey, privateKey } = await promisify(generateKeyPair)('rsa', {
//       modulusLength: 2048,
//     })

//     // Store the private key somewhere safe!
//     console.log(`Private key for ${username}:`, privateKey.export())

//     res.status(200).json({ publicKey: publicKey.export() })
//   } catch (e) {
//     console.log(e)
//   }
// }
const elliptic = require('elliptic')
const ec = new elliptic.ec('secp256k1') // elliptic curve used by Bitcoin
const crypto = require('crypto')
export default async function generateKeyPair(req, res) {
  const keyPair = ec.genKeyPair()
  const privateKey = keyPair.getPrivate()
  const publicKey = keyPair.getPublic()
  console.log('Private key: ', privateKey.toString(16))
  console.log('Public key: ', publicKey.encode('hex'))
  const challenge = crypto.randomBytes(32)

  res.status(200).json({
    publicKey: publicKey.encode('hex'),
    privateKey: privateKey.toString(16),
    challenge: challenge.toString('hex'),
  })
}
