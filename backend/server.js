const express = require('express');
const cors = require("cors");
// require('dotenv').config();

const templateRoutes = require('./routes/templateRoutes');

const mappingsRoutes = require('./routes/mappingsRoutes') ;

const app = express();

const PORT = 8000;

app.use(cors());
app.use(express.json()); // read json data coming in the req body and convert to js object


app.use("/api/template", templateRoutes);

app.use("/api/mappings" , mappingsRoutes);

app.listen( PORT , () => {
    console.log(`Server is listening on port : ${PORT}`);
})





