var formData;
var files;
let provider;
var signer
let currentAuth=0;
let torInt;
var torus;

var account={
    info:{
    },
    sign:async(msg)=>{
      //if web3
      console.trace("Signing message")
      if(localStorage.provider=="web3"){
        try{
        
            signer=provider.getSigner();
          let signature = await signer.signMessage(msg);
          console.log(signature);
          return signature;
        }
        catch(e){
          console.log(e);
          //alert(`Could not sign message \n Got Error ${e}`)
          location.reload();
        }
      }
      else if(localStorage.provider=="torus"){
        try{
          //signer=new CustomSigner(provider);
          // let m=Uint8Array.from(msg);
          // console.log(m, m.length);
          // var a = await web3.eth.getAccounts();
          // let signature = await web3.eth.sign(msg, a);
          // console.log(signature);
          let signature = await web3.eth.personal.sign(msg, web3.currentProvider.selectedAddress);
          return signature;
        }
        catch(e){
          console.log(e);
          //alert(`Could not sign message \n Got Error ${e}`)
          location.reload();
        }
      }
      else{
        return "Invalid Sig"
      }
    },
    login:async()=>{
        console.trace("logging in");
        // if(account.info!={}){
        //     console.log("already logged in")
        // }
        
        try{
            await account.load();
        }catch(e){
            console.log(e);
            account.logout();
        }
        //if user has signed msg
        if(localStorage.userInfo){
            try{
                let d=JSON.parse(localStorage.userInfo);
                account.info={
                    username:d.username,
                    firstname:d.firstname,
                    lastname:d.lastname,
                    pronoun:d.pronoun,
                    email:d.email,
                    collection:d.collection,
                    bio:d.bio,
                    bids:{}
                } 
                //console.log(account.info)
                //await changePage();
                console.log('account info')
                account.information();
                if(account.loggedIn!=1){
                    changePage();
                }
                account.loggedIn=1;
                //console.log(document.getElementById("content").innerHTML)
            }catch(e){
                console.trace(e);
                alert(e);
                account.logout();
            }
        //if user has not signed msg yet
        }else{
            var request = new XMLHttpRequest(); 
            request.onreadystatechange = async function() {
                if (request.readyState === 4) {
                    let m=request.response;
                    console.log(m);

                    let sig=await account.sign(`illust login ${m}`);
                    
                    var loginRequest = new XMLHttpRequest(); 
                    loginRequest.onreadystatechange = async function(){
                        if(loginRequest.readyState === 4){
                            console.log(loginRequest.response);
                            try{
                                console.log(loginRequest.response);
                                if(loginRequest.response=="no account"){
                                    console.log(request.response)
                                    document.getElementById("content").innerHTML=elements.createAccount();

                                }else if(loginRequest.response!=""&&loginRequest.response!="Could not verify signature"&&loginRequest.response!=false&&loginRequest.response!="false"){
                                    try{
                                        console.log(loginRequest.response)
                                        localStorage.userInfo=loginRequest.response;
                                        account.login();
                                    }catch(e){
                                        //alert(request.response)
                                        changePage()
                                    }
                                }else{
                                    //alert(loginRequest.response)
                                    if(loginRequest.response==false||loginRequest.response=="false"){
                                        changePage();
                                    }
                                }
                            }catch(e){
                                console.log(loginRequest.response, e)
                                
                                document.getElementById("content").innerHTML=elements.createAccount();  
                            }
                        }
                    }
                    loginRequest.open("GET", `https://us-central1-illust.cloudfunctions.net/users/${provider.provider.selectedAddress}/${sig}`);
                    if(sig!=null&&sig!=undefined&&sig!=""&&sig!="null"){
                        loginRequest.send();
                    }
                    else{
                        changePage()
                    }
                }
            }
            request.open("GET", `https://us-central1-illust.cloudfunctions.net/users/${provider.provider.selectedAddress}`);
            request.send();
            
        }
        
    },
    load:async ()=>{
        if(provider){}else{
            if(localStorage.provider=="web3"){
                document.getElementById("content").innerHTML="Please login to web3 provider:<br>"+elements.loading();
                await window.ethereum.enable();
                
                provider = new ethers.providers.Web3Provider(web3.currentProvider);            
                console.log(provider);
                document.getElementById("content").innerHTML=elements.loading();
            }else if(localStorage.provider=="torus"){
                
                document.getElementById("content").innerHTML=`You will need to sign a message to login. Look for popup. <br>${elements.loading()}<div class="button" onclick="account.logout()">Cancel</div>`;
                console.log();
                torus = new Torus();
                await torus.init();
                await torus.login();
                provider = new ethers.providers.Web3Provider(torus.provider);
                web3 = new Web3(torus.provider);
                provider.provider.selectedAddress=torus.provider.selectedAddress;
                signer = await provider.getSigner();
                
                //await account.login();

            }else if(location.hash=="#account"||location.hash=="account"){
                document.getElementById("content").innerHTML=elements.connect();   
            }
        }
    },
    getBal:async()=>{
        document.getElementById('balBox').innerHTML=ethers.utils.formatEther(await provider.getBalance(provider.provider.selectedAddress));
    },
    getData:()=>{
        //ref databse
        console.log('getting data')
        try{
            let a = provider.provider.selectedAddress;
            console.log(a + ' a');
            var userRef = firebase.database().ref('users/' + a);
            userRef.once('value', async function(snapshot){
                let d=snapshot.val();
                console.log(d + ' d');
                console.log(snapshot.val());
                if(d!==null){
                    //location.hash="account";
                    //await changePage();
                    let bb=Object(d.bids);
                    account.info={
                        username:d.username,
                        firstname:d.firstname,
                        lastname:d.lastname,
                        pronoun:d.pronoun,
                        email:d.email,
                        collection:d.collection,
                        bio:d.bio,
                        bids:{}
                    }
                    console.log(d.bids);
                    for(b in d.bids){
                        account.info.bids[b]=d.bids[b];
                    }
                    console.log(account.info);
                    if(document.getElementById("account")){
                        console.log(provider.provider.selectedAddress);
                        document.getElementById("content").innerHTML=await elements.account();
                    }
                    else if(document.getElementById("lot")){
                        //set user bid
                        try{
                            console.log(account.info);
                            if(account.info.bids[assets.selected]!=undefined){
                                console.log(account.info.bids[a])
                                document.getElementById("userBid").innerHTML=`Your current bid: ${account.info.bids[assets.selected]}<br><br>`
                            }
                        }catch(e){console.log(e)}
                    }
                    console.log(account.info);
                }else if(document.getElementById("account")){
                    document.getElementById("content").innerHTML=elements.createAccount();       
                }
            });
        }catch(e)
        {console.log(e)}
        
    },
    logout:async()=>{
        provider=undefined;
        localStorage.clear();
        account.info=undefined;
        try{
            torus?await torus.logout():()=>{};
        }catch(e){
            console.log(e);
        }
        location.reload();

    },
    information:async()=>{
        if(document.getElementById('js-profileContents')){
            let m=await elements.account();
            document.getElementById('js-profileContents').innerHTML=m;
        }
    },
    wallet:async()=>{
        let m=await elements.walletInfo();
        console.log(m);
        document.getElementById('js-profileContents').innerHTML=m;
    },
    edit:async()=>{
        let m=await elements.editProfile();
        document.getElementById('js-profileInfo').innerHTML=m;
    },
    selectProfileHeader:(r)=>{
        try{
            let headerItemArray = Array.from(document.getElementsByClassName('js-profileHeaderItem'));
            headerItemArray.forEach(element => {
                element.classList.remove('profileAssets__headerItem--current')
            });
            r.classList.add("profileAssets__headerItem--current")
            // document.getElementById('pr').style="";
            // document.getElementById('vw').style="";
            // document.getElementById('cl').style="";
            // document.getElementById('ep').style="";
            // document.getElementById('so').style="";
            // document.getElementById(`${r}`).style="color:var(--color4);";
        }catch(e){
            console.log(e);
        }
    },
    create:async (a)=>{
        if(a==1|| 
            (document.getElementById("verifyTOS") && 
            document.getElementById("verifyTOS").checked==true &&
            document.getElementById("usernamei").value &&
            document.getElementById("firstname").value &&
            document.getElementById("lastname").value &&
            document.getElementById("emaili").value)){

                //            !document.getElementById("usernamei").value ||
           // !document.getElementById("firstname").value ||
            //!document.getElementById("emaili").value
            account.info.username=document.getElementById("usernamei").value;
            account.info.firstname=document.getElementById("firstname").value;
            account.info.lastname=document.getElementById("lastname").value;
            account.info.email=document.getElementById("emaili").value;
            account.info.bio=document.getElementById("bioi").value;

            localStorage.userInfo=JSON.stringify(account.info);

            let sig=await account.sign("illust account edit");
            changePage();
            var request = new XMLHttpRequest(); 
            
            request.onreadystatechange = function() {
                if (request.readyState === 4) {
                    let m=request.response;
                    console.log(m);
                    var loginRequest = new XMLHttpRequest(); 
                    loginRequest.onreadystatechange = async function(){
                        try{
                            console.log("account info updated successfully")
                        }catch(e){
                            console.log("Account info not updated successfully", e, loginRequest.response)
                        }
                    }
                    loginRequest.open("POST", `https://us-central1-illust.cloudfunctions.net/users/${provider.provider.selectedAddress}/${sig}`);
                    loginRequest.send(JSON.stringify(account.info));
                }
            }
            request.open("GET", `https://us-central1-illust.cloudfunctions.net/users/${provider.provider.selectedAddress}`);
            request.send();
            
        }else{
            console.log(document.getElementById("verifyTOS").value);
            alert("Please complete the required fields*");
        }
    }, 
    async connectProvider(){
        if(!provider){
            try{
                provider = new ethers.providers.Web3Provider(web3.currentProvider)
            }catch(e){
                provider=new ethers.providers.EtherscanProvider();
            }
        }
        if(!signer){
            
            signer = await provider.getSigner();
        }
    }
}
var assets={
    loadContractData(){
    },
    async invokeERC(w,p){
        var abi = [
            {
                "inputs": [],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "approved",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "Approval",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "operator",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "bool",
                        "name": "approved",
                        "type": "bool"
                    }
                ],
                "name": "ApprovalForAll",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "Transfer",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "address payable",
                        "name": "user",
                        "type": "address"
                    }
                ],
                "name": "addToWhitelist",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "approve",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    }
                ],
                "name": "balanceOf",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "baseURI",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "getApproved",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "operator",
                        "type": "address"
                    }
                ],
                "name": "isApprovedForAll",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "tokenID",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address payable",
                        "name": "user",
                        "type": "address"
                    },
                    {
                        "internalType": "address payable",
                        "name": "royaltyReciever1",
                        "type": "address"
                    },
                    {
                        "internalType": "address payable",
                        "name": "royaltyReciever2",
                        "type": "address"
                    },
                    {
                        "internalType": "uint8",
                        "name": "split",
                        "type": "uint8"
                    }
                ],
                "name": "mintAsset",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "name",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "ownerOf",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "piecelist",
                "outputs": [
                    {
                        "internalType": "address payable",
                        "name": "minter",
                        "type": "address"
                    },
                    {
                        "internalType": "address payable",
                        "name": "royaltyReciever1",
                        "type": "address"
                    },
                    {
                        "internalType": "address payable",
                        "name": "royaltyReciever2",
                        "type": "address"
                    },
                    {
                        "internalType": "uint8",
                        "name": "split",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint256",
                        "name": "price",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address payable",
                        "name": "user",
                        "type": "address"
                    }
                ],
                "name": "removeFromWhitelist",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "safeTransferFrom",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes",
                        "name": "_data",
                        "type": "bytes"
                    }
                ],
                "name": "safeTransferFrom",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "operator",
                        "type": "address"
                    },
                    {
                        "internalType": "bool",
                        "name": "approved",
                        "type": "bool"
                    }
                ],
                "name": "setApprovalForAll",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "price",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "setTokenPrice",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "_tokenURI",
                        "type": "string"
                    }
                ],
                "name": "setTokenURI",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "bytes4",
                        "name": "interfaceId",
                        "type": "bytes4"
                    }
                ],
                "name": "supportsInterface",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "symbol",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "index",
                        "type": "uint256"
                    }
                ],
                "name": "tokenByIndex",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "index",
                        "type": "uint256"
                    }
                ],
                "name": "tokenOfOwnerByIndex",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "tokenURI",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "totalSupply",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "transferFrom",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            }
        ];
        //ROPSTEN ADDRESS
        var address="0xa81ff27ed54f95a637c5a8c48ae0d993139f4ed2";
        //MAINNET ADDRESS
        //var address = '0x40bd6c4d83dcf55c4115226a7d55543acb8a73a6';
        var contract = new ethers.Contract(address, abi, provider);
        //mintAsset
        if(w=="a"){
            let provider = new ethers.providers.Web3Provider(web3.currentProvider);
            let signer = await provider.getSigner();
            contract=await contract.connect(signer);
            let assetId=new ethers.BigNumber.from(document.getElementById("assetMintID").value);
            console.log(assetId, assetId.toString(), assetId.to);
            var sendPromise = contract.mintAsset(assetId.toString(), ethers.utils.getAddress(document.getElementById("assetMintUser").value), ethers.utils.getAddress(document.getElementById("recipient1").value), ethers.utils.getAddress(document.getElementById("recipient2").value), Number(document.getElementById("split").value));
            console.log(sendPromise)
            sendPromise.then(function(transaction) {
                document.getElementById("data").innerHTML=(transaction);
            });
        }
        //setApproval
        if(w=="r"){
            //connectTorus();
            let signer = provider.getSigner();
            contract=await contract.connect(signer);
            //let assetId=new ethers.BigNumber.from(document.getElementById("assetMintID").value);
            //console.log(assetId, assetId.toString(), assetId.to);
            //var sendPromise = contract.setApprovalForAll("0x7cca737DC640eC07943aA32736E834eCa9E4C4eC", 1);
            var sendPromise = contract.setApprovalForAll("0xA60A90D0FCFc3D1446355BF505B73756EE119B6B", 1);
            console.log(sendPromise)
            sendPromise.then(function(transaction) {
                document.getElementById("data").innerHTML=(transaction);
            });
        }
        else if(w=="checkApproval"){
            let signer = provider.getSigner();
            contract=await contract.connect(signer);
            //console.log(assetId, assetId.toString(), assetId.to);
            //var sendPromise = contract.setApprovalForAll("0x7cca737DC640eC07943aA32736E834eCa9E4C4eC", 1);
            var sendPromise = await contract.isApprovedForAll(provider.provider.selectedAddress, "0xA60A90D0FCFc3D1446355BF505B73756EE119B6B");
            console.log(sendPromise)
            return sendPromise;
        }
        //check balance of address
        else if(w=="b"){
            let provider = new ethers.providers.Web3Provider(web3.currentProvider);
            let signer = provider.getSigner();
            contract=contract.connect(signer);
            var sendPromise = contract.balanceOf(ethers.utils.getAddress("0xDc4c460577951Df59161467C2E4Ea41078c8D184", true));
            console.log(ethers.utils.getAddress("0xDc4c460577951Df59161467C2E4Ea41078c8D184", true));
            sendPromise.then(function(transaction) {
                document.getElementById("data").innerHTML=(transaction);
            });        
        }
        //get asset data
        else if(w=="getOwner"){
            try{
            provider = new ethers.providers.Web3Provider(web3.currentProvider)
            }catch(e){
                provider=new ethers.providers.EtherscanProvider();
            }
            contract=contract.connect(provider);
            var o = await contract.ownerOf(p);
            //console.log(ethers.utils.getAddress("0xDc4c460577951Df59161467C2E4Ea41078c8D184", true));
            return o;
        }
        else if(w=="getData"){
            try{
            provider = new ethers.providers.Web3Provider(web3.currentProvider)
            }catch(e){
                provider=new ethers.providers.EtherscanProvider();
            }
            contract=contract.connect(provider);
            var o = await contract.piecelist(p);
            //console.log(ethers.utils.getAddress("0xDc4c460577951Df59161467C2E4Ea41078c8D184", true));
            return o;
        }
    },
    tokens:{}
}
var market={
    countdown(){
        market.timeLeft=new Date(market.endTime).getTime()-Date.now()
        
        clearInterval(market.timer)
        market.timer=setInterval(()=>{
            if(document.getElementById("countdownBox")){
                market.timeLeft=market.timeLeft-1000
                //let timeRemaining=market.timeLeft
                daysRemaining=Math.floor(market.timeLeft/86400000)
                hoursRemaining=Math.floor(market.timeLeft%86400000/3600000)
                minutesRemaining=Math.floor(market.timeLeft%3600000/60000)
                secondsRemaining=Math.floor(market.timeLeft%60000/1000)
                document.getElementById("countdownBox").innerHTML=`${daysRemaining} Days ${hoursRemaining.toString().padStart(2, '0')}:${minutesRemaining.toString().padStart(2, '0')}:${secondsRemaining.toString().padStart(2, '0')}`
            }else{
                clearInterval(market.timer)
            }
        }, 1000)
        
    },
    async beginAuction(){
        let asset=location.hash.split("?")[1]
        let r={
            message:{
                asset:asset,
                "end_date":document.getElementById("js-end_date").value,
                "start_price":document.getElementById("js-start_price").value
            }
        }
        r.sig = await account.sign(JSON.stringify(r.message))
        
        var request = new XMLHttpRequest(); 
        request.onreadystatechange = function() {
            if (request.readyState === 4) {
                alert(request.response)
                changePage().then(changePage());
            }
        }
        //request.open("POST", `http://localhost:5001/illust/us-central1/market/sell`);
        request.open("POST", `https://us-central1-illust.cloudfunctions.net/market/sell`);
        request.send(JSON.stringify(r));
    },
    async bid(){
        let asset=location.hash.split("?")[1]
        let r={
            message:{
                asset:asset,
                "amount":document.getElementById("js-bidAmount").value,
                "timestamp":Date.now()
            }
        }
        r.sig = await account.sign(JSON.stringify(r.message))
        
        var request = new XMLHttpRequest(); 
        request.onreadystatechange = function() {
            if (request.readyState === 4) {
                alert(request.response)
                changePage().then(changePage())
            }
        }
        //request.open("POST", `https://us-central1-illust.cloudfunctions.net/market/bid`);
        request.open("POST", `https://us-central1-illust.cloudfunctions.net/market/bid`);
        request.send(JSON.stringify(r));
    },
    async invokeCustody(fn, p){
        let abi=[
            {
                "inputs": [
                    {
                        "internalType": "bool",
                        "name": "enable",
                        "type": "bool"
                    }
                ],
                "name": "allowMinting",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "asset",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "price",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address payable",
                        "name": "winner",
                        "type": "address"
                    }
                ],
                "name": "listAsset",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "tokenID",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address payable",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "price",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address payable",
                        "name": "royaltyReceiver1",
                        "type": "address"
                    },
                    {
                        "internalType": "address payable",
                        "name": "royaltyReceiver2",
                        "type": "address"
                    },
                    {
                        "internalType": "uint8",
                        "name": "royaltySplitPercentage",
                        "type": "uint8"
                    }
                ],
                "name": "mint",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "asset",
                        "type": "uint256"
                    }
                ],
                "name": "pay",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address payable",
                        "name": "AinsophContractAddress",
                        "type": "address"
                    }
                ],
                "name": "setAinsophContract",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address payable",
                        "name": "royaltyReceiver1",
                        "type": "address"
                    },
                    {
                        "internalType": "address payable",
                        "name": "royaltyReceiver2",
                        "type": "address"
                    },
                    {
                        "internalType": "uint8",
                        "name": "royaltyPercentage",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint8",
                        "name": "royaltySplitPercentage",
                        "type": "uint8"
                    }
                ],
                "name": "setDefaultRoyalties",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "asset",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "enabled",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "automaticPrice",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "firstSale",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint8",
                        "name": "percentage",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint8",
                        "name": "initialRoyaltyPercentage",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint8",
                        "name": "royaltySplitPercentage",
                        "type": "uint8"
                    },
                    {
                        "internalType": "address payable",
                        "name": "royaltyReceiver1",
                        "type": "address"
                    },
                    {
                        "internalType": "address payable",
                        "name": "royaltyReceiver2",
                        "type": "address"
                    }
                ],
                "name": "setRoyalties",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "price",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "asset",
                        "type": "uint256"
                    }
                ],
                "name": "setTokenPrice",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address payable",
                        "name": "reciever",
                        "type": "address"
                    }
                ],
                "name": "widthdraw",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "assets",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "enabled",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "autoPrice",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "firstSale",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint8",
                        "name": "initialRoyaltyPercentage",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint8",
                        "name": "royaltyPercentage",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint8",
                        "name": "royaltySplitPercentage",
                        "type": "uint8"
                    },
                    {
                        "internalType": "address payable",
                        "name": "royaltyReceiver1",
                        "type": "address"
                    },
                    {
                        "internalType": "address payable",
                        "name": "royaltyReceiver2",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "asset",
                        "type": "uint256"
                    }
                ],
                "name": "getRoyaltyPrice",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "price",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "winnigBids",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "enabled",
                        "type": "bool"
                    },
                    {
                        "internalType": "address payable",
                        "name": "winner",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "price",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "complete",
                        "type": "bool"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ]
        //ROPSTEN CONTRACT
        let address="0xA60A90D0FCFc3D1446355BF505B73756EE119B6B";

        await account.connectProvider();
        var custodyContract = await new ethers.Contract(address, abi, provider);

        custodyContract=await custodyContract.connect(signer);
        //await contract.connect(signer);
        console.log(custodyContract)

        if(fn=="listAsset"){
            let assetID=new ethers.BigNumber.from(p[0]);
            let assetPrice=(p[1]*(1000000000000000000)).toString();
            console.log(p[0], assetPrice, ethers.utils.getAddress(p[2]).toString());
            let r=custodyContract.listAsset(p[0], assetPrice, ethers.utils.getAddress(p[2]).toString());
            r.then((tx)=>{
                console.log(tx);
            });
        }
        if(fn=="assets"){
            let r=await custodyContract.assets(p[0]);
            console.log(r);
        }
        else if(fn=="setContract"){
            let r=await custodyContract.setAinsophContract(p[0]);
            console.log(r);
        }
        else if(fn=="pay"){
            let r=await custodyContract.pay(p[0], {
                value: (p[1]*(1000000000000000000)).toString()
            });
            console.log(r);
        }
        else if(fn=="winningBids"){
            let r=await custodyContract.winnigBids(p[0]);
            return r;
        }

    }
}
var auction={
    "loadDate":()=>{
        var utcSeconds = result[4].toNumber();
        var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
        d.setUTCSeconds(utcSeconds);
        document.getElementById("dateBox").innerHTML=`Close time: ${d}<br><br />`;
    },
    "listAsset":()=>{
        document.getElementById("varBox").innerHTML+=`End date <input id="asset_end" value='${document.getElementById("end_date_input").value}'></input> Initial Price <input id="asset_price" value='${document.getElementById("price_input").value}'></input>`
    },
    "beginAuction":()=>{
        assetData["end_date"]=document.getElementById("auction_close").value;
        document.getElementById("varBox").innerHTML+=`end_date:<input id="asset_end_date" value='${document.getElementById("auction_close").value}'></input>`
        assetData["starting_bid"]=document.getElementById("auction_starting_bid").value;
        document.getElementById("varBox").innerHTML+=`starting_bid:<input id="asset_starting_bid" value='${document.getElementById("auction_starting_bid").value}'></input>`
    }
}


