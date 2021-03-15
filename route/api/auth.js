let express=require('express')
let router=express.Router()
let bcrypt=require('bcrypt')
let bodyparser=require('body-parser')
let passport=require('passport')
let jsonwt=require('jsonwebtoken')
let jwt=require('passport-jwt')
let key=require('../../setup/myurl')
// @type - get
// @route -/api/auth
// @desc - just for testing
// @access - public
router.get('/',(req,res)=>{
    res.json({test:'auth connected successfully'})
})

// auth should have the details of all the persons
// accessing the person 
let Person=require('../../model/Person')
// @type - POST
// @route -/api/auth/register
// @desc - route fo registeration of users
// @access - public
router.post('/register',(req,res)=>{
    Person.findOne({ email: req.body.email})
        .then(person=>{
            if(person){
                return res
                .status(400)
                .json({emailerror:'Email already exist'});
            } else {
                const newPerson = new Person({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    username: req.body.username
                })
                // encrypt password
                bcrypt.genSalt(10,(err, salt)=> {
                    bcrypt.hash(newPerson.password, salt, function(err, hash) {
                        if(err) throw err
                        else{
                            newPerson.password=hash
                            newPerson
                            .save()
                            .then(person=>res.json(person)) //to grab all the details of the person
                            .catch(err=>console.log(err))
                        }
                    });
                });
            }    
        })
        .catch((err)=>console.log(err))
})
// above line explanation
// access person - email eduth - check person is already existing or not  - if already exist- 
// error - else - get the details - password hasing- password saving - getting the person

// @type - POST
// @route -/api/auth/login
// @desc - route fo login of users
// @access - public
router.post('/login',(req,res)=>{
    const email=req.body.email
    const password=req.body.password
    Person.findOne({email}) //connecting to database to check the password and email
    .then(person=>{
        if(!person){
            res.status(400).json({emailerror:'Email not existing, please sign up'})
        } 
        bcrypt.compare(password,person.password)
        .then(isCorrect=>{
            if(isCorrect) {
                const payload={
                    id:person.id,
                    name:person.name,
                    email:person.email
                }
                jsonwt.sign(
                    payload,
                    key.secret,
                    { expiresIn: 3600} ,
                    (err,token)=>{
                        res.json({
                            success:true,
                            token:'Bearer ' + token
                        })
                    }   
                )
            }else{
                res.status(400).json({password:'password incorrect'})
            }
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})

// @type - get
// @route -/api/auth/profile
// @desc - route to profile of users
// @access - private
router.get('/profile',passport.authenticate('jwt',{session:false}),(req,res)=>{    
    res.json({
        id:req.user.id,
        name:req.user.name,
        email:req.user.email,
        profilepic:req.user.profilepic
    })
})

module.exports=router