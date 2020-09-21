var modelControl={
    mv:document.getElementById("mv"),
    ms:document.getElementById("modelSelect"),
    current:0,
    modelList:{},
    display: function display(s){
        console.log(modelControl.modelList)
        this.mv.src="assets/"+models[s].src+".glb";
        this.mv.alt=models[s].alt;
        this.mv.setAttribute("ios-src", models[s].ios);
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
        for(m in models){
            console.log(m, modelControl.modelList[m]);
    
            let model=modelControl.modelList[m].info;
            //add new model to select bar
                document.getElementById("modelSelect").innerHTML+=`
                <div id="m${m}" onclick="modelControl.display(${m});">
                    ${model.Name}
                    <br>Author: ${model.Author||"None"}
                    <br>Licence:${model.Licence||"None"}
                    <br>Hash: ${m[0]+m[1]+m[2]+m[3]+m[4]+m[5]+"..."+m[61]+m[62]+m[63]}
                </div>`
        }         
        console.log(Object.keys(modelControl.modelList));
        modelControl.display(0);
    }
}
modelControl.loadAllModels();