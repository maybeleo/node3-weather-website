const path = require("path");
const express = require("express");
const expressHbs = require("express-handlebars");
//const hbs = require("hbs");
const minifyHtml = require("express-minify-html");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();
const port = process.env.PORT || 3000;

// Setup handlebars
app.engine("hbs", expressHbs({
    defaultLayout: "layout",
    extname: "hbs",
    layoutsDir: path.join(__dirname, "../templates/layouts"),
    partialsDir: path.join(__dirname, "../templates/partials")
}));

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "../templates/views"));

//hbs.registerPartials(path.join(__dirname, "../templates/partials"));

// Setup statics
app.use(express.static(path.join(__dirname, "../public")));

// Minify HTML
app.use(minifyHtml({
    override: true,
    exception_url: false,
    htmlMinifier: {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeEmptyAttributes: true,
        minifyJS: true
    }
}));

// Setup routes
app.get("", (req, res) => {
    res.render("index", {
        title: "Weather",
        name: "Vasia Pupkenn"
    });
});

app.get("/about", (req, res) => {
    res.render("about", {
        title: "About",
        name: "Vasia Pupkenn"
    });
});

app.get("/help", (req, res) => {
    res.render("help", {
        title: "Help",
        name: "Vasia Pupkenn",
        text: "The help text"
    });
});

app.get("/weather", (req, res) => {
    const reportError = message => res.send({
        error: message
    });

    if (!req.query.address) {
        return reportError("You must provide an address");
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return reportError(error);
        }
    
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return reportError(error);
            }

            res.send({
                forecast: forecastData,
                location: location,
                address: req.query.address
            });
        });
    });
});

app.get("/products", (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: "You must provide an address"
        });
    }

    res.send({
        address: req.query.address
    });
});

app.get("/help/*", (req, res) => {
    res.render("404", {
        title: "404",
        name: "Vasia Pupkenn",
        text: "Help article not found"
    });
});

app.get("*", (req, res) =>{
    res.render("404", {
        title: "404",
        name: "Vasia Pupkenn",
        text: "Page not found"
    });
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}.`);
});