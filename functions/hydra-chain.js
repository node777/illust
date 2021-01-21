// const ethers = require('ethers');
// const sha3 = require('sha3');
// const crypto = require('crypto');
var hydra={
  db:{},
  chains:{
  },
  create:(chain, genisisBlock)=>{
    //todo check name collisions
    hydra.chains[chain]=[
      genisisBlock
    ]
    //console.log("created genisis "+JSON.stringify(this)+" for "+chain)
  },
  query:(chain, query, args)=>{
    if(query){
      let c=hydra.chains[chain];
      var r = c[0].chaincode[query](args);
      return r;
    }
    else{
      return hydra.chains[chain];
    }
  },
  invoke:(chain, invoke, body)=>{

      //try to invoke function
    try{
      //get invoke data
      var d=Object.keys(body)[0];
      var data =JSON.parse(d);
      //get chain
      let c=hydra.chains[chain];
      //console.log(c[0].chaincode[invoke],d);

      //set r=chaincode invocation return
      let r = c[0].chaincode[invoke](d);
      //check for chain
      if(r){
        //todo scrub d
        //assign block params
        
        let prevHash = c[c.length-1].h;
        let key = data.k;
        let ts = data.t;
        let msg = data.m;
        let inv = data.i;
        let sig = data.s;
        //create block
        let b= c[0].block(prevHash, ts, key, inv, msg, sig);
        //ret add block
        return hydra.addBlock(c, b, r); 
      }
      else{
        return `Transaction revert`;
      }
    }
    catch(err){
      return `could not execute the function ${invoke} on chain ${chain} with params ${body} - got error ${err}`;
    }
  },
  addBlock:(c, b, r)=>{
    //todo verify timestamp

    //check for subchain
    if(c[0].chainRef){
      console.log(c[0]);
      //if theres no data in this subchain location
      if(hydra.chains[c[0].chainRef(data)]===undefined){
        //console.log(c[0].subGenisis(chain, c[0].h))
        //create subGenisis
        hydra.chains[c[0].chainRef(data)]=[ c[0].subGenisis(chain, c[0].h)||{} ]
      }
      //set chain target to subchain
      c=hydra.chains[c[0].chainRef(data)];
    }

    //block is valid
    try{
      if(b.p==c[c.length-1].h){
        console.log(c, b)
        c.push(b);
        return `block added: returned: ${r}`;
      }else{
        //throw "Previous hash does not match: server may be under intense load";
      }
    }
    catch(e){
      return `block could not be added: ERROR: ${e}`;
    }

  }
}
module.exports=hydra;