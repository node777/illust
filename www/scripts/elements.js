var elements = {
    pages:{
        default: ()=>{
            return elements.pages.winners2();
        },
        market(p){
            var request = new XMLHttpRequest(); 

            request.onreadystatechange = async function() {
                if (request.readyState === 4) {
                    let r=``;
                    let marketHeaderFilter = ``;
                    let headerHTML = ``;
                    let tagCloudHTML = ``;
                    assets.tokens=JSON.parse(request.response)
                    let m={};
                    let tagCloudArr = [];


                    // return list of all used tags 
                    // this should not be done client side
                    for (a in assets.tokens){
                        if (assets.tokens[a].tags){
                            let eachTag = assets.tokens[a].tags.split(" ")
                            for(tags in eachTag){
                                if (!tagCloudArr.includes(eachTag[tags])){
                                    tagCloudArr.push(eachTag[tags])
                                    tagCloudHTML +=/*html*/`<option value="${eachTag[tags]}">${eachTag[tags]}</option>`
                                }
                            }
                        }
                    }
                    //check tag search parameter
                    if(p[1]){

                        let p1=p[1].split("=")
                        if(p1[0]=="creator"){
                            let creators=p1[1].split("&");
                            for(a in assets.tokens){
                                //\check if asset has tags 
                                
                                let creator=assets.tokens[a].creator||"Illust"
                                console.log(creator, creators)
                                if(creator.toLowerCase()==(creators[0]).toLowerCase()){
                                    m[a]=assets.tokens[a];
                                    marketHeaderFilter = /*html*/`<div class="market__filterHeading">: ${creator}</div>`
                                }
                            }
                        }
                        else if(p1[0]=="tags"){
                            let tags=p1[1].split("&");
                            for(a in assets.tokens){
                                //check if asset has tags 
                                if(assets.tokens[a].tags){
                                    let assetTags=assets.tokens[a].tags.split(" ")
                                    //console.log(a,assetTags)
                                    if(assetTags.includes(tags[0])){
                                        marketHeaderFilter = /*html*/`<div class="market__filterHeading">: ${tags}</div>`
                                        //console.log(assets.tokens[a])
                                        m[a]=assets.tokens[a];
                                    }
                                }
                            }
                        } 
                        else if(p1[0]=="featured"){
                            // let featured=p1[1].split("&");
                            for(a in assets.tokens){
                                //check if asset is featured 
                                if(assets.tokens[a].featured){
                                    m[a]=assets.tokens[a];
                                }
                            }
                        } else {
                            marketHeaderFilter = /*html*/`<img class="market__bannerImage" src="https://app.illust.space/images/doom4.png"/>`
                            m=assets.tokens
                        }
                    }
                    else{
                        marketHeaderFilter = /*html*/`<img class="market__bannerImage" src="https://app.illust.space/images/doom4.png"/>`
                        m=assets.tokens
                    }

                    //scope variables
                    let colItemModelUrl
                    let colItemName
                    let colItemDesc
                    let colItemCreator
                    let colItemEndDate

                    for(a in m){
                        console.log(m[a])
                        let name;
                        let vars="";
                        let endDatePretty = ""
                        if (m[a].end_date) {
                            endDatePretty = m[a].end_date.toLocaleString();
                            console.log(endDatePretty)
                        }
                        for(v in m[a]){
                            if(v=="animation_url"){
                                colItemModelUrl = m[a][v]
                            }else if(v=="name"){
                                colItemName=m[a][v]
                            }else if(v=="description"){
                                colItemDesc =m[a][v]
                            }else if(v=="creator"){
                                colItemCreator = m[a][v]
                            }else{
                                //vars+=`${v}: ${m[a][v]}<br>`
                            }
                        }
                        console.log(m[a].price)
                        r+=/*html*/`
                            <div class='market__collectionItem'>
                                <div class="collectionItem__wrapper">
                                    <h3 class="collectionItem__artist">
                                        ${colItemCreator || 'Illust'}
                                    </h3>

                                    <div class="collectionItem__modelViewerWrapper">
                                        <model-viewer disable-zoom ar ios-src="assets/models/.usdz" src="${colItemModelUrl}" auto-rotate camera-controls alt="Chair" background-color="#455A64"></model-viewer>
                                        <a class="collectionItem__facePreview"  href="https://app.illust.space/ar/faces.html#${a}">🎭</a>
                                    </div>
                                    <div class="collectionItem__attributes" onclick="location.hash = 'asset?${a}'">
                                        <h3 class="collectionItem__title">${colItemName}</h3>
                                        <div class="collectionItem__link" id="view_${a}">MORE</div>
                                        <div class="collectionItem__price">${m[a].price + ' ETH' || "not for sale"}</div>
                                    </div>
             
                                </div>
                            </div>
                            `
                        //r+=a
                    }

                    headerHTML+=/*html*/`
                        <div class="market__banner">
                            <h1 class="market__heading">Market</h1>
                            ${marketHeaderFilter}
                            <nav>
                                <ul class="subhead__nav" >
                                    <li class="subhead__navItem"><a href="#market">Live</a></li>
                                    <li class="subhead__navItem"><a href="">Price</a></li>
                                    <li class="subhead__navItem"><a href="#market?featured">Featured</a></li>
                                    <li class="subhead__navItem">
                                    <select class="subhead__tagSelect" onChange="elements.updateTagUrl(this)" name="tag filter">
                                        <option disabled selected value>Tags</option>
                                    ${tagCloudHTML}
                                    </select></li>
                                </ul>
                        
                                
                            </nav>
                        </div>
                  
                    `
                              
                        // <div id="searchOptions" class="flex">
                        //     <div style="font-size:22px">
                        //         Sort by:
                        //         <select style="font-size:22px" name="sortBy" id="sortBy">
                                    
                        //             <option default value="">Default</option>
                        //             <option value="">Price</option>
                        //             <option value="">Name</option>
                        //             <option value="">Latest</option>
                        //         </select>
                        //         <br>
                        //         Ar Type
                        //         <select style="font-size:22px" name="arType" id="arType">
                        //             <option value="any">Any</option>
                        //             <option value="wearable">Wearable</option>
                        //             <option value="environmental">Wearable</option>
                        //             <option value="sculpture">Sculpture</option>
                        //         </select>
                        //     </div>
                        // </div>

                    document.getElementById("js-listings").innerHTML=r;
                    document.getElementById("js-marketHeader").innerHTML=headerHTML;

                    for(a in m){
                        let assetData=await assets.invokeERC("getData", a);
                        let owner=await assets.invokeERC("getOwner", a);
                        console.log(owner)
                        if(owner.toLowerCase()==provider.provider.selectedAddress.toLowerCase()){
                            document.getElementById(`view_${a}`).innerHTML="Edit/Sell Asset"
                        }
                        // document.getElementById(`owner_${a}`).innerHTML="Owner: "+owner;
                        //console.log(assetData[0])
                    }
                }
            }
            request.open("GET", "https://us-central1-illust.cloudfunctions.net/metadata");
            request.send();
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
                    console.log(m);
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
                                <input id="recipient1" placeholder="Fee recipient 1" />
                                <input id="recipient2" placeholder="Fee recipient 2" />
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
                    console.log(m);
                    console.log(assetData)
                    if(assetData==undefined){
                        assetData={};
                    }
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
                            Add animation_url (.gltf file)
                            <div class="button" onclick="window.open('https://gofile.io/uploadFiles', '_blank');/*addField('animation_url');*/">Upload .gltf on Gofile</div>
                        </div>
                        <div class="box">
                            Begin Auction
                            <input id="auction_starting_bid" placeholder="Starting Bid"></input>
                            Auction Close Time:
                            <input id="auction_close" type="datetime-local"></input>
                            <div class="button" onclick="auction.beginAuction()">Begin Auction</div>
                        </div>
                        <div class="box">
                            Add custom field
                            <input id="fieldName" placeholder="Field Name"></input>
                            <div class="button" onclick="addField(${a[1]})">add field</div>
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
                        <div class="button w5" onclick="location.hash='asset2?15656630424036753581450935940596632215884383929372546170587529153151943392229'">View Collection</div>
                        
                    </div>
                    <div>
                        <h1>MF-10</h1>   
                        <div class="br" style="float:left;width:64px;"></div>

                        <model-viewer ar ios-src="assets/models/70937556211959927769088791688503419832872233678974511813637293239899188185264.usdz" src="assets/models/70937556211959927769088791688503419832872233678974511813637293239899188185264.gltf" style="position:relative;" auto-rotate camera-controls alt="Ain" background-color="#455A64"></model-viewer>

                        Winner: Betosk8s
                        <div class="button w5" onclick="location.hash='asset2?70937556211959927769088791688503419832872233678974511813637293239899188185264'">View Collection</div>
                        
                    </div>
                    <div>
                        <h1>MF-11</h1>
                        <div class="br" style="float:left;width:64px;"></div>

                        <model-viewer ar ios-src="assets/models/8456350751317975846800924683986100177337207567287562046240586730923411985742.usdz" src="assets/models/8456350751317975846800924683986100177337207567287562046240586730923411985742.gltf" style="position:relative;" auto-rotate camera-controls alt="Ain" background-color="#455A64"></model-viewer>

                        Winner: kingvanilli
                        <div class="button w5" onclick="location.hash='asset2?8456350751317975846800924683986100177337207567287562046240586730923411985742'">View Collection</div>
                        
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
            console.log(i, a, p);
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
        asset:async(a)=>{
            await account.load()
            await account.load()
            var request = new XMLHttpRequest(); 
            request.onreadystatechange = async function() {
                if (request.readyState === 4) {
                    if(!request.response){
                        return `Asset could not be found <div class='button' onclick='location.hash=""'>Home</div>`
                    }
                    let m=JSON.parse(request.response);
                    console.log(m);
                    let b="<br>";
                    let name=m.name;
                    let hash=a[1];
                    let url=m["animation_url"];
                    let iPrice=m.price||0;
                    let auctionDetails=``;
                    let editionHTML = ``;

                    

                    //get description
                    let description=m.description||"";
                    console.log(await account.getData(57865929012439140487121611707503616067165767807057435719422353067939485468247) + ' hi')

                    //get edition
                    if(m.edition){
                        editionHTML+=/*html*/`<div class="lotAsset__attribute">Edition: ${m.edition}</div>`
                    }
                    if(m["ar_type"]){
                        description+=`<br><br><b>AR Type: ${m["ar_type"]}</b>`
                    }


                    let owner
                    try{
                        owner = await assets.invokeERC("getOwner", hash)
                    } catch {
                        owner = "owner not found"
                    }

                    //<a>Created by: <img style="width:70px; object-fit: cover;height:58px;margin-bottom:-25px" src="images/doom2.png"></img> DOOM</a><br><br>
                    console.log('owner after' + owner)
                    
                    //let auction=JSON.parse(await illustMarket("r", n[1]));

                    if(m["end_date"]){
                        console.log(m)
                        //setTimeout(auction.loadDate,1);
                        let endTime=new Date(m["end_date"]);
                        let timeNow=new Date(Date.now());
                        let endTimePretty = endTime.toLocaleString(); 

                        console.log(endTime.getTime(),timeNow.getTime())
                        auctionDetails+=/*html*/`
                            <div class="auction__label">This auction has ended</div>
                            <div class="auction__attribute">${endTimePretty}</div>
                            <div class="auction__label" >Top Bidder</div>
                            <div class="auction__attribute">${m["top_bidder"]}</div>
                            <label class="auction__label">Closing Price</label>
                            <div class="auction__attribute" id="priceBox">${m["price"]} ETH</div>
                        `
                        market.endTime=m["end_date"];
                        if(endTime.getTime()>timeNow.getTime()){
                            auctionDetails=/*html*/`
                                <div class="auction__label">Time Remaining</div>
                                <div class="auction__attribute" id="countdownBox"></div>
                                <div class="auction__label" >Current Bid</div>
                                <div class="auction__attribute" id="priceBox">${m["price"]} ETH</div>
                                <label class="auction__label">Place Bid</label>
                                <span>ETH</span>
                                <input id="js-bidAmount" style="margin:0;" type='number' step='0.002' value='${Number(m["price"])+0.2}'/>
                                <div class="button" onclick="market.bid()">Place Bid</div>
                                    
                                <div id="userBid"></div>
                            `
                        }
                    }else{
                        // // TEMP AUCTION INFO
           
                        // expected result
                        // "This asset is not for sale"

                   

                        //Live Auction
                        /*
                        <div class="auction__label">Time Remaining</div>
                        <div class="auction__attribute">00:34:00</div>
                        <div class="auction__label" >Current Bid</div>
                        <div class="auction__attribute">0.53 eth</div>
                        <label class="auction__label">Place Bid</label>
                        <input style="margin:0;" type='number' step='0.200000000000000000' value='0.0000' /> 
                        <div class="button" onclick="market.bid()">Place Bid</div>
                        <div class="auction__history">
                            <div class="auction__bidder">10:33 @bobbyBoy bid 0.56 eth</div>
                            <div class="auction__bidder">10:30 @carguy34 bid 0.50 eth</div>
                            <div class="auction__bidder">09:44 @somenad44 bid 0.46 eth</div>
                            <div class="auction__bidder">09:33 @somenad44 bid 0.46 eth</div>
                            <div class="auction__bidder">09:33 @somenad44 bid 0.46 eth</div>
                            <div class="auction__bidder">09:33 @somenad44 bid 0.46 eth</div>
                            <div class="auction__bidder">09:33 @somenad44 bid 0.46 eth</div>
                            <div class="auction__bidder">09:33 @somenad44 bid 0.46 eth</div>
                            <div class="auction__overlay"></div>
                        </div>
                        //   Auction Creation
                        <form>
                            <label class="auction__label">Start Date</label>
                            <input class="auction__input" id="js-start_date" type="datetime-local" value=""/>
                            <label class="auction__label"><span class="h-form-error">*Date must be after today </span>End Date</label>
                            <input class="auction__input" id="js-end_date" type="datetime-local" value=""/>
                            <label class="auction__label">Reserve</label>
                            <input class="auction__input" id="js-start_price" type='number' step='0.200000000000000000' value='0.0000' /> 
                            <div class="button" onclick="market.beginAuction()">Begin Auction</div>
                        </form>
                        */
                        auctionDetails+="This asset is not for sale"
                    }

                    if(owner.toLowerCase()==provider.provider.selectedAddress.toLowerCase()){
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
                                        <model-viewer class="lotAsset__model" ar  ios-src="assets/models/${hash}.usdz" src="${url}" auto-rotate camera-controls  alt="GreenMask"></model-viewer>
                                        <a class="collectionItem__facePreview"  href="https://app.illust.space/ar/faces.html#${a}">🎭</a>
                                    </div>
                                
                                    <div class="lotAsset__details">
                                        <h2 class="lotAsset__name">
                                            <a href="#market?creator=${m.creator||'Illust'}">${m.creator||'Illust'}</a>
                                        </h2>
                                        ${editionHTML}
                                        <div class="lotAsset__attribute">Owner: ${owner}</div> 
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
        asset2:async(a)=>{
            await account.load()
            var request = new XMLHttpRequest(); 
            request.onreadystatechange = async function() {
                if (request.readyState === 4) {
                    if(!request.response){
                        return `Asset could not be found <div class='button' onclick='location.hash=""'>Home</div>`
                    }
                    let m=JSON.parse(request.response);
                    console.log(m);
                    let b="<br>";
                    let name=m.name;
                    let hash=a[1];
                    let url=m["animation_url"];
                    let iPrice=m.price||0;
                    let assetDetails=`
                        Created by: ${m.creator||"Illust"}<br><br>
                        <a href="https://etherscan.io/token/0x40bd6c4d83dcf55c4115226a7d55543acb8a73a6?a=${hash}">Transaction History</a><br><br>
                    `;
                    
                    let owner=await assets.invokeERC("getOwner", hash);
                    assetDetails+=`Owner: ${owner}<br><br>`;
                    //<a>Created by: <img style="width:70px; object-fit: cover;height:58px;margin-bottom:-25px" src="images/doom2.png"></img> DOOM</a><br><br>
                    
                    
                    //let auction=JSON.parse(await illustMarket("r", n[1]));

                    if(m["end_date"]){
                        console.log(m)
                        //setTimeout(auction.loadDate,1);
                        let endTime=new Date(m["end_date"]);
                        let timeNow=new Date(Date.now());

                        console.log(endTime.getTime(),timeNow.getTime())
                        assetDetails+=`
                        
                            Top bidder: ${m["top_bidder"]}
                            <br><br>
                            <div id="startPriceBox">Start price: ${m["start_price"]}</div>
                            <br><br>
                        `
                    }else{
                        assetDetails+="This asset is not for sale"
                    }

    
                    document.getElementById("assetBox").innerHTML= `
                        <div id="lotBox">
                            <h1 style="margin:0">${name}</h1>
                            <div class="br" style="width:64px;float:left;margin:0;padding:0;"></div>
                            <div class="flex wrap w1">

                                <div style="text-align:center">
                                    <model-viewer ar  ios-src="assets/models/${hash}.usdz" src="${url}" auto-rotate camera-controls alt="GreenMask" background-color="#455A64" style="width:100%;height:43vw;"></model-viewer>
                                    <a style="font-size:30px" href="https://app.illust.space/ar/faces.html#${name}"><b>Try On</b></a>
                                </div>
                                
                                <div id="assetDetails" style="text-align:center">
                                    ${assetDetails}
                                </div>

                            </div>
                            <div class="w1">
                                ${m.description}<br><br>
                                2020 Hand modeled and hand illustrated AR NFT. Hashed mesh. Single edition - signed.
                                <br><br>
                                View on <a href="https://etherscan.io/token/0x40bd6c4d83dcf55c4115226a7d55543acb8a73a6?a=${hash}">Etherscan</a>
                                    <br>Single Edition
                                <!--
                                <div class="button w5" onclick="alert('This lot is not currently availible for purchase')">Watch</div>
                                <div class="button w5" onclick="alert('This lot is not currently availible for purchase')">Share</div>--><br><br>
                                If you'd rather place a bid through one of our auctioneers, please get in touch at  +1 (310) 294-8615 or you can also reach us on our <a href="https://discord.gg/98qqje5">discord</a>.
                            </div>
                        </div>
                        
                    `
                }
            }
            request.open("GET", `https://us-central1-illust.cloudfunctions.net/metadata/${a[1]}`);
            request.send();
            return `<div id="assetBox"></div>`
        },
        collections:()=>{
            return elements.DOOM2();
        },
        collection:(n)=>{
            if(n[1]=="DOOM"){
                return elements.DOOM();
            }else{
                return `
                    <div id="collectionBox">
                        <h1>Collection ${n[1]}</h1>
                        <br>
                        <model-viewer ar ios-src="assets/models/Aur.usdz" src="assets/Astronaut.glb" auto-rotate camera-controls alt="Chair" background-color="#455A64"></model-viewer>
                        Vivamus felis lectus, efficitur vitae porttitor tempor, sodales id tortor. Aliquam tempus eleifend ex eget condimentum. Donec ac dapibus augue. Donec ac suscipit tellus. Nam viverra sit amet tellus eu blandit. Proin sed sem quis arcu faucibus sodales ac condimentum lectus. Quisque lacinia vel turpis in feugiat. Maecenas hendrerit vulputate tempus. Nulla vel nulla varius, ultricies ligula quis, aliquam ligula. Curabitur scelerisque feugiat ligula, tristique dignissim risus efficitur non. Morbi vitae mi et nibh rutrum ultrices a a velit. Aliquam erat volutpat. Nulla in nulla vulputate, tincidunt risus quis, accumsan ipsum.
                    </div>
                    
                `
            }
        },
        admin:async()=>{
            return `
                <h1>Admin Panel</h1>
                <div class="box">
                    Data Output:<br>
                    <div id="data"></div>
                </div>
                <model-viewer style="margin:auto;height:30vh;position:relative" ar ios-src="assets/models/green.usdz" src="assets/models/green.gltf" auto-rotate camera-controls alt="Chair" background-color="#455A64"></model-viewer>

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
            console.log(p);
            try{
                
                return `
                    
                <model-viewer ar ios-src="assets/models/${p[1]}.usdz" src="assets/models/${p[1]}.gltf" onError="this.onerror=null;this.src='assets/models/${p[1]}.glb';" auto-rotate camera-controls alt="Ain" background-color="#455A64"></model-viewer>

                `
            }catch(e){
                return `
                    
                <model-viewer ar ios-src="assets/models/${p[1]}.usdz" src="assets/models/${p[1]}.glb" onError="this.onerror=null;this.src='assets/models/${p[1]}.gltf';" auto-rotate camera-controls alt="Ain" background-color="#455A64"></model-viewer>

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
    sidebar:`
        <div onclick=""><a href="https://illust.space">Exhibitions</a></div>
        <div><a href="https://illust.space/about">About</a></div>

        <div class="br"></div>

        <div onclick="location.hash='';sidebar(1);">Auctions</div>
        <div onclick="location.hash='account';sidebar(1);">Account</div>

        <div class="br"></div>
        
        <div onclick=""><a href="https://illust.space/faq">FAQ</a></div>
        <div onclick=""><a href="https://illust.space/privacy-policy">Privacy</a></div>
        <div><a href="https://illust.space/user-agreement">User Agreement</a></div>
        <div onclick=""><a href="https://illust.space/terms-of-service">Terms of Service</a></div>
        <div><a href="https://illust.space/contact">Contact</a></div>
    `,
    footer:`
    ©copyleft 2020
    `,
    createAccount:()=>{
        try{
            return /*html*/`
                <div class="popup">
                    Welcome to Illust Space:<br>
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
                    <div  class="button" onclick="account.create()">Create Account</div>
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
        
        console.trace(provider);
        if(provider&&provider.provider&&provider.provider.selectedAddress!=null&&provider.provider.selectedAddress!=undefined){
            //console.log(provider.provider.selectedAddress);
            let a;
            let b;
            if(account.info&&account.info.username){
                console.log("Got Acc info", account.info);
                a= await elements.profileInfo();
                var profileAssets = await elements.profileAssets()
                b=account.info.username; 
                console.log(a, profileAssets);
                r=/*html*/`
                    <div class="h-flex">
                        <div id="accountContent" class="accountContent__wrapper">
                            <h1 style="text-align:left">ACCOUNT INFO</h1>
                            <div class="br" style="width:64px;float:left;margin:16px calc(98% - 64px) 32px 1%;"></div>
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
                console.log("Loading Acc info");
                account.login();
                //a= await elements.profileInfo();
                
                r=elements.loading();
            }
        }else{
            console.log("No provider");
            if(localStorage.userInfo){
                console.log("User found");
                account.login();
            }else{
                console.log("No user could be found")
                r=elements.connect();
            }
        }
        // }catch(e){
        //     r=elements.connect();
        //     console.log(e);
        // }
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
                console.log(e);
            }
            if(account.info){
                b=account.info.username;
                e=account.info.email;
                fn=account.info.firstname;
                ln=account.info.lastname;
            }
            let c=elements.collection();
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
            console.log(e);
            return `Account info could not be located`;

        }
    },
    profileAssets:async()=>{
        let c=elements.collection();
        console.log(c);

        return /*html*/`
            <div>
                <div class="profileAssets__header">
                    <div id="cl" class="js-profileHeaderItem profileAssets__headerItem profileAssets__headerItem--current" onclick="account.selectHeader(this);document.getElementById('js-profileContents').innerHTML=elements.collection()">Collection<br><br></div>
                    <div id="vw" class="js-profileHeaderItem profileAssets__headerItem"  onclick="account.selectHeader(this);account.wallet();">view Wallet<br><br></div>
                    <div  class="js-profileHeaderItem profileAssets__headerItem"  onclick="location.hash = '#market'">Auctions<br><br></div>

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
                console.log(e);
            }
            if(account.info){
                b=account.info.username;
                e=account.info.email;
                fn=account.info.firstname;
                ln=account.info.lastname;
            }
            let c=elements.collection();
            return /*html*/`
                <div id="js-profileInfo" class="profileInfo" >
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
            console.log(e);
            return `Account info could not be located`;

        }
    },
    walletInfo:async()=>{
        try{
            setTimeout(()=>{new QRCode(document.getElementById("qrcode"), provider.provider.selectedAddress)}, 1000);
            setTimeout(()=>{account.getBal()}, 100);
            let b="";
            for(i in account.info.bids){
                console.log(i, account.info.bids[i]);
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
            console.log(e);
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
    collection:()=>{
        if(account.info.collection){
            let r=/*html*/`<div class='profileAssets__collectionItem'>`
            
            for(i in account.info.collection){
                r+=/*html*/`
                    <div class="collectionItem__wrapper">
                        <div class="collectionItem__modelViewerWrapper">
                            <model-viewer ar ios-src="assets/models/${i}.usdz" src="assets/models/${i}.gltf" auto-rotate camera-controls alt="Chair" background-color="#455A64"></model-viewer>
                            <a class="collectionItem__facePreview"  href="https://app.illust.space/ar/faces.html#${i}">🎭 Try On</a>
                        </div>
                        <div class="collectionItem__attributes">
                            <h3 class="collectionItem__title">${account.info.collection[i]}</h3>
                            <a class="collectionItem__link" onclick="location.hash = 'asset?${i}'">more</a>
                            <a class="collectionItem__artist" href="">Artist Name</a>
                        </div>
                        
                    </div>`
                
            }
            r+="</div>"
            return r;
        }
        else{
            return /*html*/`
                <span>You have no collection: <a href="#market" style="color:var(--color4);">Start Collecting</a></span>
                
            `
        }
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
                    <div class="loginOption__wrapper" onclick="localStorage.setItem('provider','torus');account.login();">
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
    DOOM:()=>{
        
        return `
            <h1 style="margin:64px 1% 0">MF DOOM COLLECTION</h1>   
            <div class="br" style="width:64px;float:left;margin:64px calc(98% - 64px) 64px 1%;"></div>
            <br>
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
            <div class="w1" style="background-image:url('images/doom2.png'); height:50vw; margin:-10vw 0 -15vw 0;background-size:40%;background-repeat:no-repeat;background-position:50% 0"></div>
            <div class="flex  wrap w1">
                <div class="flex wrap w1">
                    <div style="">
                        <h1>Lot 90007</h1>
                        <div class="br" style="float:left;width:64px;"></div>
            

                        <model-viewer ar ios-src="assets/models/green.usdz" src="assets/models/green.glb" style="position:relative;" auto-rotate camera-controls alt="Ain" background-color="#455A64"></model-viewer>


                        <div class="button w5" onclick="location.hash='lot?90007'">Place Bid</div>
                        
                    </div>
                    <div>
                        <h1>Lot 90008</h1>
                        <div class="br" style="float:left;width:64px;"></div>

                        <model-viewer ar ios-src="assets/models/blue.usdz" src="assets/models/blue.glb" style="position:relative;" auto-rotate camera-controls alt="Ain" background-color="#455A64"></model-viewer>

                        <div class="button w5" onclick="location.hash='lot?90008'">Place Bid</div>
                        
                    </div>
                </div>
                <div>
                    <h1>MF DOOM</h1>
                    Halloween Collection Volume One<br><br>

                Till the end of days he will be the ill Doomsayer… The days are strung up on that cross-quarter half light, Samhain, All souls - Halloween. And as the darkness draws in and the evenings give way to fire-spit crackle; long shadowed children (perhaps wearing masks on top of masks) search for plague free treats. In a period of seasonal shift, the prophet of doom always sounds louder, perhaps it is the cold slowing atoms, amplifying rhymes - perhaps it really is the end times. Time will tell. But a mask is suddenly far more desirable and if the streets are infected we can provide a panacea. Drawing on the golden age comic inspiration of the original Metal Face, the first Halloween auction consists of two extremely limited hand crafted masks, redolent of the original Dr (he of namesake and tentacle) they reflect the two aspects - shadow and growth. Hand drawn textures conjure comic pages, upturned eyes assure you that they are still something that the baddest villain of them all would wear apocalypse or not.
                    </div>
            </div>
        `
    },
    DOOM2:()=>{
        return `
            <h1 style="margin:64px 1% 0">MF DOOM COLLECTION 2</h1>   
            <div class="br" style="width:64px;float:left;margin:64px calc(98% - 64px) 64px 1%;"></div>
            <br>
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
                    <h2>Auction closes</h2>
                    October 30th 2020 6:00pm PDT
                </div>
                <div>
                    <h2>Auction</h2>
                    Limited Run NFT AR Pieces
                </div>
            </div>
            <div class="w1">
                <div class="w1" style="background-image:url('images/doom2.png'); height:50vw; margin:-11vw 0 -20vw;background-size:40%;background-repeat:no-repeat;background-position:50% 0"></div>

                <div class="flex wrap w1" style="margin-bottom:180px;">
                    <div>
                        <h1>Lot MF-09</h1>
                        <div class="br" style="float:left;width:64px;"></div>

                        <model-viewer ar ios-src="assets/models/15656630424036753581450935940596632215884383929372546170587529153151943392229.usdz" src="assets/models/15656630424036753581450935940596632215884383929372546170587529153151943392229.gltf" style="position:relative;" auto-rotate camera-controls alt="Ain" background-color="#455A64"></model-viewer>

                        <div class="button w5" onclick="location.hash='lot?609'">Place Bid</div>
                        
                    </div>
                    <div>
                        <h1>Lot MF-10</h1>
                        <div class="br" style="float:left;width:64px;"></div>
                        <model-viewer ar ios-src="assets/models/70937556211959927769088791688503419832872233678974511813637293239899188185264.usdz" src="assets/models/70937556211959927769088791688503419832872233678974511813637293239899188185264.gltf" style="position:relative;" auto-rotate camera-controls alt="Ain" background-color="#455A64"></model-viewer>
                        <div class="button w5" onclick="location.hash='lot?610'">Place Bid</div>
                        
                    </div>
                    <div style="">
                        <h1>Lot MF-11</h1>
                        <div class="br" style="float:left;width:64px;"></div>
            

                        <model-viewer ar ios-src="assets/models/8456350751317975846800924683986100177337207567287562046240586730923411985742.usdz" src="assets/models/8456350751317975846800924683986100177337207567287562046240586730923411985742.gltf" style="position:relative;" auto-rotate camera-controls alt="Ain" background-color="#455A64"></model-viewer>


                        <div class="button w5" onclick="location.hash='lot?611'">Place Bid</div>
                        
                    </div>
                </div>
                <div>
                    <h1>MF DOOM</h1>
                    Halloween Collection Volume Two<br><br>

                Till the end of days he will be the ill Doomsayer… The days are strung up on that cross-quarter half light, Samhain, All souls - Halloween. And as the darkness draws in and the evenings give way to fire-spit crackle; long shadowed children (perhaps wearing masks on top of masks) search for plague free treats. In a period of seasonal shift, the prophet of doom always sounds louder, perhaps it is the cold slowing atoms, amplifying rhymes - perhaps it really is the end times. Time will tell. But a mask is suddenly far more desirable and if the streets are infected we can provide a panacea. Drawing on the golden age comic inspiration of the original Metal Face, the first Halloween auction consists of two extremely limited hand crafted masks, redolent of the original Dr (he of namesake and tentacle) they reflect the two aspects - shadow and growth. Hand drawn textures conjure comic pages, upturned eyes assure you that they are still something that the baddest villain of them all would wear apocalypse or not.
                    </div>
            </div>
        `
    },
    sellAsset(){
        let date=new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString().split('.')[0]
        console.log(date)
        return /*html*/`
            <h2>Create Auction</h2>
            <form>
                <label class="auction__label">End Date</label>
                <input class="auction__input" id="js-end_date" type="datetime-local" value="${date}"/>
                <label class="auction__label">Reserve</label>
                <input class="auction__input" id="js-start_price" type='number' step='0.002' value='0.0000' /> 
                <div class="button" onclick="market.beginAuction()">Begin Auction</div>
            </form>
            <a href="javascript(void)" onclick="changePage()">Cancel</a>

        `
    },
    updateTagUrl:(tagQuery) => {
        let newUrl = '#market?tags=' + tagQuery.value
        console.log(tagQuery)
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