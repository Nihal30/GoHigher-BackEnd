const express = require("express")
const app = express();
const cors = require('cors');
const userRouter = require("./routers/userRouter")

app.use(express.json())

app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['POST'], 
    credentials: true, 
  }));

app.use("/api/user",userRouter)

module.exports = app