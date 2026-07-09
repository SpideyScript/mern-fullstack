const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        unique:true
    },

    phone:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },

    role:{
        type:String,
        enum:["customer","provider"],
        default:"customer"
    },

    verificationStatus:{
        type:String,
        enum:["pending","approved","rejected"],
        default:"pending"
    }
},
{
    timestamps:true
}
);

module.exports = mongoose.model("User",userSchema);