// firebase.initializeApp({
//     apiKey: "AIzaSyCfNihdvP4epfuQFdcCRYoIdGIYlonTaPY",
//     authDomain: "illust-b87a1.firebaseapp.com",
//     databaseURL: "https://illust-b87a1.firebaseio.com",
//     projectId: "illust",
//     measurementId: "G-VBJ7RSFPZL"
//   });
var database = firebase.database();
//firebase.functions().useFunctionsEmulator("http://localhost:5001");

var functions = firebase.functions();

function sidebar(l){
    if(l){
        document.getElementById("sidebar").style="";
        document.getElementById("overlay").style="";
    }else{
        if(document.body.id=="doomsday"&&window.innerHeight > window.innerWidth){
            document.getElementById("sidebar").style="width:60%";
        }else{
            document.getElementById("sidebar").style="width:310px";
        }
        document.getElementById("overlay").style="display:initial;opacity:40%";
    }
}

async function connectTorus(){
    localStorage.setItem("provider","torus");
    document.getElementById("content").innerHTML='Connecting to Account'+elements.loading()+`<div class='button' onclick='changePage();'>Back</div>`;
    // await torus.ethereum.enable()
    //const web3 = new Web3(torus.provider);
    await account.load();
    console.log(provider);

}
function connectAccount(q){
    document.getElementById("content").innerHTML=`Connecting to Web3 Provider${elements.loading()}`;
    if(q){
        try{
            localStorage.setItem("provider","web3");
            window.ethereum.enable();
            provider = new ethers.providers.Web3Provider(web3.currentProvider);
            changePage();
        }catch(e){
            console.log(e);
        }
    
    }
    
    try{
        if(provider&&provider.provider&&provider.provider.selectedAddress!=null&&provider.provider.selectedAddress!=undefined){
            //console.log(provider.provider.selectedAddress);
            var userRef = firebase.database().ref('users/' + provider.provider.selectedAddress);
            userRef.on('value', async function(snapshot) {
                let d=snapshot.val();
                console.log(d);
                console.log(snapshot.val());
                if(d!==null){
                    //location.hash="account";
                    //await changePage();
                    account.info={
                        username:d.username,
                        firstname:d.firstname,
                        lastname:d.lastname,
                        pronoun:d.pronoun,
                        email:d.email,
                        collection:d.collection,
                        bio:d.bio,
                        bids:d.bids
                    }
                    document.getElementById("content").innerHTML=await elements.account();
                    console.log(account.info);
                }
                else if(provider&&provider.provider.selectedAddress){
                    document.getElementById("content").innerHTML=elements.createAccount();
                }
            });
        }
    }catch(e){
        console.log(e);
    }
}
async function placeBid(a){
    try{
        await account.load();
        /*
        console.log(a);
        firebase.functions().useFunctionsEmulator("http://localhost:5001");
        var addBid = firebase.functions().httpsCallable('placeBid');
        addBid(
            {
                "user": provider.provider.selectedAddress,
                "amount":document.getElementById("bidAmount").value,
                "asset": a
            }
        ).then(function(result) {
        // Read result of the Cloud Function.
        console.log("data");
        //var sanitizedMessage = result.data.text;
        console.log(result);
        }).catch(function(error) {
            // Getting the Error details.
            var code = error.code;
            var message = error.message;
            var details = error.details;
            // ...
            console.log(error);
        });
            */
        invoke('b', a).then((result)=>{
            let am=document.getElementById("bidAmount").value.toString();
            console.log(result,a,am);
            firebase.database().ref('users/' + provider.provider.selectedAddress+"/bids/"+a).set(am);
        });
        //account.info.bids[a]=(document.getElementById("bidAmount").value);
    }catch(e){
        //alert("Could not execute bid, make sure your wallet is populated, the auction is live, and your bid price is high enough");
        console.log(e);
    }
}
function changeAuth(){
    let m;
    if(document.getElementById('torusBox')){
        currentAuth++;
        if(currentAuth==1)
            m="E-Mail";
        else if(currentAuth==2)
            m="Google";
        else if(currentAuth==3)
            m="Facebook";
        else if(currentAuth==4)
            m="Reddit";
        else if(currentAuth==5)
            m="Github";
        else if(currentAuth==6)
            m="Apple";
        else if(currentAuth==7){
            m="Twitter";
            currentAuth=0;
        }
        document.getElementById('torusBox').innerHTML='Connect with '+m;
    }else{
        clearInterval(torInt);
    }
}
function hashMesh(){
    document.getElementById('upload').click();
    document.getElementById('upload').addEventListener('change', readFileAsString);
}
async function upload(){
    
    let fr = new FileReader();
    const selectedFile = document.getElementById('assetInput').files[0];
    console.log(selectedFile);
    fr.readAsText(selectedFile);
    //let a=new Int8Array(selectedFile);
    //console.log(h);
    fr.onload = async function(event) {
        if(location.hash=="#editAssets"){
            console.log(event.target.result);
            
            let a=(event.target.result);
            let h=ethers.utils.id(a);
            let n=ethers.BigNumber.from(h);
            document.getElementById("assetMintID").value=n;
            document.getElementById("asset_id").value=n;
        }
    }
}
async function readFileAsString(f) {
    files = this.files;
    console.log(this.files);
    if (files.length === 0) {
        console.log('No file is selected');
        return;
    }

    formData = new FormData();
    if(location.hash=="#admin"){
        var reader = new FileReader();
        let p9 = reader.readAsText(files[0]);
        // Closure to capture the file information.
        
        console.log(p9, files[0].stream);
        reader.onload = (function(theFile) {
              console.log( theFile );
          })(f);
    
        let h = await web3.utils.sha3(f);
        document.getElementById("data").innerHTML=h;
    }else{
        uploadPopup();
    }
}
function uploadPopup(){

    document.body.innerHTML+=`
        <div id="uPopup">
            <div>
                <h1>Register</h1>
                Name of the art piece:
                <input id="name" placeholder=""></input>
                Artist:
                <input id="author" placeholder=""></input>
                Licence
                <select id="licence">
                    <option>CC-BY</option>
                </select>

                <div></div>
                
                <div class="button" onmousedown="register()">
                    Hash the Mesh
                </div>
            </div>
        </div>
    `

}
function explore(){

}

