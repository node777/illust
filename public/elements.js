var elements = {
    pages:{
        content: ()=>{
            return `
                <div>
                    <div class="mobile">
                        <img src="images/box.gif"></img>
                    </div>
                    <div class="button" onmousedown="location.hash='account'">
                        CONNECT
                    </div>
                    <a href="explore.html">
                        <div class="button" onmousedown="explore()">
                            EXPLORE
                        </div>
                    </a>
                    <input type="file" id="upload">
                    <div class="button" onmousedown="upload()">
                        UPLOAD
                    </div>
                    <div>
                    </div>
                </div>
            `
        },
        account:async()=>{
            if(provider){
                return elements.account();
            }else{
                torus = new Torus();
                await torus.init();
                if(torus.provider.selectedAddress!=null){ 
                    provider = await new ethers.providers.Web3Provider(torus.provider);
                    provider.provider.selectedAddress=await torus.provider.selectedAddress;
                    return elements.account();
                }else{
                    return elements.connect();

                }
            }
        },
        lots:()=>{
            return `
                <div id="lotBox">
                    <div class="box">
                        <h1>Lot 1</h1><br>
                        <model-viewer ar ios-src="assets/Astronaut.usdz" src="assets/Astronaut.glb" auto-rotate camera-controls alt="Chair" background-color="#455A64"></model-viewer>

                        Minted by: POLY<br><b><br>
                        Price: 4.102 ETH<br><br>
                        Time Left: <div id="counter">1 hour 2 minutes 11 seconds</div></b><br><br>
                        Vivamus felis lectus, efficitur vitae porttitor tempor, sodales id tortor. Aliquam tempus eleifend ex eget condimentum. 
                        <div class="button" onclick="location.hash='lot?1'">View Lot</div>
                    </div>
                    <div class="box">
                        <h1>Lot 2</h1><br>
                        <model-viewer ar ios-src="assets/Astronaut.usdz" src="assets/Astronaut.glb" auto-rotate camera-controls alt="Chair" background-color="#455A64"></model-viewer>
                        Vivamus felis lectus, efficitur vitae porttitor tempor, sodales id tortor. Aliquam tempus eleifend ex eget condimentum. Donec ac dapibus augue. Donec ac suscipit tellus. Nam viverra sit amet tellus eu blandit. Proin sed sem quis arcu faucibus sodales ac condimentum lectus. Quisque lacinia vel turpis in feugiat. Maecenas hendrerit vulputate tempus. Nulla vel nulla varius, ultricies ligula quis, aliquam ligula. Curabitur scelerisque feugiat ligula, tristique dignissim risus efficitur non. Morbi vitae mi et nibh rutrum ultrices a a velit. Aliquam erat volutpat. Nulla in nulla vulputate, tincidunt risus quis, accumsan ipsum.
                        <div class="button" onclick="location.hash='lot?2'">View Lot</div>
                    </div>
                    <div class="box">
                        <h1>Lot 3</h1><br>
                        <model-viewer ar ios-src="assets/Astronaut.usdz" src="assets/Astronaut.glb" auto-rotate camera-controls alt="Chair" background-color="#455A64"></model-viewer>
                        Vivamus felis lectus, efficitur vitae porttitor tempor, sodales id tortor. Aliquam tempus eleifend ex eget condimentum. Donec ac dapibus augue. Donec ac suscipit tellus. Nam viverra sit amet tellus eu blandit. Proin sed sem quis arcu faucibus sodales ac condimentum lectus. Quisque lacinia vel turpis in feugiat. Maecenas hendrerit vulputate tempus. Nulla vel nulla varius, ultricies ligula quis, aliquam ligula. Curabitur scelerisque feugiat ligula, tristique dignissim risus efficitur non. Morbi vitae mi et nibh rutrum ultrices a a velit. Aliquam erat volutpat. Nulla in nulla vulputate, tincidunt risus quis, accumsan ipsum.
                        <div class="button" onclick="location.hash='lot?3'">View Lot</div>
                    </div>
                </div>
            `
        },
        lot:(n)=>{
            return `
                <div id="lotBox">
                    <h1>Lot ${n[1]}</h1>
                    <br>
                    <model-viewer ar ios-src="assets/Astronaut.usdz" src="assets/Astronaut.glb" auto-rotate camera-controls alt="Chair" background-color="#455A64"></model-viewer>
                    Minted by: POLY<br><b><br>
                    Price: 4.102 ETH<br><br>
                    Time Left: <div id="counter">1 hour 2 minutes 11 seconds</div></b><br><br>
                    Vivamus felis lectus, efficitur vitae porttitor tempor, sodales id tortor. Aliquam tempus eleifend ex eget condimentum. Donec ac dapibus augue. Donec ac suscipit tellus. Nam viverra sit amet tellus eu blandit. Proin sed sem quis arcu faucibus sodales ac condimentum lectus. Quisque lacinia vel turpis in feugiat. Maecenas hendrerit vulputate tempus. Nulla vel nulla varius, ultricies ligula quis, aliquam ligula. Curabitur scelerisque feugiat ligula, tristique dignissim risus efficitur non. Morbi vitae mi et nibh rutrum ultrices a a velit. Aliquam erat volutpat. Nulla in nulla vulputate, tincidunt risus quis, accumsan ipsum.
                    <div class="button" onclick="alert('This lot is not currently availible for purchase')">Place Bid</div>
                </div>
                
                `
        },
        collections:()=>{
            return `    
                <div id="collectionBox">
                    <h1>Collections</h1>
                    <div class="box">
                        <h1>Collection 1</h1><br>
                        <model-viewer ar ios-src="assets/Astronaut.usdz" src="assets/Astronaut.glb" auto-rotate camera-controls alt="Chair" background-color="#455A64"></model-viewer>

                        Vivamus felis lectus, efficitur vitae porttitor tempor, sodales id tortor. Aliquam tempus eleifend ex eget condimentum. Donec ac dapibus augue. Donec ac suscipit tellus. Nam viverra sit amet tellus eu blandit. Proin sed sem quis arcu faucibus sodales ac condimentum lectus. Quisque lacinia vel turpis in feugiat. Maecenas hendrerit vulputate tempus. Nulla vel nulla varius, ultricies ligula quis, aliquam ligula. Curabitur scelerisque feugiat ligula, tristique dignissim risus efficitur non. Morbi vitae mi et nibh rutrum ultrices a a velit. Aliquam erat volutpat. Nulla in nulla vulputate, tincidunt risus quis, accumsan ipsum.
                        <div class="button" onclick="location.hash='collection?1'">View Collection</div>
                    </div>
                    <div class="box">
                        <h1>Collection 2</h1><br>
                        <model-viewer ar ios-src="assets/Astronaut.usdz" src="assets/Astronaut.glb" auto-rotate camera-controls alt="Chair" background-color="#455A64"></model-viewer>
                        Vivamus felis lectus, efficitur vitae porttitor tempor, sodales id tortor. Aliquam tempus eleifend ex eget condimentum. Donec ac dapibus augue. Donec ac suscipit tellus. Nam viverra sit amet tellus eu blandit. Proin sed sem quis arcu faucibus sodales ac condimentum lectus. Quisque lacinia vel turpis in feugiat. Maecenas hendrerit vulputate tempus. Nulla vel nulla varius, ultricies ligula quis, aliquam ligula. Curabitur scelerisque feugiat ligula, tristique dignissim risus efficitur non. Morbi vitae mi et nibh rutrum ultrices a a velit. Aliquam erat volutpat. Nulla in nulla vulputate, tincidunt risus quis, accumsan ipsum.
                        <div class="button" onclick="location.hash='collection?2'">View Collection</div>
                    </div>
                    <div class="box">
                        <h1>Collection 3</h1><br>
                        <model-viewer ar ios-src="assets/Astronaut.usdz" src="assets/Astronaut.glb" auto-rotate camera-controls alt="Chair" background-color="#455A64"></model-viewer>
                        Vivamus felis lectus, efficitur vitae porttitor tempor, sodales id tortor. Aliquam tempus eleifend ex eget condimentum. Donec ac dapibus augue. Donec ac suscipit tellus. Nam viverra sit amet tellus eu blandit. Proin sed sem quis arcu faucibus sodales ac condimentum lectus. Quisque lacinia vel turpis in feugiat. Maecenas hendrerit vulputate tempus. Nulla vel nulla varius, ultricies ligula quis, aliquam ligula. Curabitur scelerisque feugiat ligula, tristique dignissim risus efficitur non. Morbi vitae mi et nibh rutrum ultrices a a velit. Aliquam erat volutpat. Nulla in nulla vulputate, tincidunt risus quis, accumsan ipsum.
                        <div class="button" onclick="location.hash='collection?3'">View Collection</div>
                    </div>
                </div>
            `

        },
        collection:(n)=>{
            return `
                <div id="collectionBox">
                    <h1>Collection ${n[1]}</h1>
                    <br>
                    <model-viewer ar ios-src="assets/Astronaut.usdz" src="assets/Astronaut.glb" auto-rotate camera-controls alt="Chair" background-color="#455A64"></model-viewer>
                    Vivamus felis lectus, efficitur vitae porttitor tempor, sodales id tortor. Aliquam tempus eleifend ex eget condimentum. Donec ac dapibus augue. Donec ac suscipit tellus. Nam viverra sit amet tellus eu blandit. Proin sed sem quis arcu faucibus sodales ac condimentum lectus. Quisque lacinia vel turpis in feugiat. Maecenas hendrerit vulputate tempus. Nulla vel nulla varius, ultricies ligula quis, aliquam ligula. Curabitur scelerisque feugiat ligula, tristique dignissim risus efficitur non. Morbi vitae mi et nibh rutrum ultrices a a velit. Aliquam erat volutpat. Nulla in nulla vulputate, tincidunt risus quis, accumsan ipsum.
                </div>
                
                `
        },
        admin:async()=>{
            return `
                <h1>Admin Panel</h1>
                <div class="box">
                    Data Output:<br>
                    <div id="data"></div>
                </div>
                <div class="box">
                    Data Toolset
                    <div class="box">
                        Mesh Hashing
                        <input type="file" id="upload">
                        <div class="button" onclick="hashMesh()">Hash a Mesh</div>
                    </div>
                </div>
                <div class="box">
                    Lot Auction Smart Contract
                    <div class="flex">
                        <div class="box">
                            Create new lot<br>
                            <input id="a" placeholder="asset" />
                            <input id="i" placeholder="initialPrice" />
                            <input id="inc" placeholder="increment" />
                            <div class="button" onclick="invoke('n');">Create Auction</div>
                        </div>
                        <div class="box">
                            Bid on lot
                            <input id="bidAmount" placeholder="bidAmount" />
                            <input id="bidAsset" placeholder="bidAsset" />
                            <div id="bidButton" class="button" onmousedown="invoke('b')">Place Bid</div>
                            <div id="bidButton" class="button" onmousedown="invoke('b')">Place Bid</div>
                        </div>
                    </div>
                    <div class="box">
                        Lot status query
                        <input id="lotID" placeholder="Lot ID" />
                        <div class="button" onclick="invoke()">Get Lot Status</div>
                        <div class="button" onclick="invoke()">Get Lot Status</div>
                    </div>
                    
                </div>
                <div class="box">
                    ERC 720 Smart Contract
                    <div class="flex">
                        <div class="box">
                            Create new asset<br>
                            <input id="assetID" placeholder="assetID" />
                            <input id="assetMintUser" placeholder="User to mint asset ID under" />
                            <div class="button" onclick="invokeERC('a');">Create Asset</div>
                        </div>
                        <div class="box">
                            Check Assets in your account
                            <div id="bidButton" class="button" onmousedown="invokeERC('b')">Check</div>
                        </div>
                    </div>
                    <div class="box">
                        Lot status query
                        <input id="lotID" placeholder="Lot ID" />
                        <div class="button" onclick="invoke()">Get Lot Status</div>
                        <div class="button" onclick="invoke()">Get Lot Status</div>
                    </div>
                    
                </div>

            `
        },
        404:()=>{
            "Page could not be loaded"
        }
    },
    header: `

        <div id="hb" onclick="sidebar()">
            <div></div>
            <div></div>
            <div></div>
        </div>
        <div id="hd" onclick="location.hash=''">ILLUST.SPACE</div>
        <div id="ac" onclick="location.hash='account'">
            <img src="assets/icons/account.svg" />
        </div>
        <div class="br"></div>
    `,
    sidebar:`
        <div onclick="location.hash=''">Home</div>
        <div onclick="location.hash='collections'">Collections</div>
        <div onclick="location.hash='lots'">Lots</div>
        
        <div class="br"></div>

        <div onclick="location.hash='account'">Account</div>
        <div onclick="upload()">Upload</div>

        <div class="br"></div>

        <div><a href="ar/faces.html">Face Tracking</a></div>
        <div>Contact</div>
        <div>About</div>
    `,
    footer:`
    ©copyleft 2020
    `,
    createAccount:()=>{
        return `
            <div class="popup">
                Welcome to Illust Space:<br>
                Please choose a name to get started<br><br>
                <input id="usernamei" placeholder="username"></input>

                <input id="namei" placeholder="name"></input>

                <input id="emaili" placeholder="e-mail"></input>
                <textarea id="bioi" placeholder="bio (optional)"></textarea>
                <div class="button" onclick="account.create()">Create Account</div>
            </class>
        `
    },
    account:async()=>{

        connectAccount();
        let r=`
            <div class="flex">
                <div id="accountContent" style="flex:4;padding:16px;">
                    ${await elements.profileInfo()}
                </div>
                <div id="sidebar2">
                    <img src="assets/icons/account.svg" style="width:90%;padding:0 5%; margin: 0 0 16px;"/>
                    <div onclick="account.info()">Profile Info<br><br></div>
                    <div onclick="account.wallet();">View Wallet<br><br></div>
                    <div onclick="document.getElementById('accountContent').innerHTML=elements.collection()">Collection<br><br></div>
                    <div onclick="document.getElementById('accountContent').innerHTML=elements.auctions()">Auctions<br><br></div>
                    <div onclick="account.edit()">Edit Profile<br><br></div>
                    <div onclick="account.logout()">Sign Out<br><br></div>

                </div>
            </div>
        `;
        if(!account.username){
            r+=elements.createAccount();
        }
        return r;
    },
    profileInfo:async()=>{
        try{
            let b=0;
            let n;
            try{
                switch(window.ethereum.chainId){
                    case "0x1":
                        n="Main Ethereum Network"
                        break
                    case "0x3":
                        n="Ropsten Ethereum Test Network"
                        break
                    case "0x4":
                        n="Rinkeby Ethereum Test Network"
                        break
                    case "0x5":
                        n="Goerli Ethereum Network"
                        break
                    case "0x42":
                        n="Kovan Ethereum Network"
                        break
                    default:
                        n="No provider connected"
                }
                b=await web3.eth.getBalance(provider.provider.selectedAddress);
            }catch(e){
                console.log(e);
            }
            return `
                <h1>ACCOUNT INFO</h1>
                Username: <b>@${account.username||""}</b><br><br>
                Name: ${account.name||""}<br><br>
                Email: ${account.email||""}<br><br>
                <b>Bio:</b><br><br>${account.bio||"Welcome to my page, this is my bio"}

            `;
        }catch(e){
            console.log(e);
            return `Account info could not be located`;

        }
    },
    walletInfo:async()=>{
        try{
            let b=0;
            let n;
            switch(window.ethereum.chainId){
                case "0x1":
                    n="Main Ethereum Network"
                    break
                case "0x3":
                    n="Ropsten Ethereum Test Network"
                    break
                case "0x4":
                    n="Rinkeby Ethereum Test Network"
                    break
                case "0x5":
                    n="Goerli Ethereum Network"
                    break
                case "0x42":
                    n="Kovan Ethereum Network"
                    break
                default:
                    n="No provider connected"
            }
            try{
                b=await web3.eth.getBalance(provider.provider.selectedAddress);
            }catch(e){
                console.log(e);
            }
            return `
                <h1>ACCOUNT INFO</h1>
                Wallet Address: <br>${provider.provider.selectedAddress}<br><br>
                Balance: <br>${ethers.utils.formatEther(b)}<br><br>
                Wallet Name: <br>None Claimed<br><br>
                Network: <br>${n}<br><br>
                Provider: <br>${provider.connection.url}<br><br>
                ${elements.homeButton}
            `;
        }catch(e){
            console.log(e);
            return `Account info could not be located`;

        }
    },
    loading: (m)=>{
        let x=m?m:'';
        return `
            <div id="loader">
            <img src="images/loader${x}.gif"></img>
            </div>
        `
    },
    collection:()=>{
        return `
            You have no collections added:<br>
            <a style="color:var(--color4);">Create new collection</a>
        `
    },
    auction:()=>{
        return `
            You currently have no lots up for auction:<br>
            <div style="color:var(--color4);">Create new lot</div>
        `
    },
    connect:()=>{
        r=`
            <h1>Connect</h1>   
            <div class="box" id="connectAccount">
                <b>Connect with email:</b><br><br>
                <input placeholder="E-mail" id="email"></input>
                <div class="button">Connect Email</div>
                <div class="flex">
                    <div class="box" onclick="connectTorus();clearInterval(torInt);"><b id="torusBox">Connect with Torus</b></div>
                    <div class="box" onclick="connectAccount();clearInterval(torInt);"><b>Connect with Web3 Provider</b><br><br>
        `
        if(window.ethereum){
            r+= "Web3 Browser Detected";
        }else{
            r+= "No Web3 Browser Detected"
        }
        r+=`
                    </div>
                    <div class="box";clearInterval(torInt);><b>Connect with key</b></div>
                </div>
            </div>`
        torInt = setInterval(changeAuth, 2000);
        return r;
    },
    homeButton:`
        <div class="button" onmousedown="location.hash=''">
            HOME
        </div>
    `
}