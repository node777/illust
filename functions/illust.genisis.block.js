//const ethers = require('ethers');
// const sha3 = require('sha3');
const crypto =require('crypto');
const hydra=require("./hydra-chain.js");

let illustDB={

}

var defaultGenisis={
  hash:(m)=>{
    var h=crypto.createHash('sha256');
    h.update(m);
    return h.digest('hex');
  },
  block:(prevHash, timestamp, key, func, msg, sig)=>{
    //set up block variables
    //create block
    var b={
      //todo compare hashes
      p: prevHash,
      t: timestamp,
      k: key,
      i: func,
      m: msg,
      s:sig
    }
    b.h=defaultGenisis.hash(JSON.stringify(b));
    return b;
  },
  chaincode:{
    bid:function(data){
      let d=JSON.parse(data);
      let m=d.m.split(":");
      let lot=m[0];
      let amount=Number(m[1]);
      console.log(illustDB[lot].topBid,amount);
      if(Number(illustDB[lot].topBid)>=amount){
        console.log("bid too small");
        return false
      }
      illustDB[lot].topBid=amount;
      illustDB[lot][d.k.toLowerCase()]=amount;
      //console.log(hydra.db[d.k], d.k);
      return `added value ${d.m} to location ${d.k}\n: String(data)`
    },
    create:function(data){
      let d=JSON.parse(data);
      //create lot
      illustDB[d.m]={
        topBid:0
      };
      //console.log(hydra.db[d.k], d.k);
      return `added value ${d.m} to location ${d.k}\n: String(data)`
    },
    read:(data)=>{
      //console.log(hydra.db, data);
      let lot = data.toString();
      var r = illustDB[lot];
      //console.log(data.toString(), hydra.db, r);
      return JSON.stringify(r);
    }
  }
}




function flatten(obj){
  //todo fix this flatten fn, maye just find replacement
  var r=``;
  for(subObj in obj){
    var s =obj[subObj];
    //if subobj is func
    if(!!(s && s.constructor && s.call && s.apply)){
      r+=s.toString()
      //console.log(s.toString());
    }
    else if(typeof s === 'string' || s instanceof String){
      r+=s;
    }
    else{
      r+=JSON.stringify(flatten(s));
      //console.log(JSON.stringify(s));
    }
  }
  //console.log(r);
  return r;
}

let g=flatten(defaultGenisis);
defaultGenisis.h=defaultGenisis.hash(g);
module.exports=defaultGenisis;