let colors = ["#074f57", "#077187", "#74a57f", "#9ece9a", "#e4c5af"];
//#BB4430
let hoveredCountry = "";
let tooltip;

let size = 100;
let position = {x: 0, y: 0};
let dragDelta = {x: 0, y: 0};
let mousePosition = {x: 0, y: 0};
let mouseAnchor = {x: 0, y: 0};
let dragged = false;

let map;
let mapSvg;

onwheel = (event) => {
    // alert("kil yourself");
    size = Math.min(Math.max(size + event.deltaY * -0.075, 80), 300);
    mapSvg.style.transform = `scale(${size}%)`
}
window.onerror = (event, source, lineno, colno, error) => {
    alert(event);
}

function colorFromString(str) {
    let index = 0;

    for (let i = 0; i < str.length; i++) {
        index += str.charCodeAt(i);
    }

    return colorFromIndex(index);
}
function colorFromIndex(index) {
    return colors[index % colors.length];
}

function setColor(element, color) {
    element.style.fill = color;
}
function toggleSound() {
    let player = document.querySelector("#radio");
    player.muted = !player.muted;
    document.getElementById("mute").classList.toggle("muted");
}

function mouseDownMap() {
    dragged = true;
    mouseAnchor = {...mousePosition};
}
function mouseUpMap() {
    dragged = false;
    position.x += dragDelta.x;
    position.y += dragDelta.y;
    dragDelta = {x: 0, y: 0};
}
onmousemove = (event) => {
    mousePosition.x = event.clientX;
    mousePosition.y = event.clientY;

    if (dragged) {
        dragDelta.x = (mousePosition.x - mouseAnchor.x) * 100 / size;
        dragDelta.y = (mousePosition.y - mouseAnchor.y) * 100 / size;
        
        mapSvg.style.marginLeft = `${position.x + dragDelta.x}px`;
        mapSvg.style.marginTop = `${position.y + dragDelta.y}px`;
    }
}

function openPopup(title, content) {
    document.getElementById("popup-title").innerHTML = title;
    document.getElementById("popup-content").innerHTML = content;
    document.getElementById("popup-container").classList.remove("invisible");
}
function closePopup() {
    document.getElementById("popup-container").classList.add("invisible");
}
function loadMap() {
    map = document.querySelector("#map");
    map.addEventListener("mousedown", mouseDownMap);
    map.addEventListener("mouseup", mouseUpMap);
    map.addEventListener("mouseleave", mouseUpMap);

    fetch("world.svg").then(async function(res) {
        document.getElementById("map").innerHTML = await res.text();

        document.querySelectorAll("#map path").forEach((element) => {
            // let name = element.getAttribute("name") || element.classList[0];
            // let name = element.classList[0] || element.getAttribute("name");
            let className = "";
            element.classList.forEach((kys) => {
                className += `${kys} `;
            });
            if (className.length > 0) className = className.substring(0, className.length - 1);

            let name = element.getAttribute("name") || className;
            if (name == className) {
                element.setAttribute("name", name);
            }
            element.onmouseover = () => {tooltip.innerHTML = `<b>${name}</b>`;};
            element.onmouseleave = () => {tooltip.innerHTML = "Hover over a country";};
            element.classList.add("country");

            element.onclick = () => {
                $.post("/getstations", {iso: element.id, name: name}, (data) => {
                    console.log(JSON.stringify(data));
                    document.getElementById("station").innerText = data.name;
                    if (data.hls) {
                        if (Hls.isSupported()) {
                            let hls = new Hls();
                            hls.loadSource(data.urlResolved);
                            // hls.attachMedia(document.querySelector("#radio"));
                            hls.attachMedia(document.getElementById("radio"));
                            // alert(document.getElementById("radio").getAttribute("src"));
                            // openPopup("hehehehehe", document.getElementById("radio").getAttribute("src"));
                        }
                        else {
                            document.getElementById("station").innerText = "Your platform does not support HLS streaming";
                            openPopup("Error", "Your platform does not support HLS streaming");
                        }
                    }
                    else {
                        document.getElementById("radio").setAttribute("src", data.urlResolved);
                        // alert(document.getElementById("radio").getAttribute("src"));
                    }

                    document.getElementById("favicon").setAttribute("src", data.favicon);

                    let info = document.querySelector("#info");
                    const tags = data.tags;

                    info.innerHTML = `
                        <b>${name}</b> (${data.countryCode})<br>
                        Name: <a href="${(data.homepage) ? data.homepage : '#'}">${data.name}</a><br>
                        Tags: 
                    `;

                    if (data.countryCode == "N/A") {
                        openPopup("Error", `Radio data from <b>${name}</b> is unavailable.<br> Please try again later.`)
                    }

                    if (tags) {
                        for (let i = 0; i < Math.min(tags.length, 4); i++) {
                            info.innerHTML += `<span class="tag" style="background: ${colorFromString(tags[i])};">${tags[i]}</span>&nbsp;&nbsp;`;
                        }
                        if (tags.length > 4) info.innerHTML += "...";
                    }
                });
            }

            // alert(`lust: ${element.classList[0]}\nname: ${element.getAttribute('name')}\nactual name: ${name}`);
            // throw new Error("killys");
            // alert(name);

            const color = colorFromString(name);

            setColor(element, color);
        });
        // $("#map").draggable();
        mapSvg = document.querySelector("#map svg");
    }).catch((event) => {
        alert(event);
    });
}