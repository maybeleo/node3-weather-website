const request = require("request");

const geocode = (address, callback) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1IjoibWF5YmVsZW8iLCJhIjoiY2syMmJrZTlwMDdtYjNvcGczNGgwMzNxdiJ9.8IJI9fI1-kVhWqv0oVZnqQ&limit=1`;

    request({ url, json: true }, (error, data/*{ body: { features } }*/) => {
        if (error) {
            callback("Unable to connect to the geocoding service");
        } else if (!data.body.features || data.body.features.length == 0) {
            callback("Unable to find location");
        } else {
            const { center, place_name } = data.body.features[0];

            callback(undefined, {
                latitude: center[1],
                longitude: center[0],
                location: place_name
            });
        }
    });
};

module.exports = geocode;