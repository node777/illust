var elements = {
    pages:{
        default: (p)=>{
            if(provider&&provider.provider&&provider.provider.selectedAddress&&provider.provider.selectedAddress.toLowerCase()=="0x68291fa38468685fc27b612D48c6e46C06BAc0cE"){
                alert("You have winning bids from the Brian Ziff collection. Please contact rob@illustagency.com to settle")
            }
            r=""
            p[1]="creator=Brian%20Ziff"
            r+= elements.pages.market(p);
            // p[1]="creator=DOOM"
            // r+= elements.pages.market(p);
            return r
        },
        market(p){
            market.getAssets(p, market.displayAssets);
            console.log(p);
            return /*html*/`
                <div id="js-marketHeader"></div>
                <div id="js-listings" class="market__collection">${elements.loading()}</div>
            `

        },
        editAssets:()=>{
            
            var request = new XMLHttpRequest(); 
            request.onreadystatechange = async function() {
                if (request.readyState === 4) {
                    if(localStorage.provider&&localStorage.provider!="web3"){
                        account.logout();

                    }
                    if(!localStorage.provider){
                        localStorage.provider="web3"
                        await account.login();
                    }
                    let m=JSON.parse(request.response);
                    let r=""
                   //console.log(m);
                    for(a in m){
                        let vars="";
                        for(v in m[a]){
                            if(v=="animation_url"){
                                vars+=`
                                    <model-viewer ar src="${m[a][v]}" style="position:relative;" auto-rotate camera-controls alt="Ain" background-color="#455A64"></model-viewer>`
                            }else{
                                vars+=`${v}: ${m[a][v]}<br>`
                            }
                        }
                        r+=`<div class="box">
                            ID: ${a} <br><br>
                            ${vars}
                            <div class="button" onclick="location.hash='editAsset?${a}'">Edit Asset</div>
                            <div class="button" onclick="location.hash='asset?${a}'">View Asset</div>
                        </div>`
                    }
                    document.getElementById("assetList").innerHTML=r + `
                        <div class="box">   
                            Add new Asset

                            <div class="box">
                                Upload FBX
                                <input type="file" id="assetInput">
                                <div class="button" onclick="upload()">Upload</div>
                            </div>


                            <div class="box">
                                Mint new asset (ERC721 smart contract)<br>
                                <input id="assetMintID" placeholder="assetID" />
                                <input id="assetMintUser" placeholder="User to mint asset ID under" />
                                <input id="recipient1" placeholder="Fee recipient 1" value="0x1e958A0526B9F52a34e8D3930941B661784f242e" />
                                <input id="recipient2" placeholder="Fee recipient 2" value="0x1e958A0526B9F52a34e8D3930941B661784f242e" />
                                <input id="split" placeholder="Recipient 1 pecent / 100" />
                                <div class="button" onclick="assets.invokeERC('a');">Mint Asset</div>
                            </div>

                            <div class="box">
                                Create new Asset
                                <input id="asset_id" placeholder="asset id"></input>
                                <div class="button" onclick="addAsset()">Add Asset</div>
                            </div>
                        </div>
                    `
                }
            }
            request.open("GET", "https://us-central1-illust.cloudfunctions.net/metadata");
            request.send();
            return `Illust Assets:<div id='assetList'>Loading Assets...${elements.loading()}</div>`
        },
        editAsset:async(a)=>{
            await account.load();
            var request = new XMLHttpRequest(); 
            request.onreadystatechange = function() {
                if (request.readyState === 4) {
                    var m
                    try{
                        m=JSON.parse(request.response);
                    }catch{
                        m={
                            "name":"None listed",
                            "description":"None listed",
                            "animation_url":"None listed"
                        }
                    }
                    let r=""
                    let vars=""
                   //console.log(m);
                   //console.log(assetData)
                    assetData={};
                    for(v in m){
                        assetData[v]=m[v];
                        vars+=`${v}: <input id="asset_${v}" value="${m[v]}"></input><br>`
                    }
                    r=`
                    

                    <div id="asset" class="box">
                        Asset ID: ${a[1]} <br><br>
                        <div id="varBox">
                            ${vars}
                        </div>
                        <div class="box">
                            Add custom field
                            <input id="fieldName" placeholder="Field Name"></input>
                            <div class="button" onclick="addField(${a[1]})">add field</div>
                        </div>
                        <div class="box" style="background-color:#f6d397">
                            Set Royalties
                            Enabled (0/1):
                            <input id="enabled" placeholder="Enabled (0/1)" value="1"></input>
                            First sale (0/1):
                            <input id="first_sale" ></input>
                            Primary Percentage(Aggregate/100):
                            <input id="primary_percentage" ></input>
                            Secondary Percentage(Aggregate/100):
                            <input id="percentage" ></input>
                            <div class="button" onclick="market.invokeCustody('setRoyalties')">Set Royalties</div>
                        </div>
                        <div class="box">
                            Add animation_url (.gltf file)
                            <div class="button" onclick="window.open('https://pinata.cloud', '_blank');/*addField('animation_url');*/">Upload .gltf</div>
                        </div>
                        <div class="box">
                            Begin Auction
                            <input id="auction_starting_bid" placeholder="Starting Bid"></input>
                            Auction Close Time:
                            <input id="auction_close" type="datetime-local"></input>
                            <div class="button" onclick="auction.beginAuction()">Begin Auction</div>
                        </div>
                        <div class="button" onclick="editAsset(${"'"+new ethers.BigNumber.from(a[1])+"'"})">Save Asset</div>
                    </div>
                    <div class="button" onclick="location.hash='editAssets'">Back</div>`
                    
                    document.getElementById("assetList").innerHTML=r
                }
            }
            request.open("GET", `https://us-central1-illust.cloudfunctions.net/metadata/${a[1]}`);
            request.send();
            return "<div id='assetList'></div>"
        },
        winners:()=>{
            return `
                <h1 style="margin:64px 1% 0">MF DOOM AUCTION 1 CLOSED</h1>   
                <div class="br" style="width:64px;float:left;margin:64px calc(98% - 64px) 64px 1%;"></div>
                <br>
                Please stay tuned as the second MF DOOM AR NFT drop featuring 3 limited edition, one of a kind masks will be available starting Thursday 10/29 @12 PM PST until Friday 10/30 @6 PM PST.<br><br>
                Check out our <a href="https://www.illust.space/news/">Blog</a>, <a href="https://discord.gg/98qqje5">Discord</a>, or sign up with our email form for more details about this final Halloween 2020 AR NFT drop!<br><br>
                
                <div id="mc_embed_signup">
                <form action="https://illustagency.us4.list-manage.com/subscribe/post?u=c6f33ff36317a1dd23746cc23&amp;id=d8a9f22827" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
                    <div id="mc_embed_signup_scroll">
                <label for="mce-EMAIL">SIGN UP FOR UPDATES</label><br>
                <input type="email" value="" name="EMAIL" class="email" id="mce-EMAIL" placeholder="email address" required><br>
                    <div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_c6f33ff36317a1dd23746cc23_d8a9f22827" tabindex="-1" value=""></div>
                    <div><input type="submit" value="SUBSCRIBE" name="subscribe" id="mc-embedded-subscribe" class="button" style="margin:0 25%"></div>
                    </div>
                </form>
                </div><br><br>
                <div class="flex w1" style="font-size:80%;z-index:4">
                    <div>
                        <h2>Collection</h2>
                        MF DOOM Halloween Collection
                    </div>
                    <div>
                        <h2>What</h2>
                        Exclusive MF DOOM AR NFTs
                    </div>
                    <div>
                        <h2>Launch</h2>
                        October 23rd 2020
                    </div>
                    <div>
                        <h2>Auction</h2>
                        Limited Run NFT AR Pieces
                    </div>
                </div>
                <div class="w1" style="background-image:url('images/doom3.png'); width:110%;height:75vw;background-size: 100%; margin:0 -10% -10%;background-repeat:no-repeat;"></div>
                
                <div class="flex  wrap w1" style="text-align:center;margin-bottom:152px">
                    <h1>MF-7</h1>
                    <div>
                        1/4
                        <div class="br" style="float:left;width:64px;"></div>
            

                        <model-viewer ar ios-src="assets/models/green.usdz" src="assets/models/green.glb" style="position:relative;" auto-rotate camera-controls alt="Ain" background-color="#455A64"></model-viewer>

                        Winner: Blakezodoq
                        <div class="button w5" onclick="location.hash='lot?90007'">View Collection</div>
                        
                    </div>
                    <div>
                        2/4
                        <div class="br" style="float:left;width:64px;"></div>

                        <model-viewer ar ios-src="assets/models/green2.usdz" src="assets/models/green2.gltf" style="position:relative;" auto-rotate camera-controls alt="Ain" background-color="#455A64"></model-viewer>

                        Winner: nicooo9999
                        <div class="button w5" onclick="location.hash='lot?90007'">View Collection</div>
                        
                    </div>
                    <div>
                        3/4
                        <div class="br" style="float:left;width:64px;"></div>

                        <model-viewer ar ios-src="assets/models/green3.usdz" src="assets/models/green3.gltf" style="position:relative;" auto-rotate camera-controls alt="Ain" background-color="#455A64"></model-viewer>

                        Winner: Zanzibar
                        <div class="button w5" onclick="location.hash='lot?90007'">View Collection</div>
                        
                    </div>
                    <div>
                        4/4
                        <div class="br" style="float:left;width:64px;"></div>

                        <model-viewer ar ios-src="assets/models/green4.usdz" src="assets/models/green4.gltf" style="position:relative;" auto-rotate camera-controls alt="Ain" background-color="#455A64"></model-viewer>

                        Winner: shredordie911
                        <div class="button w5" onclick="location.hash='lot?90007'">View Collection</div>
                        
                    </div>
                </div>
                <div class="flex  wrap w1" style="text-align:center;margin-bottom:92px">
                    <h1>MF-8</h1>
                    <div>
                        1/4
                        <div class="br" style="float:left;width:64px;"></div>
            

                        <model-viewer ar ios-src="assets/models/blue.usdz" src="assets/models/blue.glb" style="position:relative;" auto-rotate camera-controls alt="Ain" background-color="#455A64"></model-viewer>

                        Winner: Zco

                        <div class="button w5" onclick="location.hash='lot?90008'">View Collection</div>
                        
                    </div>
                    <div>
                        2/4
                        <div class="br" style="float:left;width:64px;"></div>

                        <model-viewer ar ios-src="assets/models/blue2.usdz" src="assets/models/blue2.gltf" style="position:relative;" auto-rotate camera-controls alt="Ain" background-color="#455A64"></model-viewer>

                        Winner: metalfingers
                        <div class="button w5" onclick="location.hash='lot?90008'">View Collection</div>
                        
                    </div>
                    <div>
                        3/4
                        <div class="br" style="float:left;width:64px;"></div>

                        <model-viewer ar ios-src="assets/models/blue3.usdz" src="assets/models/blue3.gltf" style="position:relative;" auto-rotate camera-controls alt="Ain" background-color="#455A64"></model-viewer>

                        Winner: cultbitz
                        <div class="button w5" onclick="location.hash='lot?90008'">View Collection</div>
                        
                    </div>
                    <div>
                        4/4
                        <div class="br" style="float:left;width:64px;"></div>

                        <model-viewer ar ios-src="assets/models/blue4.usdz" src="assets/models/blue4.gltf" style="position:relative;" auto-rotate camera-controls alt="Ain" background-color="#455A64"></model-viewer>

                        Winner: elCastor
                        <div class="button w5" onclick="location.hash='lot?90008'">View Collection</div>
                        
                    </div>
                </div>
            `
        },
        winners2:()=>{
            return `
                <h1 style="margin:64px 1% 0">MF DOOM AUCTION 2 CLOSED</h1>   
                <div class="br" style="width:64px;float:left;margin:64px calc(98% - 64px) 64px 1%;"></div>
                <br>
                <br><br>
                Check out our <a href="https://www.illust.space/news/">Blog</a>, <a href="https://discord.gg/98qqje5">Discord</a>, or sign up with our email form for more details about the next drop.<br><br>
                
                <div id="mc_embed_signup">
                <form action="https://illustagency.us4.list-manage.com/subscribe/post?u=c6f33ff36317a1dd23746cc23&amp;id=d8a9f22827" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
                    <div id="mc_embed_signup_scroll">
                <label for="mce-EMAIL">SIGN UP FOR UPDATES</label><br>
                <input type="email" value="" name="EMAIL" class="email" id="mce-EMAIL" placeholder="email address" required><br>
                    <div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_c6f33ff36317a1dd23746cc23_d8a9f22827" tabindex="-1" value=""></div>
                    <div><input type="submit" value="SUBSCRIBE" name="subscribe" id="mc-embedded-subscribe" class="button" style="margin:0 25%;width:50%"></div>
                    </div>
                </form>
                </div><br><br>
                <div class="flex w1" style="font-size:80%;z-index:4">
                    <div>
                        <h2>Collection</h2>
                        MF DOOM Halloween Collection
                    </div>
                    <div>
                        <h2>What</h2>
                        Exclusive MF DOOM AR NFTs
                    </div>
                    <div>
                        <h2>Launch</h2>
                        October 29rd 2020
                    </div>
                    <div>
                        <h2>Auction</h2>
                        Limited Run NFT AR Pieces
                    </div>
                </div>
                <div class="w1" style="background-image:url('images/doom4.png'); width:112%;height:75vw;background-size: 100%; margin:2% -6% -17%;background-repeat:no-repeat;"></div>
                
                <div class="flex  wrap w1" style="text-align:center;margin-bottom:152px">
        
                    <div>
                        <h1>MF-9</h1>
                        <div class="br" style="float:left;width:64px;"></div>
            

                        <model-viewer ar ios-src="assets/models/15656630424036753581450935940596632215884383929372546170587529153151943392229.usdz" src="assets/models/15656630424036753581450935940596632215884383929372546170587529153151943392229.gltf" style="position:relative;" auto-rotate camera-controls alt="Ain" background-color="#455A64"></model-viewer>

                        Winner: metalfingers
                        <div class="button w5" onclick="location.hash='asset?15656630424036753581450935940596632215884383929372546170587529153151943392229'">View Collection</div>
                        
                    </div>
                    <div>
                        <h1>MF-10</h1>   
                        <div class="br" style="float:left;width:64px;"></div>

                        <model-viewer ar ios-src="assets/models/70937556211959927769088791688503419832872233678974511813637293239899188185264.usdz" src="assets/models/70937556211959927769088791688503419832872233678974511813637293239899188185264.gltf" style="position:relative;" auto-rotate camera-controls alt="Ain" background-color="#455A64"></model-viewer>

                        Winner: Betosk8s
                        <div class="button w5" onclick="location.hash='asset?70937556211959927769088791688503419832872233678974511813637293239899188185264'">View Collection</div>
                        
                    </div>
                    <div>
                        <h1>MF-11</h1>
                        <div class="br" style="float:left;width:64px;"></div>

                        <model-viewer ar ios-src="assets/models/8456350751317975846800924683986100177337207567287562046240586730923411985742.usdz" src="assets/models/8456350751317975846800924683986100177337207567287562046240586730923411985742.gltf" style="position:relative;" auto-rotate camera-controls alt="Ain" background-color="#455A64"></model-viewer>

                        Winner: kingvanilli
                        <div class="button w5" onclick="location.hash='asset?8456350751317975846800924683986100177337207567287562046240586730923411985742'">View Collection</div>
                        
                    </div>
                </div>
            `
        },
        maskTransfer:()=>{
            account.load();
            return `
                <div class="button" onclick="assets.invokeERC('r')">Approve Transfer</div>
            `
        },
        claimItem:(i)=>{
            a=i[1];
            p=i[2];
           //console.log(i, a, p);
            if(localStorage.provider){
                account.load().then(()=>{
                    setTimeout(invokeCos("b", a),1000);
                    document.getElementById("aBox").innerHTML=`Your Address: ${provider.provider.selectedAddress}<br />`
                    
                });
                return `
                    <div id="aBox"></div>
                    <div id="itemData"></div>
                    <div class="button" onclick="invokeCos('qq', '${a}')">Claim Item</div>
                    `
            }else{
                return `
                    Please connect your wallet to claim this item
                    <div class="button" onclick="location.hash='account'">Connect</div>
                    `                
            }
        },
        account:async()=>{
            
            if(provider&&provider.provider&&provider.provider.selectedAddress&&provider.provider.selectedAddress.toLowerCase()=="0x68291fa38468685fc27b612D48c6e46C06BAc0cE"){
                alert("You have winning bids from the Brian Ziff collection. Please contact rob@illustagency.com to settle")
            }
            //document.getElementById("content").innerHTML=elements.connect();
            try{
                //await account.login();
                
                return elements.account();
                
            }catch(e){
                return elements.connect();
            }
        },
        lots:()=>{
            return `
                <div id="lotBox">
                    <div class="box">
                        <h1>Lot 1</h1><br>
                        <model-viewer ar src="assets/AinSoph.glb" auto-rotate camera-controls alt="Ain" background-color="#455A64"></model-viewer>

                        Minted by: POLY<br><b><br>
                        Price: 4.102 ETH<br><br>
                        Time Left: <div id="counter">1 hour 2 minutes 11 seconds</div></b><br><br>
                        Vivamus felis lectus, efficitur vitae porttitor tempor, sodales id tortor. Aliquam tempus eleifend ex eget condimentum. 
                        <div class="button" onclick="location.hash='lot?1'">View Lot</div>
                    </div>
                    <div class="box">
                        <h1>Lot 2</h1><br>
                        <model-viewer ar ios-src="assets/Astronaut.usdz" src="assets/Astronaut.glb" auto-rotate camera-controls background-color="#455A64"></model-viewer>
                        Vivamus felis lectus, efficitur vitae porttitor tempor, sodales id tortor. Aliquam tempus eleifend ex eget condimentum. Donec ac dapibus augue. Donec ac suscipit tellus. Nam viverra sit amet tellus eu blandit. Proin sed sem quis arcu faucibus sodales ac condimentum lectus. Quisque lacinia vel turpis in feugiat. Maecenas hendrerit vulputate tempus. Nulla vel nulla varius, ultricies ligula quis, aliquam ligula. Curabitur scelerisque feugiat ligula, tristique dignissim risus efficitur non. Morbi vitae mi et nibh rutrum ultrices a a velit. Aliquam erat volutpat. Nulla in nulla vulputate, tincidunt risus quis, accumsan ipsum.
                        <div class="button" onclick="location.hash='lot?2'">View Lot</div>
                    </div>
                    <div class="box">
                        <h1>Lot 3</h1><br>
                        <model-viewer ar ios-src="assets/Astronaut.usdz" src="assets/Astronaut.glb" auto-rotate camera-controls  background-color="#455A64"></model-viewer>
                        Vivamus felis lectus, efficitur vitae porttitor tempor, sodales id tortor. Aliquam tempus eleifend ex eget condimentum. Donec ac dapibus augue. Donec ac suscipit tellus. Nam viverra sit amet tellus eu blandit. Proin sed sem quis arcu faucibus sodales ac condimentum lectus. Quisque lacinia vel turpis in feugiat. Maecenas hendrerit vulputate tempus. Nulla vel nulla varius, ultricies ligula quis, aliquam ligula. Curabitur scelerisque feugiat ligula, tristique dignissim risus efficitur non. Morbi vitae mi et nibh rutrum ultrices a a velit. Aliquam erat volutpat. Nulla in nulla vulputate, tincidunt risus quis, accumsan ipsum.
                        <div class="button" onclick="location.hash='lot?3'">View Lot</div>
                    </div>
                </div>
            `
        },
        asset:async(a)=>{
            account.load().then(()=>{
            
                if(provider&&provider.provider&&provider.provider.selectedAddress&&provider.provider.selectedAddress.toLowerCase()=="0x68291fa38468685fc27b612D48c6e46C06BAc0cE"){
                    alert("You have winning bids from the Brian Ziff collection. Please contact rob@illustagency.com to settle")
                }
            })
            console.log("loading asset",`https://us-central1-illust.cloudfunctions.net/metadata/${a[1]}`)
            // await account.load()
            var request = new XMLHttpRequest(); 
            request.onreadystatechange = async function() {
                if (request.readyState === 4) {
                    console.log(request.response);
                    if(!request.response){
                        return `Asset could not be found <div class='button' onclick='location.hash=""'>Home</div>`
                    }
                    let m=JSON.parse(request.response);
                   //console.log(m);
                    let b="<br>";
                    let name=m.name;
                    let hash=a[1];
                    let url=m["animation_url"];
                    let iPrice=m.price||0;
                    let auctionDetails=``;
                    let editionHTML = ``;
                    let facePreviewHTML = ``;

                    

                    //get description
                    let description=m.description||"";

                    //get edition
                    if(m.edition){
                        editionHTML+=/*html*/`<div class="lotAsset__attribute">Edition: ${m.edition}</div>`
                    }
                    if(m["try_on"]){
                        facePreviewHTML = /*html*/`<a class="collectionItem__facePreview"  href="${m["try_on"]}">
                        <img src="/assets/icons/MaskTryON.png"/>
                        </a>                        `
                    }


                    let owner
                    try{
                        owner = await assets.invokeERC("getOwner", hash)
                        //console.log(owner)
                        try{
                            var userRequest = new XMLHttpRequest(); 
                            userRequest.onreadystatechange = async function() {
                                if (userRequest.readyState === 4) {
                                    let us=userRequest.response;
                                   //console.log(m);
                                //    if(us){
                                //     document.getElementById("ownerBox").innerHTML=us?`Owner: ${us}`:""
                                //    }
                                }
                            }
                            userRequest.open("GET", `https://us-central1-illust.cloudfunctions.net/users/username/${owner}`);
                            userRequest.send();
                        }catch(e){console.log(e)}
                    } catch {
                        owner = ""
                    }

                    //<a>Created by: <img style="width:70px; object-fit: cover;height:58px;margin-bottom:-25px" src="images/doom2.png"></img> DOOM</a><br><br>
                    //console.log('owner after' + owner)
                    
                    //let auction=JSON.parse(await illustMarket("r", n[1]));

                    if(m["end_date"]){
                       //console.log(m)
                        //setTimeout(auction.loadDate,1);
                        let endTime=new Date(m["end_date"]);
                        let timeNow=new Date(Date.now());
                        let endTimePretty = endTime.toLocaleString(); 

                        console.log(endTime.getTime(),Date.now())
                        //console.log(endTime.getTime(),timeNow.getTime())
                        market.endTime=m["end_date"];
                        if(endTime.getTime()>timeNow.getTime()){
                            let bidHistory=`
                            <div class="auction__history">
                            `
                            console.log(hash);
                            if(1){
                                let bidArray=[]
                                for(bid in m.bids){
                                    bidArray.push(m.bids[bid])
                                }
                                bidArray=bidArray.sort((a,b)=>{
                                    return Number(b.amount)-Number(a.amount)
                                });
                                console.log(bidArray);
                                
                                for(bid in bidArray){
                                    //console.log(bid, m.bids[bid])
                                    let timeLeft=Date.now()-new Date(bidArray[bid].timestamp).getTime();
                                    bidHistory+=`
                                    
                                        <div class="auction__bidder">
                                            ${(Math.floor(timeLeft/86400000))?`${Math.floor(timeLeft/86400000)} Days`:``} 
                                            ${(Math.floor(timeLeft%86400000/3600000))?`${Math.floor(timeLeft%86400000/3600000)} Hours`:``} 
                                            ${(Math.floor(timeLeft%3600000/60000))?`${Math.floor(timeLeft%3600000/60000)} Minutes`:``} 
                                            ${(Math.floor(timeLeft%60000/1000))?`${Math.floor(timeLeft%60000/1000)} Seconds`:``} 
                                            ago:<br>
                                            @${bidArray[bid].bidder||"Anonymous"} bid ${bidArray[bid].amount} ETH</div>
                                    `
                                }
                            }

                            bidHistory+=`
                            <div class="auction__overlay"></div>
                            </div>`
                            //console.log((owner.toLowerCase()==provider.provider.selectedAddress.toLowerCase()))
                            auctionDetails=/*html*/`
                                <div class="auction__label">Time Remaining</div>
                                <div class="auction__attribute" id="countdownBox"></div>
                                <div class="auction__label" >${(m.price==m["start_price"])?"Starting price":"Current Bid"}</div>
                                <div class="auction__attribute" id="priceBox">${m["price"]} ETH</div>
                                ${(m.reserve)?`
                                <div class="auction__label" >Reserve Price</div>
                                <div class="auction__attribute">${m["reserve"]} ETH</div>
                                `:""}
                               
                                ${
                                    //check userr is not owner
                                    (provider&&provider.provider&&provider.provider.selectedAddress&&owner&&owner.toLowerCase()==provider.provider.selectedAddress.toLowerCase())?"":/*html*/`
                                        <label class="auction__label">Place Bid</label>
                                        <span>ETH</span>
                                        <input id="js-bidAmount" style="margin:0;" type='number' step='0.2' value='${Number(m["price"])+0.2}'/>
                                        <div class="button" onclick="market.bid()">Place Bid</div>
                                `}
                                    
                                <div id="userBid"></div>
                                <div id="bidHistory">
                                ${bidHistory}
                                </div>
                            `
                        }else if(m.price==m["start_price"]){
                            auctionDetails+="This asset is not for sale"
                        }else{
                            auctionDetails+=/*html*/`
                                <div class="auction__label">This auction has ended</div>
                                <div class="auction__attribute">${endTimePretty}</div>
                                <div class="auction__label" >Top Bidder</div>
                                <div class="auction__attribute">${m["top_bidder"]}</div>
                                <label class="auction__label">Closing Price</label>
                                <div class="auction__attribute" id="priceBox">${m["price"]} ETH</div>
                            `
                            try{
                                if(owner.toLowerCase()==provider.provider.selectedAddress.toLowerCase()){
                                    if(await assets.invokeERC('checkApproval')){
                                        auctionDetails+=`Winner: ${m['top_bidder']}<br>Price: ${m.price}<br><div class='button' onclick="market.invokeCustody('listAsset', [${hash}, ${m.price}, '${m['top_bidder']}'])">Finalize Price</div>`

                                    }else{
                                        auctionDetails+=`You have not yet approved illust to trasact tokens on your behalf: please allow automatic transfer<br><div class='button' onclick="assets.invokeERC('r')">Allow transfer</div>`

                                    }
                                }
                                else if(m['top_bidder'].toLowerCase()==provider.provider.selectedAddress.toLowerCase()){
                                    auctionDetails+=`You have won this auction<br>If seller has finalized price, please pay now<div class='button' onclick="market.invokeCustody('pay', [${hash}, ${m.price}])">Pay Now</div>`
                                }
                            }catch(e){
                                console.log(e);
                            }
                        }
                    }else{

                        auctionDetails+="This asset is not for sale"
                    }

                    if(owner&&owner!=""&&provider&&provider.provider&&provider.provider.selectedAddress&&owner.toLowerCase()==provider.provider.selectedAddress.toLowerCase()){
                        auctionDetails+=`<div class='button' onclick="document.getElementById('js-auctionDetails').innerHTML=elements.sellAsset()">${m["end_date"]?"Manage asset sale":"Sell Asset"}</div>`
                    }
    
                    document.getElementById("content").innerHTML= /*html*/`
                        <div id="lotBox" class="lotAsset">
                            <h1 class="lotAsset__title">${name}</h1>
                            <ul class="lotAsset__linkouts">
                                <li>
                                    <a href="https://etherscan.io/token/0x40bd6c4d83dcf55c4115226a7d55543acb8a73a6?a=${hash}" target="_blank">History</a>
                                </li>
                                <li>
                                    <a href="#market?creator=${m.creator||'Illust'}">Other Works</a>
                                </li>
                            </ul>
                            <div class="lotAsset__wrapper">
                                <div class="lotAsset__content">
                                           
                                    <div class="lotAsset__viewer">
                                        ${//if there is an mp4 
                                            m.mp4?`
                                            
                                            <video id="video" autoplay loop muted style="width:100%">
                                                <source src="${m.mp4}" type="video/mp4">
                                                Your browser does not support HTML video.
                                            </video>
                                        `://if there is no mp4
                                        `
                                            <model-viewer class="lotAsset__model" ar  ios-src="${m.usdz||''}" src="${url}" auto-rotate camera-controls  alt="GreenMask"></model-viewer>
                                            ${facePreviewHTML}    
                                
                                        `}
                                    </div>
                                    <div class="lotAsset__details">
                                        <h2 class="lotAsset__name">
                                            <a href="#market?creator=${m.creator||'Illust'}">${m.creator||'Illust'}</a>
                                        </h2>
                                        ${editionHTML}
                                        <div id="ownerBox" class="lotAsset__attribute"></div> 
                                        <div class="lotAsset__attribute">Created By: 
                                            <a href="#market?creator=${m.creator||'Illust'}">${m.creator||'Illust'}</a>
                                        </div>
                                        <div class="lotAsset__attribute">${m.description}${m.description2||""}</div>
                                        <div class="lotAsset__attribute">History:
                                            <a target="_blank" href="https://etherscan.io/token/0x40bd6c4d83dcf55c4115226a7d55543acb8a73a6?a=${hash}">Etherscan</a>
                                        </div>
                                        <div class="lotAsset__shareWrapper">
                                            <a href="javascript:void(0)" onclick="elements.shareSheet(window.location.href, this)">Share Link 
                                                <input id="js-share" class="lotAsset__shareInput" aria-hidden="true"/>
                                                <div class="h-tooltip">Link Copied!</div>
                                            </a>
                                            <span> | </span>
                                            <a class="share__twitter" target="_blank" href="https://twitter.com/intent/tweet?text=Checkout%20This%20NFT%20${encodeURIComponent(window.location.href)}">
                                            <img class="share__twitterIcon" src="/assets/icons/twitter.svg"/>Tweet</a>
                                            <span> | </span>
                                            <iframe class="share__facebookButton" src="https://www.facebook.com/plugins/share_button.php?href=${encodeURIComponent(window.location.href)}&layout=button_count&size=small&appId=794158374066212&width=96&height=20" width="96" height="20" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>


                                        </div>
                                    </div>
                                    <div id="js-auctionDetails" class="lotAsset__auction">
                                        ${auctionDetails}
                                    </div>
                                </div>
                            </div>
                            <div>
                                ${m.footer||""}
                                ${(m.footer_img)?`
                                    <img src='${m.footer_img}' class='footerImg'/ >
                                `:""}
                            </div>
                        </div>
                    `
                    market.countdown();
                    //changePage()
                }
            }
            request.open("GET", `https://us-central1-illust.cloudfunctions.net/metadata/${a[1]}`);
            request.send()
            //changePage();
            return `<div id="assetBox"></div>`
        },
        claim:async(a)=>{
            // await account.load()
            console.log("loading asset",`https://us-central1-illust.cloudfunctions.net/metadata/${a[1]}`)
            // await account.load()
            var request = new XMLHttpRequest(); 
            request.onreadystatechange = async function() {
                if (request.readyState === 4) {
                    console.log(request.response);
                    if(!request.response){
                        return `Asset could not be found <div class='button' onclick='location.hash=""'>Home</div>`
                    }
                    let m=JSON.parse(request.response);
                    //console.log(m);
                    let b="<br>";
                    let name=m.name;
                    let hash=a[1];
                    let url=m["animation_url"];
                    let iPrice=m.price||0;
                    let auctionDetails=``;
                    let editionHTML = ``;
                    let facePreviewHTML = ``;

                    

                    //get description
                    let description=m.description||"";

                    //get edition
                    if(m.edition){
                        editionHTML+=/*html*/`<div class="lotAsset__attribute">Edition: ${m.edition}</div>`
                    }
                    if(m["try_on"]){
                        facePreviewHTML = /*html*/`<a class="collectionItem__facePreview"  href="${m["try_on"]}">
                        <img src="/assets/icons/MaskTryON.png"/>
                        </a>                        `
                    }


                    let owner
                    try{
                        owner = await assets.invokeERC("getOwner", hash)
                        //console.log(owner)
                        try{
                            var userRequest = new XMLHttpRequest(); 
                            userRequest.onreadystatechange = async function() {
                                if (userRequest.readyState === 4) {
                                    let us=userRequest.response;
                                   //console.log(m);
                                //    if(us){
                                //     document.getElementById("ownerBox").innerHTML=us?`Owner: ${us}`:""
                                //    }
                                }
                            }
                            userRequest.open("GET", `https://us-central1-illust.cloudfunctions.net/users/username/${owner}`);
                            userRequest.send();
                        }catch(e){console.log(e)}
                    } catch {
                        owner = ""
                    }

                    //<a>Created by: <img style="width:70px; object-fit: cover;height:58px;margin-bottom:-25px" src="images/doom2.png"></img> DOOM</a><br><br>
                    //console.log('owner after' + owner)
                    
                    //let auction=JSON.parse(await illustMarket("r", n[1]));

                    if(m["end_date"]){
                       //console.log(m)
                        //setTimeout(auction.loadDate,1);
                        let endTime=new Date(m["end_date"]);
                        let timeNow=new Date(Date.now());
                        let endTimePretty = endTime.toLocaleString(); 

                        console.log(endTime.getTime(),Date.now())
                        //console.log(endTime.getTime(),timeNow.getTime())
                        market.endTime=m["end_date"];
                        //if auction is live
                        if(endTime.getTime()>timeNow.getTime()){
                            let bidHistory=`
                            <div class="auction__history">
                            `
                            console.log(hash);
                            if(hash=="47365374795336020801871236186558194024311745115267511752163356511372176907504"){
                                let bidArray=[]
                                for(bid in m.bids){
                                    bidArray.push(m.bids[bid])
                                }
                                bidArray=bidArray.sort((a,b)=>{
                                    return Number(b.amount)-Number(a.amount)
                                });
                                console.log(bidArray);
                                
                                for(bid in bidArray){
                                    //console.log(bid, m.bids[bid])
                                    let timeLeft=Date.now()-new Date(bidArray[bid].timestamp).getTime();
                                    bidHistory+=`
                                    
                                        <div class="auction__bidder">
                                            ${(Math.floor(timeLeft/86400000))?`${Math.floor(timeLeft/86400000)} Days`:``} 
                                            ${(Math.floor(timeLeft%86400000/3600000))?`${Math.floor(timeLeft%86400000/3600000)} Hours`:``} 
                                            ${(Math.floor(timeLeft%3600000/60000))?`${Math.floor(timeLeft%3600000/60000)} Minutes`:``} 
                                            ${(Math.floor(timeLeft%60000/1000))?`${Math.floor(timeLeft%60000/1000)} Seconds`:``} 
                                            ago:<br>
                                            @${bidArray[bid].bidder||"Anonymous"} bid ${bidArray[bid].amount} ETH</div>
                                    `
                                }
                            }

                            bidHistory+=`
                            <div class="auction__overlay"></div>
                            </div>`
                            //console.log((owner.toLowerCase()==provider.provider.selectedAddress.toLowerCase()))
                            auctionDetails=/*html*/`
                                <div class="auction__label">Time Remaining</div>
                                <div class="auction__attribute" id="countdownBox"></div>
                                <div class="auction__label" >${(m.price==m["start_price"])?"Reserve price":"Current Bid"}</div>
                                <div class="auction__attribute" id="priceBox">${m["price"]} ETH</div>
                               
                                ${
                                    //check userr is not owner
                                    (provider&&provider.provider&&provider.provider.selectedAddress&&owner&&owner.toLowerCase()==provider.provider.selectedAddress.toLowerCase())?"":/*html*/`
                                        <label class="auction__label">Place Bid</label>
                                        <span>ETH</span>
                                        <input id="js-bidAmount" style="margin:0;" type='number' step='0.2' value='${Number(m["price"])+0.2}'/>
                                        <div class="button" onclick="market.bid()">Place Bid</div>
                                `}
                                    
                                <div id="userBid"></div>
                                <div id="bidHistory">
                                ${bidHistory}
                                </div>
                            `
                        }else if(m.price==m["start_price"]){
                            auctionDetails+="This asset is not for sale"
                        }else{
                            auctionDetails+=/*html*/`
                                <div class="auction__label">This auction has ended</div>
                                <div class="auction__attribute">${endTimePretty}</div>
                                <div class="auction__label" >Top Bidder</div>
                                <div class="auction__attribute">${m["top_bidder"]}</div>
                                <label class="auction__label">Closing Price</label>
                                <div class="auction__attribute" id="priceBox">${m["price"]} ETH</div>
                            `
                            try{
                                if(owner.toLowerCase()==provider.provider.selectedAddress.toLowerCase()){
                                    auctionDetails+=`Winner: ${m['top_bidder']}<br>Price: ${m.price}<br><div class='button' onclick="market.invokeCustody('listAsset', [${hash}, ${m.price}, '${m['top_bidder']}'])">Finalize Price</div>`
                                }
                                else if(provider&&provider.provider&&m['top_bidder'].toLowerCase()==provider.provider.selectedAddress.toLowerCase()){
                                    if(!localStorage.userInfo){
                                        alert("Please sign in or create account with button on top left. If there are any questions on claiming your item, please contact us.")
                                    }
                                    auctionDetails+=`
                                        You have won this auction<br>If seller has finalized price, please pay now
                                        <div class='button' onclick="market.invokeCustody('claim', [${hash}, ${m.price}])">Pay Now</div>
                                        <div>Please contact hello@illust.agency to claim your winning bid.</div>`
                                }
                            }catch(e){
                                console.log(e);
                            }
                        }
                        //if auction is not live
                    }else{

                        auctionDetails+="This asset is not for sale"
                    }

                    if(owner&&owner!=""&&provider&&provider.provider&&owner.toLowerCase()==provider.provider.selectedAddress.toLowerCase()){
                        auctionDetails+=`<div class='button' onclick="document.getElementById('js-auctionDetails').innerHTML=elements.sellAsset()">${m["end_date"]?"Manage asset sale":"Sell Asset"}</div>`
                    }
    
                    document.getElementById("assetBox").innerHTML= /*html*/`
                        <div id="lotBox" class="lotAsset">
                            <h1 class="lotAsset__title">${name}</h1>
                            <ul class="lotAsset__linkouts">
                                <li>
                                    <a href="https://etherscan.io/token/0x40bd6c4d83dcf55c4115226a7d55543acb8a73a6?a=${hash}" target="_blank">History</a>
                                </li>
                                <li>
                                    <a href="#market?creator=${m.creator||'Illust'}">Other Works</a>
                                </li>
                            </ul>
                            <div class="lotAsset__wrapper">
                                <div class="lotAsset__content">
                                    <div class="lotAsset__viewer">
                                        <model-viewer class="lotAsset__model" ar  ios-src="${m.usdz||''}" src="${url}" auto-rotate camera-controls  alt="GreenMask"></model-viewer>
                                        ${facePreviewHTML}    
                                    </div>
                                
                                    <div class="lotAsset__details">
                                        <h2 class="lotAsset__name">
                                            <a href="#market?creator=${m.creator||'Illust'}">${m.creator||'Illust'}</a>
                                        </h2>
                                        ${editionHTML}
                                        <div id="ownerBox" class="lotAsset__attribute"></div> 
                                        <div class="lotAsset__attribute">Created By: 
                                            <a href="#market?creator=${m.creator||'Illust'}">${m.creator||'Illust'}</a>
                                        </div>
                                        <div class="lotAsset__attribute">${m.description}</div>
                                        <div class="lotAsset__attribute">History:
                                            <a target="_blank" href="https://etherscan.io/token/0x40bd6c4d83dcf55c4115226a7d55543acb8a73a6?a=${hash}">Etherscan</a>
                                        </div>
                                        <div class="lotAsset__shareWrapper">
                                            <a href="javascript:void(0)" onclick="elements.shareSheet(window.location.href, this)">Share Link 
                                                <input id="js-share" class="lotAsset__shareInput" aria-hidden="true"/>
                                                <div class="h-tooltip">Link Copied!</div>
                                            </a>
                                            <span> | </span>
                                            <a class="share__twitter" target="_blank" href="https://twitter.com/intent/tweet?text=Checkout%20This%20NFT%20${encodeURIComponent(window.location.href)}">
                                            <img class="share__twitterIcon" src="/assets/icons/twitter.svg"/>Tweet</a>
                                            <span> | </span>
                                            <iframe class="share__facebookButton" src="https://www.facebook.com/plugins/share_button.php?href=${encodeURIComponent(window.location.href)}&layout=button_count&size=small&appId=794158374066212&width=96&height=20" width="96" height="20" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>


                                        </div>
                                    </div>
                                    <div id="js-auctionDetails" class="lotAsset__auction">
                                    ${auctionDetails}
                                </div>
                                </div>
                            </div>
                        </div>
                    `
                    market.countdown();
                }
            }
            request.open("GET", `https://us-central1-illust.cloudfunctions.net/metadata/${a[1]}`);
            request.send()
            
            return `<div id="assetBox"></div>`
        },
        collections:()=>{
            return elements.DOOM2();
        },
        admin:async()=>{
            return `
                <h1>Admin Panel</h1>
                <div class="box">
                    Data Output:<br>
                    <div id="data"></div>
                </div>
                <model-viewer style="margin:auto;height:30vh;position:relative" ar ios-src="assets/models/green.usdz" src="assets/models/green.gltf" auto-rotate camera-controls background-color="#455A64"></model-viewer>

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
                            <input id="closetime" placeholder="close time" />
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
                            <input id="assetMintID" placeholder="assetID" />
                            <input id="assetMintUser" placeholder="User to mint asset ID under" />
                            <input id="recipient1" placeholder="Fee recipient 1" />
                            <input id="recipient2" placeholder="Fee recipient 2" />
                            <input id="split" placeholder="pecent / 100" />
                            <div class="button" onclick="assets.invokeERC('a');">Create Asset</div>
                        </div>
                        <div class="box">
                            Check Assets in your account
                            <div id="bidButton" class="button" onmousedown="assets.invokeERC('b')">Check</div>
                        </div>
                    </div>
                    <div class="box">
                        Lot status query
                        <input id="lotID" placeholder="Lot ID" />
                        <div class="button" onclick="invoke()">Get Lot Status</div>
                        <div class="button" onclick="invoke()">Get Lot Status</div>
                    </div>
                    
                </div>
                <div onclick="testFunction()" class="button">
                 Test account creation
                </div>
                <div onclick="document.getElementByID('content').innerHTML=elements.DOOM2" class="button">
                 Test account creation
                </div>

            `
        },
        gallery:(p)=>{
           //console.log(p);
            try{
                    
                var request4 = new XMLHttpRequest(); 
                request4.onreadystatechange = function() {
                    if (request4.readyState === 4) {
                        if(!request4.response){
                            return `Asset could not be found <div class='button' onclick='location.hash=""'>Home</div>`
                        }
                        let m=JSON.parse(request4.response);
        
                       //console.log(m);
                        
                        let url=m["animation_url"];
                        let usdz=m["usdz"];
                        document.getElementById("gallery").innerHTML= /*html*/`
                            <model-viewer ar ios-src="${usdz}" src="${url}" onError="this.onerror=null;this.src='${url}';" auto-rotate camera-controls alt="Ain" background-color="#455A64"></model-viewer>
                        `
                    }
                }
                request4.open("GET", `https://us-central1-illust.cloudfunctions.net/metadata/${p[1]}`);
                request4.send()
                return ''
                
            }catch(e){
               //console.log(e);
                return `
                    
                <div id="gal"></div>
                `

            }
        },
        reboot:()=>{
            localStorage.clear();
            location.hash="account"
        },
        404:()=>{
            "Page could not be loaded"
        }
    },
    header: `
        <div id="ac" onclick="location.hash='account'">
            <img src="assets/icons/account.svg" />
        </div>
        <div id="hd" onclick="location.hash=''">ILLUST.SPACE</div>
        <div id="hb" onclick="sidebar()">
            <div></div>
            <div></div>
            <div></div>
        </div>
        <div class="br" style="margin:1%"></div>
    `,
    sidebar:/*html*/`
        <div onclick=""><a href="https://illust.space">Exhibitions</a></div>
        <div><a onclick="location.hash='';sidebar(1);">Market</a></div>
        <div><a href="https://illust.space/about">About</a></div>
        <div onclick="location.hash='account';sidebar(1);">Account</div>
        <div><a href="https://illust.space/contact">Contact</a></div>
        <div onclick=""><a href="https://illust.space/faq">FAQ</a></div>
        <div onclick=""><a href="https://illust.space/privacy-policy">Privacy</a></div>
        <div><a href="https://illust.space/user-agreement">User Agreement</a></div>
        <div onclick=""><a href="https://illust.space/terms-of-service">Terms of Service</a></div>
    `,
    footer:`
    ©copyleft 2020
    `,
    createAccount:()=>{
        try{
            return /*html*/`
                <div class="popup accountCreate__popup">
                    <h2 class="accountCreate__heading">Welcome to Illust Space:</h2 class="accountCrate__heading">
                    <br>
                    Please choose a name to get started<br><br>
                    <label class="accountCreate__label" for="usernamei">Username*</label>
                    <input  class="accountCreate__input" name="username" id="usernamei"></input>
                    
                    <label class="accountCreate__label" for="firstname">First Name*</label>
                    <input class="accountCreate__input" name="given-name" id="firstname" ></input>

                    <label class="accountCreate__label" for="lastname">Last Name*</label>
                    <input class="accountCreate__input" name="family-name" id="lastname"></input>
                    
                    <label class="accountCreate__label" for="emaili">Email*</label>
                    <input class="accountCreate__input" name="email" id="emaili"></input>
                    
                    <label class="accountCreate__label" for="bioi">Bio</label>
                    <textarea class="accountCreate__input" id="bioi" placeholder="bio (optional)"></textarea><br>
                    <input class="accountCreate__input" type="checkbox" id="verifyTOS" style="width:min-content;margin:8px"/ > *I agree to the <a href="https://illust.space/terms-of-service">Terms of Service</a>, the <a href="https://illust.space/privacy-policy">Privacy Policy</a>, and the <a href="https://illust.space/user-agreement">User Agreement</a> <br>
                    <input class="accountCreate__input" type="checkbox" id="verifyCom" style="width:min-content;margin:8px"/ > Yes, I would like to receive email communications from Illust.Space</a> 
                    <br>Email will be used to notify auction winners.
                    <div class="accountCreate__button button" onclick="account.create()">Create Account</div>
                    <br>*Required Fields
                    <br>
                    <a href="javascript:void(0)" onclick="account.logout()">Connect through different method</a>
                </div>
            `
        }catch(e){
            return elements.connect()
        }
    },
    placeBid:async()=>{
        return `
            <div class="popup">
                <h1>Place Bid</h1>
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
                            <input id="assetMintID" placeholder="assetID" />
                            <input id="assetMintUser" placeholder="User to mint asset ID under" />
                            <input id="recipient1" placeholder="Fee recipient 1" />
                            <input id="recipient2" placeholder="Fee recipient 2" />
                            <input id="split" placeholder="pecent / 100" />
                            <div class="button" onclick="assets.invokeERC('a');">Create Asset</div>
                        </div>
                        <div class="box">
                            Check Assets in your account
                            <div id="bidButton" class="button" onmousedown="assets.invokeERC('b')">Check</div>
                        </div>
                    </div>
                    <div class="box">
                        Lot status query
                        <input id="lotID" placeholder="Lot ID" />
                        <div class="button" onclick="invoke()">Get Lot Status</div>
                        <div class="button" onclick="invoke()">Get Lot Status</div>
                    </div>
                    
                </div>
            </div>
        `
    },
    account:async()=>{
        let r=elements.loading();
        //await account.load();
        
        //console.trace(provider);
        try{
            if(provider&&provider.provider&&provider.provider.selectedAddress!=null&&provider.provider.selectedAddress!=undefined){
                //console.log(provider.provider.selectedAddress);
                let a;
                let b;
                if(account.info&&account.info.username){
                //console.log("Got Acc info", account.info);
                    a= await elements.profileInfo();
                    var profileAssets = await elements.profileAssets()
                    b=account.info.username; 
                    console.log(a, profileAssets);
                    r=/*html*/`
                        <div class="h-flex">
                            <div id="accountContent" class="accountContent__wrapper">
                                <h1 style="text-align:left">ACCOUNT INFO</h1>
                                <div class="br" style="width:64px;float:left;margin:0px calc(98% - 64px) 16px 0%;"></div>
                                <div id="js-accountWrapper" class="h-prel h-flex wrap h-100pw h-drel">
                                    <div id="js-profileInfo" class="profileInfo" >
                                        ${a}
                                    </div>
                                    <div id="js-profileAssets" class="profileAssets">
                                        ${profileAssets}
                                    </div>

                                </div>
                            </div>
                            
                        </div>
                    `;
                }else{
                    //connectAccount(1);
                    //await account.load();
                //console.log("Loading Acc info");
                console.log("Logging in");
                    account.login();
                    //a= await elements.profileInfo();
                    
                    r=elements.loading();
                }
            }else{
            //console.log("No provider");
                if(localStorage.userInfo){
                //console.log("User found");
                    account.login();
                }else{
                //console.log("No user could be found")
                    r=elements.connect();
                }
            }
        }catch(e){
            r=elements.connect();
           //console.log(e);
        }
        return r;
    },
    profileInfo:async()=>{
        try{
            let b=0;
            let e;
            let fn;
            let ln;
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
                b=await web3.eth.getBalance(provider.provider.selectedAddress,console.log);
            }catch(e){
               //console.log(e);
            }
            if(account.info){
                b=account.info.username;
                e=account.info.email;
                fn=account.info.firstname;
                ln=account.info.lastname;
            }
            let c=await elements.collection();
            return /*html*/`
                <div>
                    <img src="assets/icons/account.svg" class="profileInfo__photo" />
                    <div class="profileInfo__userName" onclick="account.information()">
                        @${b||"NO USER"}
                    </div>
                    <div class="profileInfo__userAttribute" onclick="account.edit()">
                        <strong>Email:</strong>
                        <span>${e}</span>
                    </div>
                    <div class="profileInfo__userAttribute" onclick="account.edit()">
                        <strong>First Name:</strong>
                        <span>${fn}<span>
                    </div>
                    <div class="profileInfo__userAttribute" onclick="account.edit()">
                        <strong>Last Name:</strong>
                        <span>${ln}</span>
                    </div>
                    <div class="profileInfo__userAttribute" onclick="account.edit()">
                        <strong>Bio:</strong>
                        <span>${account.info.bio||"Welcome to my page, this is my bio"}</span>
                    </div>
                    <div class="profileInfo__logout" id="so" onclick="account.logout()">Sign Out</div>
                </div>

            `;
        }catch(e){
           //console.log(e);
            return `Account info could not be located`;

        }
    },
    profileAssets:async()=>{
        let c=await elements.collection();
       //console.log(c);

        return /*html*/`
            <div>
                <div class="profileAssets__header">
                    <div id="cl" class="js-profileHeaderItem profileAssets__headerItem profileAssets__headerItem--current" onclick="account.selectProfileHeader(this);(async()=>{document.getElementById('js-profileContents').innerHTML=await elements.collection()})()">Collection<br><br></div>
                    <div id="vw" class="js-profileHeaderItem profileAssets__headerItem"  onclick="account.selectProfileHeader(this);account.wallet();">view Wallet<br><br></div>
                    <div  class="js-profileHeaderItem profileAssets__headerItem"  onclick="location.hash = ''">Auctions<br><br></div>

                </div>
                <div id="js-profileContents" class="profileAssets__collection">
                    <br><br>${c}
                </div>
            </div>`;
    },
    editProfile:async()=>{
        try{
            let b=0;
            let e;
            let fn;
            let ln;
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
               //console.log(e);
            }
            if(account.info){
                b=account.info.username;
                e=account.info.email;
                fn=account.info.firstname;
                ln=account.info.lastname;
            }
            let c=await elements.collection();
            return /*html*/`
                <div >
                    <img src="assets/icons/account.svg" class="profileInfo__photo" />
                    <div class="profileInfo__userName profileInfo__userName--edit">
                        <label>Profile:</label>
                        <input id="usernamei" value='${b||"NO USER"}' />
                    </div>
                    <div class="profileInfo__userAttribute profileInfo__userAttribute--edit">
                        <label>Email:</label>
                            <input id="emaili" value='${e}' />
                    </div>
                    <div class="profileInfo__userAttribute profileInfo__userAttribute--edit">
                        <label>First Name:</label>
                        <input id="firstname" value='${fn}' />
                    </div>
                    <div class="profileInfo__userAttribute profileInfo__userAttribute--edit">
                        <label>Last Name:</label>
                        <input id="lastname" value='${ln}' />
                    </div>
                    <div class="profileInfo__userAttribute profileInfo__userAttribute--edit"> 
                        <label>Bio:</label>
                        <input id='bioi' value='${account.info.bio||"Welcome to my page, this is my bio"}' />
                    </div>
                    <div class="profileInfo__userAttribute profileInfo__userAttribute--link" id="so" onclick="account.logout()">Sign Out</div>
                    <div class="button" onclick="account.create(1);">Update Account Info</div>
                </div>
            `;
        }catch(e){
           //console.log(e);
            return `Account info could not be located`;

        }
    },
    walletInfo:async()=>{
        try{
            setTimeout(()=>{new QRCode(document.getElementById("qrcode"), provider.provider.selectedAddress)}, 1000);
            setTimeout(()=>{account.getBal()}, 100);
            let b="";
            for(i in account.info.bids){
               //console.log(i, account.info.bids[i]);
                b+=`Bids:<br><a onclick="location.hash='lot?${i}'">${i}</a> ${account.info.bids[i]}<br>`;
            }
            return /*html*/`
                <div class="wallet__label">Wallet Address:</div>
                <div class="wallet__address"  onclick="copyText('${provider.provider.selectedAddress}')">${provider.provider.selectedAddress}</div>
                <div class="wallet__label">Balance:</div>
                <div class="wallet__attribute" id="balBox"></div>
                <div class="wallet__attribute" id="bidList"></div>
                <div class="wallet__label">Wallet ENS Name:</div>
                <div class="wallet__attribute">None Claimed</div>
                <div class="wallet__label">Network:</div>
                <div class="wallet__attribute">${n}</div>
                <div class="wallet__label">Provider:</div>
                <div class="wallet__attribute">${provider.connection.url}</div>
                <div class="wallet__label"></div>
                <div id="qrcode"></div>
        
            `;
        }catch(e){
           //console.log(e);
            return `Account info could not be located`;

        }
    },
    loading: (m)=>{
        //let x=m?m:'';
        return `
            <div id="loader">
            <img src="images/loader.gif"></img>
            </div>
        `
    },
    collection:async()=>{
        account.loadCollection()
        return elements.loading();
    
    },
    auction:()=>{
        return `
            You currently have no lots up for auction:<br>
            <div style="color:var(--color4);">Create new lot</div>
        `
    },
    connect:()=>{
        let r;
        r=/*html*/`
            <h1 style="margin:64px 1% 0">Connect</h1>   
            <div class="br" id="connectionMethod" style="width:64px;float:left;margin:64px calc(98% - 64px) 64px 1%;"></div>
            <p style="font-size:12px">Illust Space, a web3.0 application, uses a crypto wallet for buying, selling, and trading augmented reality art. Your account is tied to your wallet. Please select one of the three options below: Torus (on the left), an existing Web3.0 Provider (middle), or an existing Private Key. Torus is an easy to use service for creating your first crypto wallet using an existing email, facebook account, or other online authentication services. Select Web3.0 if you already have a provider on your browser such as MetaMask or Coinbase Wallet; Illust Space does not have access to your private keys, please keep your private key information to yourself as this is highly sensitive information.    
            <div class="flex">
                    <div class="loginOption__wrapper" onclick="(async()=>{await localStorage.setItem('provider','torus');account.login();})()">
                        <img class="loginOption__image" src="assets/torus.svg" />
                        <div class="br"></div>
                        <b id="torusBox">Connect with Torus</b>
                    </div>
                    <div class="loginOption__wrapper" onclick="localStorage.setItem('provider','web3');account.login();clearInterval(torInt);changePage();">
                        <img class="loginOption__image" src="assets/metamask.png" />
                        <div class="br"></div>
                        <b>Connect with Web3 Provider</b><br><br>
        `
        if(window.ethereum){
            r+= "<p style='font-size:10px'>Web3 Browser Detected</p>";
        }else{
            r+= "<p style='font-size:10px'>No Web3 Browser Detected</p>";
        }
        r+=`
                    </div>
                    <!--<div onclick="alert('This method of connection is not currently available')"><img src="assets/key.svg" /><div class="br"></div><b>Connect with key</b></div>-->
                </div>
            `
        torInt = setInterval(changeAuth, 2000);
        return r;
    },
    sellAsset(){
        let date=new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString().split('.')[0]
       //console.log(date)
        return /*html*/`
            <h2>Create Auction</h2>
            <form>
                <label class="auction__label">End Date</label>
                <input class="auction__input" id="js-end_date" type="datetime-local" value="${date}"/>
                <label class="auction__label">Reserve</label>
                <input class="auction__input" id="js-start_price" type='number' step='0.002' value='0.0000' /> 
                <div class="button" onclick="market.beginAuction()">Begin Auction</div>
            </form>
            <a onclick="changePage()">Cancel</a>

        `
    },
    updateTagUrl:(tagQuery) => {
        let newUrl = '#market?tags=' + tagQuery.value
       //console.log(tagQuery)
        window.location.hash = newUrl;
    },
    shareSheet:(link, el) => {

        //add current url to value of hidden input field and copy it
        let shareValue = document.getElementById('js-share')
        shareValue.style.display = "inline-block"
        shareValue.value = link;
        
        shareValue.select()
        shareValue.setSelectionRange(0, 99999); /* For mobile devices */

        document.execCommand("copy");

        //show and hide tooltip that text was copied
        let tooltip = el.getElementsByClassName("h-tooltip")[0]
        tooltip.style.opacity = 0.95;
        setTimeout( () => tooltip.style.opacity = 0, 3000 )

   
    },
    homeButton:`
        <div class="button" onmousedown="location.hash=''">
            HOME
        </div>
    `
}