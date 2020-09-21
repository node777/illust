var elements = {
    pages:{
        content: ()=>{
            return `
            <div>
                <div class="mobile">
                    <img src="images/box.gif"></img>
                </div>
                <div class="button" onmousedown="account()">
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
            await connectAccount();
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
            let r;
            try{
                let b=await provider.getBalance(window.ethereum.selectedAddress);
                r= `
                    <div class="pad">
                        <h1>ACCOUNT</h1>
                        Wallet Address: <br>${window.ethereum.selectedAddress}<br><br>
                        Balance: <br>${ethers.utils.formatEther(b)}<br><br>
                        Wallet Name: <br>None Claimed<br><br>
                        Network: <br>${n}<br><br>
                        Provider: <br>${provider.connection.url}<br><br>
                        ${elements.homeButton}
                    </div>
                `
            }catch{
                r= `No account found`
            }
            return r;
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
        <div id="ac" onclick="account()">
            <img src="assets/icons/account.svg" />
        </div>
        <div class="br"></div>
    `,
    sidebar:`
        <div>Home</div>
        <div>Account</div>
        <div>Explore</div>
        <div>Upload</div>

        <div class="br"></div>

        <div>Contact</div>
        <div>About</div>
    `,
    footer:`
    ©copyleft 2020
    `,
    loading: ()=>{
        return `
            <div id="loader">
            <img src="images/loader2.gif"></img>
            </div>
        `
    },
    homeButton:`
        <div class="button" onmousedown="location.hash=''">
            HOME
        </div>
    `
}