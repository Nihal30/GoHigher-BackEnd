require("dotenv/config");
const mongoose = require ("mongoose");
const app = require("./App");

mongoose.connect(process.env.MONGODB_URL ,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    // useCreateIndex:true

})
.then(()=>console.log("Connected to MongoDB"))
.catch((err)=>console.log("MongoDB Connection Failed" + err))

const port = process.env.PORT || 3001

app.listen(port,()=>{
    console.log(`App running on port ${port}!`)
})