const {classifyText} = require('./ai')
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors")
dotenv.config();
const app = express();
app.use(cors());

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Digital Witness Pro Backend is running!");
});


app.post("/api/classifyText" , (req ,res)=>{
  const {text} = req.body;
  const result =  classifyText(text)
  console.log(result)
  res.send(result)
})
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

