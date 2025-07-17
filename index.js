import express from "express";
import axios from "axios";

const app=express();
const port=3000;

app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.render("index.ejs"),{
        city:null,
        latitude:null,
        longitude:null,
        date:null,
        report:null,
        climate:null,
    }
});

app.post("/weather",async(req,res)=>{
    const apiKey = "51e170ed4931b7e126a1017ea229d8a3";
    const city=req.body.city;

    try{
        const result = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);

        const data = result.data;
        const readableDate = new Date(data.dt * 1000).toLocaleString('en-US'); // Convert Unix time to readable date

        res.render("weather.ejs", {
            city:data.name,
            latitude: data.coord.lat,
            longitude: data.coord.lon,
            date: readableDate,
            report: data.weather[0].description,
            climate:data.weather.main,
        });  
    }
    catch(error)
    {
        console.log(error.response.data);
        res.status(500);
    }
});

app.listen(port,()=>{
    console.log(`Server listening on port ${port}`);
});