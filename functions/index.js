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
            
        await ref.set(
            JSON.parse(req.body)
        );
        
        res.send("asset updated successfully");
    
});
//nonce
var userKEYS={}
userAPI.get('/:u', (req, res) => {
    res.send(req.params.u);
});
userAPI.get('/:u/:sig', (req, res) => {
    try{
        let address = ethers.utils.verifyMessage("illust login", req.params.sig);
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
        }else{ res.send("signature could not be verified")};
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







const hydra=require("./hydra-chain.js");
const illustGenisis=require("./illust.genisis.block.js");

hydra.create("illustMarket", illustGenisis);

console.log(hydra.chains.illustMarket);

auctionAPI.get('/:q', (req, res) => {
    var r = hydra.query("illustMarket", req.params.q, req.params.args);
    return res.send(r);
});


auctionAPI.post('/chains/:chain/invoke/:invoke/:args?', (req, res) => {
    var r = hydra.invoke(req.params.chain, req.params.invoke, req.body);
    return res.send(r);
});

exports.auctions = functions.https.onRequest(auctionAPI);

// Automatically allow cross-origin requests
//functions.use(cors({ origin: true }));
/*
exports.queryUser = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        //functions.logger.info("Hello logs!", {structuredData: true});
        let r=Object.keys(req.query)[0];
        if(users[r]){
            res.send(users[r].username);
        }else{
            res.send(`No User ${r} could be located`);
        }
        console.log();
    });

});
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
*/

// userAPI.get('/', (req, res) => {
//     // var ref = db.ref("users");
//     // ref.on("value", function(snapshot) {
//     //     console.log(snapshot.val());
//     //   }, function (errorObject) {
//     //     console.log("The read failed: " + errorObject.code);
//     // });
// });
// exports.user = functions.https.onCall((data, context) => {
//     console.log(data);
//     try{
//         admin.database().ref('/dele').push({
//             testuser: "testmsg"
//         }).then(() => {
//              console.log(data);
//             let address = ethers.utils.verifyMessage(JSON.stringify(data.message), data.signature);
//             console.log(address);
//             // Returning the sanitized message to the client.
//             return "No User could be located";
//         });
//     }catch(e){
//         console.log(e);
//         return "No User could be located";
//     }
// });
// exports.editUser = functions.https.onCall((data, context) => {
//     console.log(data);
//     try{
//         admin.database().ref('/dele').push({
//             testuser: "testmsg"
//         }).then(() => {
//              console.log(data);
//             let address = ethers.utils.verifyMessage(JSON.stringify(data.message), data.signature);
//             console.log(address);
//             // Returning the sanitized message to the client.
//             return "No User could be located";
//         });
//     }catch(e){
//         console.log(e);
//         return "No User could be located";
//     }
// });
// exports.editMetadata = functions.https.onCall((data, context) => {
//     console.log(data);
//     try{
//         admin.database().ref('/dele').push({
//             testuser: "testmsg"
//         }).then(() => {
//              console.log(data);
//             let address = ethers.utils.verifyMessage(JSON.stringify(data.message), data.signature);
//             console.log(address);
//             // Returning the sanitized message to the client.
//             return "No User could be located";
//         });
//     }catch(e){
//         console.log(e);
//         return "No User could be located";
//     }
// });
// exports.metadata = functions.https.onRequest((req, res) => {
//     try{
//         let r=req.url.split("/")[1]
//         console.log(r)
//         //console.log(r);
//         if(r){
//             res.send( getAsset(r));
//         }else{
//             var assetList={};
//             for(a in assets){
//                 assetList[a]=getAsset(a);
//             }
//             res.send( assetList );
//         }
        
//     }catch(e){
//         console.log(e);
//         return "No User could be located";
//     }
// });