//var metadataURL='https://us-central1-illust.cloudfunctions.net/metadata'
//let metadataTestAPI='http://localhost:5001/illust/us-central1/metadata'
var assetData={}
function addAsset(){
    location.hash=`editAsset?${document.getElementById("asset_id").value}`
}
async function editAsset(a){
    console.log(assetData)
    //a is the asset ID
    a=new ethers.BigNumber.from(a)
    for(v in assetData){
        console.log(`asset_${v}`)
        assetData[v]=document.getElementById(`asset_${v}`).value;
    }
    let s;
    try{
        s=await account.sign("update asset");
    }catch{
        alert("Please login as illust admin")
        return
    }
    console.log(a,s);
    var request = new XMLHttpRequest(); 
    request.onreadystatechange = function() {
        if (request.readyState === 4) {
            
            alert(`${request.responseText}`);
        }
    }
    request.open("POST", `https://us-central1-illust.cloudfunctions.net/metadata/edit/${a}/${s}`);
    request.send(JSON.stringify(assetData));

}
function addField(){
    assetData[document.getElementById("fieldName").value]=""
    document.getElementById("varBox").innerHTML+=`${document.getElementById("fieldName").value}<input id="asset_${document.getElementById("fieldName").value}" placeholder='${document.getElementById("fieldName").value} data'></input>`
}

