//https://openweathermap.org/current
//https://openweathermap.org/weather-conditions

require('dotenv').config(); //environment variables
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser"); 

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});
app.post("/",function(req, res){
    const query = req.body.cityName
    const apiKey = process.env.APIKEY;
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;
    // console.log(url) //paste this url onto browser to see the data object it returns

    https.get(url, function(response){  //going to 'url' give back the weather data object
        console.log(response.statusCode);
        response.on("data",function(data){ //response with callback func when there's a chunk of date
            console.log(data);  //data is a string of hex code that when converted to text becomes "coord: { lon: -118.2437, lat: 34.0522 }" and more
            /*const object ={
                name: "Mia",
                favoriteColor: "yellow"
            };
            JSON.stringify(object);  //turn js object into a string
            */
            //------------------------------
            const weatherData = JSON.parse(data);   //turn a hex string into JSON object style
            console.log(weatherData)
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

            res.write("<h1>The temperature in " + query + " is " + temp + " degree Celcius.</h1>");
            res.write("The weather is currently " + weatherDescription + ".");
            res.write("<img src =" + imageURL + ">");
            res.send(); //we can only send once
        });
    });
});


app.listen(3000, function(){
    console.log("server is running on port 3000");
});