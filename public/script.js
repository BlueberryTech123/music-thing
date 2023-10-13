let colors = ["#074f57", "#077187", "#74a57f", "#9ece9a", "#e4c5af"];
//#BB4430
let hoveredCountry = "";
let tooltip;

let mapPos = {x: 0, y: 0};

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

function loadMap() {
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
            element.onmouseover = () => {tooltip.innerHTML = name;};
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
                        }
                        else {
                            document.getElementById("station").innerText = "Your platform does not support HLS streaming";
                        }
                    }
                    else {
                        document.getElementById("radio").setAttribute("src", data.urlResolved);
                        // alert(document.getElementById("radio").getAttribute("src"));
                    }

                    document.getElementById("favicon").setAttribute("src", data.favicon);
                    document.getElementById("info").innerHTML = `
                        <b>${data.country}</b> (${data.countryCode})<br>
                        Name: <a href="${data.homepage}">${data.name}</a><br>
                    `;
                });
            }

            // alert(`lust: ${element.classList[0]}\nname: ${element.getAttribute('name')}\nactual name: ${name}`);
            // throw new Error("killys");
            // alert(name);

            const color = colorFromString(name);

            setColor(element, color);
        });
    }).catch((event) => {
        alert(event);
    });
}