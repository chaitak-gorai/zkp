import { useState } from 'react'
import axios from 'axios'
import Modal from 'react-modal'
const IndexPage = () => {
  const [username, setUsername] = useState('')
  const [publicKey, setPublicKey] = useState('')
  const [encryptedChallenge, setEncryptedChallenge] = useState('')
  const [challenge, setChallenge] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [privateKey, setPrivateKey] = useState('')
  const [loadingMsg, setLoadingMsg] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const [steps, setSteps] = useState([
    {
      id: 1,
      title: 'Generate key pair',
      description: 'Generate a key pair for the user',
      completed: false,
    },
    {
      id: 2,
      title: 'Encrypt challenge',
      description: 'Encrypt the challenge using the public key',
      completed: false,
    },
    {
      id: 3,
      title: 'Login',
      description: 'Login using the private key',
      completed: false,
    },
  ])

  const handleGenerateKey = async () => {
    try {
      setLoading(true)
      setLoadingMsg('Generating key pair...')
      const response = await axios.post('/api/generate-key', {
        username,
      })
      console.log(response.data)
      if (response.data.publicKey) {
        setPublicKey(response.data.publicKey)
        console.log(publicKey)
        localStorage.setItem('publicKey', response.data.publicKey)
        localStorage.setItem('privateKey', response.data.privateKey)
        setPrivateKey(response.data.privateKey)
        setChallenge(response.data.challenge)
        console.log(challenge)
        localStorage.setItem('challenge', response.data.challenge)
      }

      setTimeout(() => {
        setLoading(false)
        setSteps((prev) => {
          return prev.map((step) => {
            if (step.id === 1) {
              return { ...step, completed: true }
            }
            return step
          })
        })
        setCurrentStep(2)
      }, 3000)
    } catch (error) {
      console.error(error)
    }
  }

  const handleLogin = async () => {
    try {
      setLoading(true)
      setLoadingMsg('Logging in...')
      const response = await axios.post('/api/login', {
        username,
        publicKey,
        encryptedChallenge,
        challenge,
      })
      console.log(response.data)
      setSuccess(response.data.success)
      setTimeout(() => {
        setLoading(false)
        setSteps((prev) => {
          return prev.map((step) => {
            if (step.id === 3) {
              return { ...step, completed: true }
            }
            return step
          })
        })
        setCurrentStep(4)
      }, 3000)
    } catch (error) {
      console.error(error)
    }
  }

  const handleEncryptChallenge = async () => {
    try {
      setLoading(true)
      setLoadingMsg('Singning challenge with private key...')
      const priKey = localStorage.getItem('privateKey')
      console.log(priKey)
      const response = await axios.post('/api/encrypt-challenge', {
        challenge,
        privateKey: priKey,
      })
      setEncryptedChallenge(response.data.encryptedChallenge)
      localStorage.setItem(
        'encryptedChallenge',
        response.data.encryptedChallenge
      )
      console.log(response.data.encryptedChallenge)

      setTimeout(() => {
        setLoading(false)
        setSteps((prev) => {
          return prev.map((step) => {
            if (step.id === 2) {
              return { ...step, completed: true }
            }
            return step
          })
        })
        setCurrentStep(3)
      }, 3000)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      {loading && (
        <div className='fixed inset-0 z-50 flex justify-center items-center bg-gray-900 bg-opacity-75'>
          <div className='flex justify-center items-center'>
            <svg
              className='animate-spin h-10 w-10 text-white'
              viewBox='0 0 24 24'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              ></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM12 20a8 8 0 01-8-8H0c0 4.418 3.582 8 8 8v-2zm4-5.291A7.962 7.962 0 0116 12h4c0 3.042-1.135 5.824-3 7.938l-3-2.647z'
              ></path>
            </svg>
            <span className='ml-3 text-white font-semibold'>
              {loadingMsg ? loadingMsg : 'Loading...'}
            </span>
          </div>
        </div>
      )}
      <div className='max-w-lg mx-auto mt-8'>
        <h1 className='text-3xl font-bold mb-4'>
          Zero Knowledge Proof Authentication
        </h1>
        <form className='space-y-4' onSubmit={(e) => e.preventDefault()}>
          <div className='flex flex-row steps'>
            {steps.map((step) => (
              <div key={step.id} className='flex items-center space-x-4'>
                <div className='flex-shrink-0'>
                  <span className='inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-500 text-white'>
                    {step.id}
                  </span>
                </div>
                <div className='flex-1  border-gray-200'>
                  <div className='flex justify-between items-center'>
                    <div className='ml-4'>
                      <h3 className='text-lg font-medium text-white'>
                        {step.title}
                      </h3>
                    </div>
                    <div className='ml-4'>
                      {step.completed ? (
                        <svg
                          className='h-6 w-6 text-green-500'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M5 13l4 4L19 7'
                          />
                        </svg>
                      ) : (
                        <svg
                          className='h-6 w-6 text-gray-300'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M6 18L18 6M6 6l12 12'
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {currentStep === 1 && (
            <>
              <div className='flex flex-col'>
                <label className='mb-2 font-semibold'>Username</label>
                <input
                  type='text'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className='border border-gray-400 px-3 py-2 rounded-lg text-black'
                />
              </div>
              <div className='flex flex-col'>
                <button
                  onClick={handleGenerateKey}
                  className='bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition-colors'
                  disabled={loading}
                >
                  {loading ? 'Generating Key Pair...' : 'Generate Key Pair'}
                </button>
              </div>
            </>
          )}
          {currentStep === 2 && (
            <>
              <div>
                <h2 className='text-xl font-semibold mb-2'>
                  Public and Private Key
                </h2>
                <div className='flex flex-col space-y-2'>
                  <div>
                    <label className='font-semibold'>Public Key:</label>
                    <div className='border border-gray-400 px-3 py-2 rounded-lg break-words'>
                      {publicKey}
                    </div>
                  </div>
                  <div>
                    <label className='font-semibold'>Private Key:</label>
                    <div className='border border-gray-400 px-3 py-2 rounded-lg break-words'>
                      {privateKey}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(privateKey)
                      alert('Copied to clipboard!')
                    }}
                    className='bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition-colors'
                  >
                    Copy Private Keys
                  </button>
                </div>
                <div className='flex flex-col'>
                  <label className='mb-2 font-semibold'>Challenge</label>
                  <input
                    type='text'
                    value={challenge}
                    onChange={(e) => setChallenge(e.target.value)}
                    className='border border-gray-400 px-3 py-2 rounded-lg text-black'
                    disabled
                  />
                </div>
                <div className='flex flex-col'>
                  <button
                    onClick={handleEncryptChallenge}
                    className='bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition-colors'
                    disabled={loading}
                  >
                    {loading ? 'Singing Challenge...' : 'Sign Challenge'}
                  </button>
                </div>
              </div>
            </>
          )}
          {currentStep === 3 && (
            <>
              {encryptedChallenge && (
                <div className='mt-4'>
                  <h2 className='text-xl font-semibold mb-2'>
                    Successfully Signed Challenge!!
                  </h2>
                  <button
                    onClick={handleLogin}
                    className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600'
                  >
                    Login
                  </button>
                </div>
              )}
            </>
          )}
          {currentStep === 4 && (
            <>
              {success && (
                <div className='mt-4'>
                  <h2 className='text-xl font-semibold mb-2'>
                    Successfully Logged In!!
                  </h2>
                  <p>
                    In cryptography, a zero-knowledge proof or zero-knowledge
                    protocol is a method by which one party (the prover) can
                    prove to another party (the verifier) that a given statement
                    is true while the prover avoids conveying any additional
                    information apart from the fact that the statement is indeed
                    true. The essence of zero-knowledge proofs is that it is
                    trivial to prove that one possesses knowledge of certain
                    information by simply revealing it; the challenge is to
                    prove such possession without revealing the information
                    itself or any additional information.
                    <br></br>
                    <br></br>
                    Here, we are using the elliptic curve cryptography to
                    generate the public and private key pair. The public key is
                    used to encrypt the challenge and the private key is used to
                    decrypt the challenge. The challenge is a random string
                    generated by the server. The server will verify the
                    challenge by decrypting the encrypted challenge using the
                    public key. If the decrypted challenge is same as the
                    challenge generated by the server, then the user is
                    authenticated.
                  </p>
                </div>
              )}
            </>
          )}
        </form>
      </div>
    </>
  )
}

export default IndexPage
