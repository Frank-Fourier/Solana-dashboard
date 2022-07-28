import { useEffect, useState } from "react"
import { useMoralis, useMoralisSolanaApi, useMoralisSolanaCall } from "react-moralis"
import styled from "styled-components"

export default function Dashboard({logout, user}) {

    let walletAddress = user.get('solAddress')
    let username = user.get('username')
    let email = user.get('email')

    let SolanaAPI = useMoralisSolanaApi()

    let [solanaBalance, setSolanaBalance] = useState('')
    let [nftsBalance, setNftsBalance] = useState([{}])
    let newnftsBalance = []
    let animals = ['79BGVH2ksakXzWU88HcFzuaBFjNTsxHj8QqXk6b8QJDj','6QfvtUgaJst3keHgCmf8c6afLqo5trUrGs5pB4i1Bv91','7zcKVC2GYfkLdKq9rmWTnA8JwL5pg4QnKh761kGwzQeh']
    const [inputValue, setInputValue] = useState('')
    const [inputEmail, setInputEmail] = useState('')
    const {setUserData} = useMoralis()
    const [nftMint, setNftMint] = useState();
    const [name, setName] = useState();
    const [image, setImage] = useState();
    const SolanaApi = useMoralisSolanaApi();

    let [isLoading, setIsLoading] = useState(true)

    function show_image(src, width, height) {
        var img = document.createElement("img");
        img.src = src;
        img.width = width;
        img.height = height;
    
        // This next line will just add it to the <body> tag
        document.body.appendChild(img);
    }

    const Button = styled.button`
        background-color: black;
        color: white;
        font-size: 18px;
        padding: 10px 30px;
        border-radius: 5px;
        margin: 5px 0px;
        cursor: pointer;
    `;

    const Buttons = styled.button`
        background-color: white;
        color: black;
        font-size: 18px;
        padding: 10px 30px;
        border-radius: 5px;
        margin: 5px 0px;
        cursor: pointer;
    `;

    async function NFTsearch(address) {
        const options = {
          network: "mainnet",
          address: address,
        };
    
        const nftResult = await SolanaApi.nft.getNFTMetadata(options);
        let uri = nftResult.metaplex.metadataUri;
        
        setName(nftResult.name);
        setNftMint(address);    
        try {
          await fetch(uri)
            .then((response) => response.json())
            .then((data) => {
              setImage(data.image);
            });
        } catch (error) {
          console.log(error);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                let result = await SolanaAPI.account.balance({
                    network: 'mainnet',
                    address: walletAddress
                })
                setSolanaBalance(result.solana)
            } catch (error) {
                console.log(error)
            }

            try {
                let result = await SolanaAPI.account.getNFTs({
                    network: 'mainnet',
                    address: walletAddress
                }) 
                setNftsBalance(result)
            } catch (error) {
                console.log(error)
            }

            setIsLoading(false)
        }

        fetchData()

    }, [])

    return(
        <div className="w-screen h-screen flex flex-col items-center justify-center py-10 px-4 bg-black overflow-auto">
            <div className="bg-black rounded-2xl drop-shadow-md px-2 py-2 md:text-lg">
            <p className="text-black">{walletAddress}</p>
            </div>
            <div className="bg-white rounded-2xl drop-shadow-md px-2 py-2 md:text-lg">
            <p className="text-black">{walletAddress}</p>
            </div>
            <Buttons onClick={logout} className="text-white self-end">logout</Buttons>
            <div className="w-full h-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                <div className="bg-white rounded-2xl drop-shadow-md px-2 py-2 md:px-4 md:py-4 md:text-lg">
                    <p className="text-black text-2xl md:text-4xl">Account</p>
                    <form onSubmit={e => {
                e.preventDefault()
                    if(inputValue.trim() !== '') {
                        setUserData({
                           username: inputValue
                        })
                    }
                }}>
                <input className="px-4 mt-4 md:mt-10" placeholder="ex. FrankFourier" border="px-1" value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
                <Button type="submit">Edit username</Button>
                </form>
                <form onSubmit={f => {
                f.preventDefault()
                    if(inputEmail.trim() !== '') {
                        setUserData({
                            email: inputEmail
                        })
                    }
                }}>
                <input className="px-4 mt-4" placeholder="ex. Frank@mail.com" border="px-1" value={inputEmail} type="email" id="email" required onChange={(e) => setInputEmail(e.target.value)}/>
                <Button type="submit">Edit email</Button>
                </form>
                <p className="px-4 mt-4 md:mt-10 text-md md:text-lg">Username: {username}</p> 
                <p className="px-4 mt-4 text-md md:text-lg">Email: {email}</p> 
                </div>
                <div className="bg-pink rounded-2xl drop-shadow-md px-2 py-2 md:px-4 md:py-4 md:text-lg">
                    <p className="text-black text-2xl md:text-4xl">Solana balance</p>
                    {!isLoading && <p className="mt-4 md:mt-10 text-3xl md:text-6xl">{solanaBalance.slice(0, 4)} <span>SOL</span></p>}
                </div>
                <div className="bg-blue md:col-span-2 rounded-2xl drop-shadow-md px-2 py-2 md:px-4 md:py-4 md:text-lg">
                    <p className="text-white text-2xl md:text-4xl">Your EMS NFTs</p>
                    <ul className="list-disc px-4 mt-4 md:mt-10 text-md md:text-lg">
                        {
                           nftsBalance.forEach(el => {
                            if (animals.includes(el.mint)) {  
                              newnftsBalance.push(el.mint)
                            }
                          })}
                        <div className="text-white px-4 mt-4 text-xl md:mt-10 md:text-xl">Tot: {!isLoading ? newnftsBalance.length : ''}</div>
                        <div className="text-white px-4 mt-4 text-xl md:mt-10 md:text-xl">List:</div>
                        {newnftsBalance.length > 0 && !isLoading && newnftsBalance.map((nft, i) => (
                            <button onClick={() => NFTsearch(nft)} className="text-white text-ellipsis px-4 text-xl overflow-hidden" key={i}>{nft}</button>
                        ))}
                         {name && <div className="text-white px-4 mt-4">{name}</div>}
                {image &&
                <div className="px-4 mt-4">
      <img
        src={image}
        alt="nft"
      />
    </div>}
    {image && <a href={"https://solscan.io/token/" + nftMint} target="_blank" rel="noreferrer">
        <Buttons> View on Solscan </Buttons>
      </a>}
                    </ul>
                </div>
            </div>
        </div>
    )
}