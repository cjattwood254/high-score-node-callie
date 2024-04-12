const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const { CallTracker } = require("assert");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

const scoresFilePath = path.join(__dirname, "data", "scores.json");

app.get("/api/scores", (req, res) => {
    fs.readFile(scoresFilePath, "utf8", (err, data) => {
        if(err){
            console.error("Error reading scores data:", err);
            res.status(500).send("Error reading scores data.");
            return;
        }
        try {
            const scores = JSON.parse(data);
            res.json(scores);
        }catch (parseError){
            console.error("Error parsing scores data:", parseError);
            res.status(500).send("Error parsing scores data.");
        }
    });
});

app.post("/api/scores", (req, res) => {
    fs.readFile(scoresFilePath, "utf8", (err, data) => {
        if (err){
            console.error("Error reading scores data:", err);
            res.status(500).send("Error reading scores data.");
            return;
        }
        let scores;
        try {
            scores = JSON.parse(data);
        }catch(parseError){
            console.error("Error parsing scores data:", parseError);
            res.status(500).send("Error parsing scores data");
            return;
        }
        scores.push(req.body);

        fs.writeFile(scoresFilePath, JSON.stringify(scores, null, 2), (writeErr) => {
            if (writeErr){
                console.error("Error saving new score", writeErr);
                res.status(500).send("Error saving new score");
                return;
            }
            res.status(201).send("Score added.");
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is up and running on http://localhost:${PORT}`);
});