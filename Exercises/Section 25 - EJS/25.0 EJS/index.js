import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;



app.get("/", (req, res) => {
    const currentDate = new Date("March 9, 2025 1:11:00");
    const day = currentDate.getDay();
    let dayCat = "";
    let message = "";
    if(day > 0 && day < 6)
    {
        dayCat = "a weekday";
        message = "work hard";
    }
    else
    {
        dayCat = "the weekend";
        message = "have fun";
    }

    res.render(__dirname + "/views/index.ejs", {
        dayCat: dayCat,
        message: message
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});