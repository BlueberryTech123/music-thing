import { RadioBrowserApi } from "radio-browser-api";

const api = new RadioBrowserApi("Hoiudghouegthuibrgihihohuhg0");

async function byCountryCode(countryCode) {
    const stations = await api.searchStations({
        countryCode: countryCode,
        limit: 25
    });
    console.log(stations);
}

byCountryCode("US");