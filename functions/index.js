const { urlencoded } = require('body-parser');
const functions = require('firebase-functions');
const { object } = require('firebase-functions/lib/providers/storage');
const ethers = require('ethers');
var admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const { request } = require('express');

const metadataAPI = express();
const userAPI = express();
const auctionAPI = express();

// Automatically allow cross-origin requests
metadataAPI.use(cors({ origin: true }));
userAPI.use(cors({ origin: true }));
auctionAPI.use(cors({ origin: true }));

admin.initializeApp({
    apiKey: "AIzaSyCfNihdvP4epfuQFdcCRYoIdGIYlonTaPY",
    authDomain: "illust-b87a1.firebaseapp.com",
    databaseURL: "https://illust-b87a1.firebaseio.com",
    projectId: "illust",
    storageBucket: "illust.appspot.com",
    messagingSenderId: "883554071356",
    appId: "1:883554071356:web:e5b37c5bf5f79be723e439",
    measurementId: "G-VBJ7RSFPZL"
  });

var db = admin.database();
  

let adminAddress='0x9CBD55532935ff709B17039C369D5C03d41F2dC4'

metadataAPI.get('/', (req, res) => {
    var ref = db.ref(`assets`);
        
    ref.on("value", function(snapshot) {
        res.send(snapshot.val());
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        res.send("The read failed: " + errorObject.code);
    });
});
metadataAPI.get('/:a', (req, res) => {
    var ref = db.ref(`assets/${req.params.a}`);
        
    ref.on("value", function(snapshot) {
        res.send(snapshot.val());
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        res.send("The read failed: " + errorObject.code);
    });
});
metadataAPI.post('/edit/:a/:s', async(req, res) => {
    
        var ref = db.ref(`assets/${req.params.a}`);
        console.log(req.params.s),
        console.log(ethers.utils.verifyMessage("update asset",req.params.s),adminAddress);
        try{
            if(ethers.utils.verifyMessage("update asset",req.params.s).toLowerCase()==adminAddress.toLowerCase()){
                await ref.set(
                    JSON.parse(req.body)
                );
                res.send("asset updated successfully");
            }else{
                res.send("Plese login as Illust Admin (illust contracts)");
            }
        }catch(e){
            res.send(`got error ${e}`);
        }

});
//userAPI
var authTokens={}
userAPI.get('/username/:u', (req, res) => {
    
    var ref = db.ref(`users/${req.params.u}`);
            
    ref.once("value", function(snapshot) {
        let info=snapshot.val();
        if(info==null){
            res.send(false);
        }else{
            res.send(snapshot.val().username);
        }
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        res.send(false);
    });
});
userAPI.get('/:u', (req, res) => {
    authTokens[req.params.u] = ethers.BigNumber.from(ethers.utils.randomBytes(32))._hex;
    res.send(authTokens[req.params.u]);
});
userAPI.get('/:u/:sig', (req, res) => {
    try{
        let address = ethers.utils.verifyMessage(`illust login ${authTokens[req.params.u]}`, req.params.sig);
        //verify sig
        let qAddress=req.params.u;
        // console.log(address, req.params.u, req.params.sig||"no sig");
        if(address.toLowerCase()==qAddress.toLowerCase()){
            //ref database
            var ref = db.ref(`users/${req.params.u}`);
            
            ref.on("value", function(snapshot) {
                let info=snapshot.val();
                if(info==null){
                    res.send("no account");
                }else{
                    res.send(snapshot.val());
                }
            }, function (errorObject) {
                console.log("The read failed: " + errorObject.code);
            });
        }else{ res.send(false)};
    }catch(e){
        console.log(e)
        res.send("Could not verify signature")
    }
});
userAPI.post('/:u/:sig', (req, res) => {
    try{
        let address = ethers.utils.verifyMessage("illust account edit", req.params.sig);
        //verify sig
        console.log(address, req.params.u, req.params.sig||"no sig");
        if(address.toLowerCase()==req.params.u.toLowerCase()){
            var ref = db.ref(`users/${req.params.u}`);
            
            ref.set(
                JSON.parse(req.body)
            );
        }else{ res.send("signature could not be verified")};
    }catch(e){
        console.log(e)
        res.send("Could not verify signature")
    }
});

exports.metadata = functions.https.onRequest(metadataAPI);
exports.users = functions.https.onRequest(userAPI);







//const hydra=require("./hydra-chain.js");
//const illustGenisis=require("./illust.genisis.block.js");

//hydra.create("illustMarket", illustGenisis);

//console.log(hydra.chains.illustMarket);

//let provider = ethers.getDefaultProvider('homestead');
let provider = ethers.getDefaultProvider('ropsten');

var ERCabi = [
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
//MAINNET ADD
//var ERCaddress = '0x40bd6c4d83dcf55c4115226a7d55543acb8a73a6';
var ERCaddress = '0xa81ff27ed54f95a637c5a8c48ae0d993139f4ed2';
var ERCcontract = new ethers.Contract(ERCaddress, ERCabi, provider);
ERCcontract=ERCcontract.connect(provider);
auctionAPI.get('/:q', (req, res) => {
    var r = hydra.query("illustMarket", req.params.q, req.params.args);
    return res.send(r);
});

auctionAPI.post('/chains/:chain/invoke/:invoke/:args?', (req, res) => {
    var r = hydra.invoke(req.params.chain, req.params.invoke, req.body);
    return res.send(r);
});

auctionAPI.post('/sell', async(req, res) => {
    let m=JSON.parse(req.body)
    var assetOwner = await ERCcontract.ownerOf(m.message.asset);
    let messageSigner=ethers.utils.verifyMessage(JSON.stringify(m.message), m.sig);

    if(messageSigner.toLowerCase()==assetOwner.toLowerCase()){
        var ref = db.ref(`assets/${m.message.asset}`);
        ref.once("value", (snapshot)=>{
            let s=snapshot.val()
            ref.child("currentAuction").set(s.currentAuction++||1)
        });
        var updates = {};
        updates['/top_bidder'] = assetOwner;
        updates['/price'] = m.message["start_price"];
        updates['/start_price'] = m.message["start_price"];
        updates['/end_date'] = m.message["end_date"];

        ref.update(updates);
                
        res.send("Item successfully listed")
    }else{
        res.send("Item NOT successfully listed, Signature invalid")
    }
});

auctionAPI.post('/bid', async(req, res) => {
    let m=JSON.parse(req.body)
    //if(m)
    console.log(m)
    
    let messageSigner=ethers.utils.verifyMessage(JSON.stringify(m.message), m.sig);
    
    
    var ref = db.ref(`assets/${m.message.asset}`);
    ref.once("value", (snapshot)=>{
        let s=snapshot.val()
        console.log(s);
        if(Number(m.message.amount)>Number(s.price)){
            var userRef = db.ref(`users/${messageSigner}/bids/${m.message.asset}`);
            userRef.set(m.message.amount);
            var updates = {};
            updates['/price'] = m.message["amount"];
            updates['/top_bidder'] = messageSigner;

            ref.update(updates);
                    
            res.send("Bid successfully placed")
        }else{
            res.send(`Bid not placed, please bid more than ${s.price} ETH`)
        }
    });
});

exports.market = functions.https.onRequest(auctionAPI);
