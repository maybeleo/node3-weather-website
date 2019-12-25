const request = require("request");

const forecast = (lat, lon, callback) => {
    const url = `https://api.darksky.net/forecast/22ea6c4c67c20f3aab48ddfd89d5420c/${lat},${lon}?units=si&lang=uk`;

    request({ url, json: true }, (error, data/*{ body: { error: forecastError, daily: { data }, currently: { temperature, precipProbability } } }*/) => {
        if (error) {
            callback("Unable to connect to the weather service!");
        }
        else if (data.body.error/*forecastError*/) {
            callback("Unable to get forecast");
        }
        else {
            callback(undefined, `${data.body.daily.data[0].summary} It is currently ${data.body.currently.temperature} degrees out. There is a ${data.body.currently.precipProbability}% chance of rain. Temperature low: ${data.body.daily.data[0].temperatureLow}, high: ${data.body.daily.data[0].temperatureHigh}`);
        }
    });
    
};

module.exports = forecast;