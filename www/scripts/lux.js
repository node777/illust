lux={
    t:document.getElementById("content")
}
function setup(){
    document.getElementById("header").innerHTML = elements.header;
    document.getElementById("sidebar").innerHTML = elements.sidebar;
    document.getElementById("footer").innerHTML = elements.footer;
    window.addEventListener("hashchange", changePage, false);
    changePage();

}
async function changePage (x){

    lux.t.innerHTML=await elements.loading();
    var h=(location.hash||"#content");
    var hwa=h.split("#")[1];
    var a=hwa.split("?");
    var p=a[0];
    console.log(p);
    document.body.id = p;
    try{
        lux.t.innerHTML = await elements.pages[p](a);
    }catch(e){
        lux.t.innerHTML = elements.pages["404"]();
    }
}
window.onload=()=>{
    setup();
}