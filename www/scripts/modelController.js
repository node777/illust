var modelControl={
    mv:document.getElementById("mv"),
    ms:document.getElementById("modelSelect"),
    current:0,
    modelList:{},
    display: function display(s){
        console.log(modelControl.modelList)
        this.mv.src="assets/models/"+Object.keys(modelControl.modelList)[s]+".glb";
        /*
        this.mv.alt=models[s].alt;
        this.mv.setAttribute("ios-src", models[s].ios);
        */
    },
    maximize: function maximize(){
        this.mv.style="height:100%;";
        document.getElementById("modelSelect").style="display:none;";
        document.getElementById("maximizeButton").style="display:none;";
        document.getElementById("minimizeButton").style="display:initial;";
    },
    minimize: function minimize(){
        this.mv.style="height:80%;";
        document.getElementById("modelSelect").style="display:flex;";
        document.getElementById("maximizeButton").style="display:flex;";
        document.getElementById("minimizeButton").style="display:none;";
    },
    next: function(){
        console.log(Object.keys(modelControl.modelList)[modelControl.current+1]);
        let n=Object.keys(modelControl.modelList)[modelControl.current+1];
        document.getElementById(`m${n}`).scrollIntoView();
    },
    scroll:()=>{
        var ms =document.getElementById("modelSelect");
        console.log(ms.scrollLeft,ms.offsetWidth);
        if(ms.scrollLeft%ms.offsetWidth==0){

            modelControl.current=ms.scrollLeft/ms.offsetWidth;
            console.log(modelControl.current);
            modelControl.display(modelControl.current);
        }
    },
    addModel: function addModel(){

    },
    loadAllModels: function loadAll(){
        var request = new XMLHttpRequest(); 
        request.onreadystatechange = function() {
            if (request.readyState === 4) {
                modelControl.modelList=JSON.parse(request.response);
                for(m in modelControl.modelList){
                    console.log(m, modelControl.modelList[m]);
         
                    let model=modelControl.modelList[m].info;
                    //add new model to select bar
                     document.getElementById("modelSelect").innerHTML+=`
                     <div id="m${m}" onclick="modelControl.display(${m});">
                         ${model.Name}
                         <br>Author: ${model.Author||"None"}
                         <br>Licence:${model.Licence||"None"}
                         <br>Hash: ${Object.keys(modelControl.modelList)}
                     </div>`
                 }         
                 console.log(Object.keys(modelControl.modelList)[m]);
                 modelControl.display(0);
            }
        }
        request.open("GET", "/models");
        request.send();
    }
}
modelControl.loadAllModels();