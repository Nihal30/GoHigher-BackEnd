const {Schema,model} = require("mongoose");

module.exports.Otp = model("Otp",Schema({
    number:{
        type:String,
        require:true
    },
    otp:{
        type:String,
        require:true
    },
    createdAt:{ type:Date,default:Date.now, index:{  expires:300}}

    //After 5 minutes it deleted automatically from the DB
},{timestamps:true}))