let colors = ["#fcba03", "#ff3d3d", "#443dff", "#2fbd61", "#f2981b", "#8ea630", "#a63061"];
let hoveredCountry = "";
let tooltip;

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
            let name = element.getAttribute("name") || className;
            if (name == className) {
                element.setAttribute("name", name);
            }
            element.onmouseover = () => {tooltip.innerHTML = name;};
            element.onmouseleave = () => {tooltip.innerHTML = "Hover over a country";};
            element.classList.add("country");

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