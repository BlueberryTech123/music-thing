import { RadioBrowserApi } from "radio-browser-api";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createClient } from '@supabase/supabase-js';
import dotenv from "dotenv";
import fetch from 'node-fetch';
import express from "express";
import bodyParser from "body-parser";

global.fetch = fetch;
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const api = new RadioBrowserApi("Hoiudghouegthuibrgihihohuhg0");
const app = express();
const supabaseUrl = 'https://ccomuyqholpntnwktgle.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
console.log("hi (rizz)");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

function publicFile(filename) {
    return `${__dirname.replace("/functions", "")}/public/${filename}`;
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

// ======================================================================================

async function createUser(username, password) {
    let message;
}
async function authenticate(username, password) {
    let message;
}

// ======================================================================================

app.get("/", async function (req, res) {
    res.sendFile(publicFile("index.html"));
});

app.post("/getstations", async function (req, res) {
    try {
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

        if (!selected) throw new Error("selff");

        res.json(selected);
    }
    catch (error) {
        console.log(error);
        res.json({
            country: "Unavailable",
            countryCode: "N/A",
            favicon: "",
            urlResolved: "",
            name: "Unavailable"
        })
    }
});

app.use(express.static("public"));

app.listen(8000);