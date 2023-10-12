import { RadioBrowserApi } from "radio-browser-api";
import { fileURLToPath } from "url";
import { dirname } from "path";
import express from "express";
import bodyParser from "body-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const api = new RadioBrowserApi("Hoiudghouegthuibrgihihohuhg0");
const app = express();
console.log("hi (rizz)");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

function publicFile(filename) {
    return `${__dirname}/public/${filename}`;
}
async function byCountryCode(countryCode) {
    console.log(countryCode);
    const stations = await api.searchStations({
        countryCode: countryCode,
        limit: 25
    });
    return stations;
}
async function byCountryName(country) {
    console.log(country);
    const stations = await api.searchStations({
        country: country,
        limit: 25
    });
    return stations;
}

app.get("/", async function (req, res) {
    res.sendFile(publicFile("index.html"));
});

app.post("/getstations", async function (req, res) {
    console.log(`Getting stations...\nname: ${req.body.name}\niso: ${req.body.iso}`);
    let stations;
    if (!req.body.iso) {
        stations = await byCountryName(req.body.name);
    }
    else {
        stations = await byCountryCode(req.body.iso);
    }
    
    const selected = stations[0];
    console.log("Done!");
    console.log(selected);
    res.json(selected);
});

app.use(express.static("public"));

app.listen(8000);