import Image from 'next/image'

export default function Auth({authenticate}) {
  const phantomAuth = async() => {
    try {
      await authenticate({
        type: 'sol',
        signingMessage: "EMS Australia is asking you to login with your phantom wallet."
      })
    } catch (error) {
      console.log(error)
    }
  }

  return(
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-gradient-to-r from-green to-purple">
      <h1 className="text-white font-bold text-4xl md:text-6xl lg:text-7xl">myEMS Dashboard</h1>
      <button onClick={phantomAuth} className="flex items-center justify-center bg-blue text-white px-2 py-1 mt-3 md:text-xl lg:text-3xl hover:bg-darkBlue drop-shadow-xl hover:drop-shadow-2xl transition duration-150 ease-out"><Image width={50} height={50} alt="phantom" src="/images/phantom.png" />auth with phantom</button>
    </div>
  )
}