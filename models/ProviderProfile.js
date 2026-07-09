const mongoose = require("mongoose");

const providerProfileSchema = new mongoose.Schema(
{
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    serviceCategory:{
        type:String,
        required:true
    },

    experience:{
        type:Number,
        required:true
    },

    city:{
        type:String,
        required:true
    },

    description:{
        type:String,
        required:true
    },

    profileImage:{
        type:String,
        default:""
    },

    rating:{
        type:Number,
        default:0
    },

    totalJobs:{
        type:Number,
        default:0
    }
},
{
    timestamps:true
}
);

module.exports = mongoose.model(
    "ProviderProfile",
    providerProfileSchema
);