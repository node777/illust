
var countDownDate = new Date(
"Oct 23, 2020 10:00:00"
).getTime(); /* event started date and time  */
var last = "00:00:00:00";

var x = setInterval(function () {
    var now = new Date().getTime(); /* now date and time */

    var distance = countDownDate - now;

    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    var nowon =
        ("0" + days).slice(-2) +
        ":" +
        ("0" + hours).slice(-2) +
        ":" +
        ("0" + minutes).slice(-2) +
        ":" +
        ("0" + seconds).slice(-2);

    console.log(last + " " + nowon);
    animatetime(last, nowon);
    last = nowon;

    if (distance < 0) {
        clearInterval(x);
        location.hash="collections";
        changePage();
    }
}, 1000);

function animatetime(last, nowon) {
for (var i = 0; i < nowon.length; i++) {
    if (last[i] != nowon[i]) {
    animate(i, nowon[i]);
    }
}
}

function animate(index, number) {
    try{
        var element = document.getElementsByClassName("number")[index];
        var second = element.lastElementChild.cloneNode(true);
        second.innerHTML = number;
        element.appendChild(second);
        element.classList.add("move");
        setTimeout(function () {
            element.classList.remove("move");
        }, 500);
        setTimeout(function () {
            element.removeChild(element.firstElementChild);
        }, 500);
    }catch(e){
        clearInterval(x);
    }
}
