var formData;
var files;

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
                <input id="name" placeholder="Model Name"></input>
                <input id="author" placeholder="Author"></input>
                <input id="licence" placeholder="Licence (Default: CC-BY)"></input>
                <div class="button" onmousedown="register()">
                    Register
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