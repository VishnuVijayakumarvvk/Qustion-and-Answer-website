let mongoose=require('mongoose')
const Schema=mongoose.Schema

let ProfileSchema = new Schema({
    user:{
        type:String,
        ref:'webperson',
    },
    username:{
        type:String,
        required:true,
    },
    website:{
        type:String,
    },
    Country:{
        type:String,
        required:true,
    },
    Language:{
        type:String,
        // required:true,
    },
    Portfolio:{
        type:String,
    },
    workrole:[{
        role:{
            type:String,
            required:true,
        },
        company:{
            type:String,
            required:true,
        },
        country:{
            type:String,
            required:true,
        },
        from:{
            type:Date,
            // required:true,
        },
        to:{
            type:Date,
            // required:true,
        },
        current:{
            type:Boolean,
            // required:true,
        },
        details:{
            type:String,
        },
    }],
    social:{
        facebook:{
            type:String
        },
        youtube:{
            type:String
        },
        instagram:{
            type:String
        }
    }
})

module.exports = Profile =mongoose.model('myprofile',ProfileSchema)