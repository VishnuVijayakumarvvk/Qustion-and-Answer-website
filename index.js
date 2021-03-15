let express=require('express')
let mongoose=require('mongoose')
let app=express()


// defining bodyparser and json
let bodyparser=require('body-parser')
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

//accessing  the route
let auth=require('./route/api/auth')
let profile=require('./route/api/profile')
let question=require('./route/api/question')

// accesing the mongodb and connecting
let db=require('./setup/myurl').mongoURL
const passport = require('passport')
mongoose
.connect(db)
.then(()=>console.log('successfullyy connected'))
.catch((err)=>console.log(err))
let port=process.env.PORT || 3000

// passport middleware
app.use(passport.initialize())

// config for jwt strategy
require('./strategies/jsonwtstrategy')(passport)

// just for testing
app.get('/',(req,res)=>{
    res.send('this is the home page')
})
// route using for api auth (use)
app.use('/api/auth',auth)
app.use('/api/profile',profile)
app.use('/api/question',question)

app.listen(port,()=>{
    console.log(`the server is running in the port ${port}....`)
})
