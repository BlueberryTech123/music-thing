let colors = ["#fcba03", "#ff3d3d", "#443dff", "#2fbd61", "#f2981b", "#8ea630", "#a63061"];


function colorFromString(str) {
    return colorFromIndex(str.charCodeAt(0) + str.charCodeAt(colors.length - 1));
}
function colorFromIndex(index) {
    return colors[index % colors.length];
}

function setColor(element, color) {
    element.style.stroke = "#333";
    element.style.fill = color;
}

function loadMap() {
    fetch("BlankMap-World-Sovereign_Nations.svg").then(async function(res) {
        document.getElementById("map").innerHTML = await res.text();

        document.querySelectorAll("path").forEach((element) => {
            const name = element.querySelector("title");
            if (!name) return;
            const color = colorFromString(name.innerHTML);

            setColor(element, color);
        });

        document.querySelectorAll("g").forEach((element) => {
            const name = element.querySelector("title");
            if (!name) return;
            const color = colorFromString(name.innerHTML);

            setColor(element, color);

            element.querySelectorAll("path").forEach((element2) => {
                setColor(element2, color);
            });
        });
    });
}