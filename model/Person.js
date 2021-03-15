let mongoose=require('mongoose')
const Schema=mongoose.Schema

let PersonSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profilepic:{
        type:String,
    },
    date:{
        type:Date,
        default:Date.now()
    },
})
module.exports=Person = mongoose.model('webperson',PersonSchema)