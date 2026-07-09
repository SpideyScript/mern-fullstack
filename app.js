const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

app.use(
    "/api/auth",
    require("./routes/authRoutes")
);

app.use(
    "/api/provider",
    require("./routes/providerRoute")
);

app.use(
    "/api/request",
    require("./routes/requestRoutes")
);

app.use(
    "/api/quotes",
    require("./routes/quoteRoute")
);

module.exports = app;