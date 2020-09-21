var formData;
var files;
let provider;
function sidebar(l){
    if(l){
        document.getElementById("sidebar").style="";
        document.getElementById("overlay").style="";
    }else{
        document.getElementById("sidebar").style="width:310px";
        document.getElementById("overlay").style="display:initial;opacity:40%";
    }
}
async function account(){
    if(provider){
    }else{
        await window.ethereum.enable();
        let provider = await new ethers.providers.Web3Provider(web3.currentProvider);
    }
    location.hash="account";
    
}
function connectAccount(){
    if(provider){
    }
    else{

        window.ethereum.enable();
        provider = new ethers.providers.Web3Provider(web3.currentProvider);
    }
    
}
function upload(){
    document.getElementById('upload').click();
    document.getElementById('upload').addEventListener('change', readFileAsString);
}
function readFileAsString(f) {
    console.log(f);
    files = this.files;
    if (files.length === 0) {
        console.log('No file is selected');
        return;
    }

    formData = new FormData();

    uploadPopup();
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
function displayCamera(){
    document.getElementById("content").innerHTML = `<input id="cameraLoader" type="file" accept="image/*">`
    document.getElementById("cameraLoader").click;
}
function register(){
    let d={"Name": document.getElementById("name").value, "Author": document.getElementById("author").value, "Licence":document.getElementById("licence").value};
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

window.ethereum.on('accountsChanged', function (accounts) {
    changePage();
});
window.ethereum.on('networkChanged', function (accounts) {
    changePage();
});