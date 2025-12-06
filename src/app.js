const express = require("express");
const cors = require("cors");
const healthCheckRouter = require("./routes/healthCheck.routes");
const AuthRouter = require("./routes/auth.routes");
const app = express();
// const jwt = require('jsonwebtoken');

app.use(express.json({ limit: "16kb" }));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(
    cors({
        origin: process.env.CORS_ORIGIN?.split(",") ?? "*",
        credentials: true,
        methods: ["GET", "POST", "PATCH", "PUT", "UPDATE", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/auth", AuthRouter);

// app.get("/", async (req, res) => {
//     const token = jwt.sign({ foo: 'dsjdsij' }, 'shhhhh', {expiresIn: "0h"});
//     res.send(token);
// });

// app.post("/", async (req, res) => {
//     const p = jwt.verify(req.body.token, "shhhhh");
//     console.log(p);

//     res.json(p);
// })

module.exports = app;