function displayCamera(){
    document.getElementById("content").innerHTML = `<input id="cameraLoader" type="file" accept="image/*">`
    document.getElementById("cameraLoader").click;
}
function register(){
    let d={"Name": document.getElementById("name").value, "Author": document.getElementById("author").value, "Licence":document.getElementById("licence").value};
    console.log(files[0]);
    formData.append("model", files[0]);
    formData.append("info", JSON.stringify(d));
    var request = new XMLHttpRequest(); 
    request.onreadystatechange = function() {
        if (request.readyState === 4) {
            let m=JSON.parse(request.response);
            alert(m.message);
        }
      }
    request.open("POST", "/upload");
    request.send(formData);
    document.getElementById("uPopup").style="display:none;";
    
}
function copyText(t){

    this.select();this.setSelectionRange(0, 99999);document.execCommand("copy");alert("Copied the text: " + this.innerHTML);
}
async function invoke(w, m){

    var abi = [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "Auctions",
            "outputs": [
                {
                    "internalType": "address payable",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "address payable",
                    "name": "topBidder",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "price",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "inc",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "closeTime",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "asset",
                    "type": "uint256"
                }
            ],
            "name": "placeBid",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "asset",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "initialPrice",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "increment",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "closeTime",
                    "type": "uint256"
                }
            ],
            "name": "startAuction",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];
   
    var address = '0x82e412e5ebF4b323f1CDE727932f8F38cd61496a';
   
    var contract = new ethers.Contract(address, abi, provider);
    if(w=="n"){
        provider = new ethers.providers.Web3Provider(web3.currentProvider);
        let signer = provider.getSigner();
        contract=contract.connect(signer);
        var sendPromise = contract.startAuction(document.getElementById("a").value,document.getElementById("i").value,document.getElementById("inc").value, Number(document.getElementById("closetime").value));
        sendPromise.then(function(transaction) {
            document.getElementById("data").innerHTML=(transaction);
        });
        
    }else if(w=="b"){
        account.load();
        let signer = provider.getSigner();
        contract=contract.connect(signer);
        let b =ethers.utils.parseEther(Number(document.getElementById("bidAmount").value).toFixed(17));
        console.log(b);
        let a =document.getElementById("bidAsset")?document.getElementById("bidAsset").value:m;
        console.log(b,a);
        if(b==""){
            alert("Please enter bid value");
        }else{
            try{
                var sendPromise = contract.placeBid(b,a);
                await sendPromise;
                alert(`Thank you for Bidding (${document.getElementById("bidAmount").value} ETH). Please note, your bid will be confirmed as soon as the Ethereum network has updated. If bid is not confirmed, gas will be returned to your wallet.`);
            }catch(e){
                console.log(e);
                alert("Could not execute bid. Smart contract rejected transaction, make sure your wallet has enough ETH, and you are bidding high enough");
            }
        }
        
    }else if(w=="qq"){
        provider=ethers.getDefaultProvider(1);
        contract = new ethers.Contract(address, abi, provider);
        //let a=Number(document.getElementById("lotID").value);
        var callPromise = contract.Auctions(m);
        callPromise.then(function(result) {
            console.log(ethers.utils.getAddress(result[1]));

            document.getElementById("topBidder").innerHTML=`Top bidder: ${result[1]}<br /><br />`;
            //set price
            let bidPrice=ethers.utils.formatEther(ethers.BigNumber.from(result[2]));

            //set min
            let min=ethers.utils.formatEther((result[3]).add(result[2]));

            if(assets[m].override){
                document.getElementById("topBidder").innerHTML=`Top bidder: ${assets[m].override.bidder}<br /><br />`;
                document.getElementById("bidAmount").value=`${assets[m].override.bid+0.20000000001}`;
                document.getElementById("priceBox").innerHTML=`<b>Current Bid: ${assets[m].override.bid} ETH</b><br><br>`;
                
            }else{
                //console.log(min);
                document.getElementById("bidAmount").value=`${min}`;
                //get top bidder
                var userRef = firebase.database().ref('users/' + ethers.utils.getAddress(result[1]));
                userRef.once('value', async function(snapshot){
                    let d=snapshot.val();
                    //console.log(d);
                    if(d!=null){
                        document.getElementById("topBidder").innerHTML=`Top bidder: ${d.username}<br><br>`;
                    }else{
                        
                        var userRef2 = firebase.database().ref('users/' + String(ethers.utils.getAddress(result[1]).toLowerCase()));
                        userRef2.once('value', async function(ss){
                            let p=ss.val();
                            //console.log(p.username);
                            if(p!=null){
                                document.getElementById("topBidder").innerHTML=`Top bidder: ${p.username}<br><br>`;
                            }
                        });
                    }
                });
                document.getElementById("priceBox").innerHTML=`<b>Current Bid: ${bidPrice} ETH</b><br><br>`;
                
            }
            try{
                //console.log(result, result[2], result[3]);
                //document.getElementById("data")?document.getElementById("data").innerHTML=`Owner: ${result[0]}<br />`:()=>{};

                //document.getElementById("data").innerHTML+=`Increment: ${result[3]}<br />`
                
                
                //get conversion
                /*
                let xhr = new XMLHttpRequest();
                xhr.open("GET", "https://api.etherscan.io/api?module=stats&action=ethprice&apikey=EXENZEEKAYXD1MMA27F7A2GX1UVKPBEEZV")
                xhr.send();
                xhr.onload = function() {
                    assets.one=JSON.parse(xhr.response).result.ethusd;
                    document.getElementById("priceBox").innerHTML+=`(${(bidPrice*Number(assets.one)).toFixed(2)} USD)`;
                  };
                */
                
                
                //set date
                var utcSeconds = result[4].toNumber();
                var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
                d.setUTCSeconds(utcSeconds);
                document.getElementById("dateBox").innerHTML=`Close time: ${d}<br><br />`;

                var today = new Date();
                assets.countdown=(Date.parse(d)/1000)-(Date.parse(today)/1000);
                console.log(Date.parse(d), Date.parse(today), assets.countdown);
                clearInterval(assets.time);
                assets.time=setInterval(()=>{
                    try{
                    assets.countdown--;
                    document.getElementById("countdownBox").innerHTML=`${Math.floor(assets.countdown/3600)} Hours ${Math.floor(assets.countdown/60)%60} Minutes ${assets.countdown%60} Seconds <br><br />`;
                    }catch(e){
                        clearInterval(assets.time);
                    }
                },1000);
                document.getElementById("countdownBox").innerHTML=`${assets.countdown}<br><br />`;
            }catch(e){
                console.log(result, e);
            }
        });
    }
}
async function invokeCos(w, m){

    var abi = [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [
                {
                    "internalType": "address payable",
                    "name": "recipient2",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "recipient1Amount",
                    "type": "uint256"
                }
            ],
            "name": "closeCollection",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "asset",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "price",
                    "type": "uint256"
                },
                {
                    "internalType": "address payable",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "address payable",
                    "name": "winner",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "tokenContract",
                    "type": "address"
                }
            ],
            "name": "listAsset",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "asset",
                    "type": "uint256"
                }
            ],
            "name": "pay",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "winnigBids",
            "outputs": [
                {
                    "internalType": "address payable",
                    "name": "winner",
                    "type": "address"
                },
                {
                    "internalType": "address payable",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "price",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "token",
                    "type": "address"
                },
                {
                    "internalType": "bool",
                    "name": "complete",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];
   
    var address = '0x7cca737DC640eC07943aA32736E834eCa9E4C4eC';
   
    var contract = new ethers.Contract(address, abi, provider);
    
    if(w=="r"){
        await account.load();
        
        let signer = provider.getSigner();
        contract=contract.connect(signer);
        var sendPromise = contract.startAuction(document.getElementById("a").value,document.getElementById("i").value,document.getElementById("inc").value, Number(document.getElementById("closetime").value));
        sendPromise.then(function(transaction) {
            document.getElementById("itemWinner").innerHTML=(transaction);
        });
        
    }else if(w=="b"){
        let signer = provider.getSigner();
        contract=contract.connect(signer);
        var sendPromise = contract.winnigBids(ethers.BigNumber.from(m));
        sendPromise.then(function(r) {
            console.log(r);
            document.getElementById("itemData").innerHTML=`
                Winning address: ${r[0]}<br />
                Token Owner: ${r[1]} (DOOM)<br />
                Winning Bid: ${ethers.utils.formatEther(r[2])}<br />
                Token contract: ${r[3]}<br />
                ${r[4]?"completed":"Not yet claimed"}
            `;
        });
        
    }else if(w=="qq"){

        await account.load();
        let signer = provider.getSigner();
        contract=contract.connect(signer);
        var sendPromise = contract.winnigBids(ethers.BigNumber.from(m));
        let r = await sendPromise;
        let v=r[2];
        console.log(m, v);
        var payPromise = contract.pay(ethers.BigNumber.from(m), {
            gasLimit: 420000,
            value: v
        });
        payPromise.then(function(pr) {
            console.log(pr);
            alert("Thank you for claiming this item, it will appear in your wallet shortly");
            location.hash="account";
        });
    }
}
// if(window.ethereum){
//     window.ethereum.on('accountsChanged', function (accounts) {
//         changePage();
//     });
//     window.ethereum.on('networkChanged', function (accounts) {
//         changePage();
//     });
// }
async function testFunction(){
    window.ethereum.enable();
    provider = new ethers.providers.Web3Provider(web3.currentProvider);
    //await connectAccount();
    var addMessage = firebase.functions().httpsCallable('editUser');
    
    let signer = await provider.getSigner();
    let m={
        "text": "sometext",
        "moretext": "more text"
    }
    addMessage({
        message:m,
        signature:await signer.signMessage(JSON.stringify(m))
    }).then(function(result) {
      // Read result of the Cloud Function.
      console.log("data");
      //var sanitizedMessage = result.data.text;
      console.log(result);
    }).catch(function(error) {
      // Getting the Error details.+

      var code = error.code;
      var message = error.message;
      var details = error.details;
      // ...
      console.log(error);
    });
}
async function illustMarket(i, p){
    if(i=="create"){
        var ip=hydra.chains[0]+"/invoke/create";
        var d=p;
        await hydra.post(ip, d);
    }else if(i=="r"){
        var u =hydra.chains[0]+"/query/read/"+p;
        console.log(hydra.get(u));
        return await hydra.get(u);
    }else if(i=="bid"){
        var u =hydra.chains[0]+"/invoke/bid";
        var d=p+":"+document.getElementById("bidAmount").value;
        let i = await hydra.post(u, d);
    }
}