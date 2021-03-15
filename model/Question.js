let mongoose=require('mongoose')
const Schema=mongoose.Schema

let QuestionSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'webperson'
    },
    textOne:{
        type:String,
        required:true
    },
    textTwo:{
        type:String
    },
    name:{
        type:String,
        required:true,
    },
    upvotes:[{
        user:{
            type:Schema.Types.ObjectId,
            ref:'webperson'
        }
    }],
    answers:[{
        user:{
            type:Schema.Types.ObjectId,
            ref:'webperson'
        },
        text:{
            type:String,
            required:true,
        },
        name:{
            type:String,
            required:true,
        },
        date:{
            type:Date,
            default:Date.now,
        }
    }],
    date:{
        type:Date,
        default:Date.now,
    }
})

module.exports=Question=mongoose.model('myQuestion',QuestionSchema)
