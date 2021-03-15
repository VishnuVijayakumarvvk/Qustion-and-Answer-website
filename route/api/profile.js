let express=require('express')
let router=express.Router()
let jwt=require('passport-jwt')
let mongoose=require('mongoose')
let passport=require('passport')
let Person=require('../../model/Person')
let Profile=require('../../model/Profile')


// @type - get
// @route -/api/profile
// @desc - route to profile of users
// @access - private
router.get('/',passport.authenticate('jwt',{session:false}),(req,res)=>{   
    Profile.findOne({user:req.user.id})
    .then((profile)=>{
        if(!profile){
             return res.status(404).json({profilenotfound:'this profile is not found'})
        }
        res.json(profile)
    })
    .catch(err=>console.log('the error is '+ err))
})

// @type - Post
// @route -/api/profile
// @desc - route to profile for update and seve users details
// @access - private
router.post('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const profileValues ={} //setting all the values
    profileValues.user=req.user.id
    if(req.body.username)  profileValues.username=req.body.username
    if(req.body.website)  profileValues.website=req.body.website
    if(req.body.Country)  profileValues.Country=req.body.Country
    if(req.body.Language)  profileValues.Language=req.body.Language
    if(req.body.Portfolio)  profileValues.Portfolio=req.body.Portfolio
    profileValues.social={}
    if(req.body.facebook)  profileValues.social.facebook=req.body.facebook
    if(req.body.youtube)  profileValues.social.youtube=req.body.youtube
    if(req.body.instagram)  profileValues.social.instagram=req.body.instagram

// id vech kandu pidich update cheyyanam
// id vech kettele else case vech 
// username alredy exist anonn nokanam ellel else - save cheyyanam
// id vech kettele username set cheyyum save cheyyum
    Profile.findOne({user:req.user.id})
    .then(profile=>{
        if(profile){
            Profile.findOneAndUpdate({user:req.user.id},{$set:profileValues},{new:true})
            .then(profile=>res.profile)
            .catch(err=>console.log('update '+err))
        }else{
            Profile.findOne({username:profileValues.username})
            .then(profile=>{
                if(profile){
                    res.status(404).json({errmessage:'username already exist,Take an another one'})
                }
                new Profile(profileValues)
                .save()
                .then(profile=>res.json(profile))
                .catch(err=>console.log('inner '+err))
            })
            .catch(err=>console.log('username '+ err))
        }
    })
    .catch(err=>console.log('outer '+ err)) 
})   

// @type - get
// @route -/api/profile/:username
// @desc - route to profile of a person as asked in the link
// @access - public

router.get('/:username',(req,res)=>{
    Profile.findOne({username:req.params.username})
    .then(profile=>{
        if(!profile){
            return res.status(404).json({userexist:'username does not exist'})
        }else{
            res.json(profile)
        }
    })
    .catch(err=>console.log('outter '+ err))
})
// @type - get
// @route -/api/profile/:username/find/everyprofile
// @desc - route to display everyone
// @access - public
router.get('/find/everyprofile',(req,res)=>{
    Profile.find()
    .then(profile=>{
        if(!profile){
            return res.status(404).json({userexist:'user does not exist'})
        }else{
            res.json(profile)
        }
    })
    .catch(err=>console.log('outter '+err))
})

// @type - Delete
// @route -/api/profile
// @desc - route to delete a profile
// @access - private
router.delete('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id})
    Profile.findOneAndRemove({user:req.user.id})
    .then(()=>{
        Profile.findByIdAndRemove({_id:req.user.id})
        .then(()=>res.json({success:'Deleted succesfully'}))
        .catch(err=>console.log('inner '+err))
    })
    .catch(err=>console.log('outter '+err))
})
// @type - post
// @route -/api/profile/workrole
// @desc - route to add the array of object of workrole
// @access - private
router.post('/workrole',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id})
    .then(profile=>{
        if(!profile){
            return res.status(404).json({messageerr:'profile does not exist'})
        }else{
            var work={
                role:req.body.role,
                company:req.body.company,
                country:req.body.country,
                from: req.body.from,
                to: req.body.to,
                current:req.body.current,
                details:req.body.details,
        };
        profile.workrole.unshift(work);
        profile.save()
        .then((profile)=>res.json(profile))
        .catch(err=>console.log('inner '+err))
    }})
    .catch(err=>console.log('outter '+err))
})

router.delete(
    "/workrole/:w_id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      Profile.findOne({ user: req.user.id })
        .then(profile => {
          if(!profile){
              return res.status(404).json({errmessage:'Profile does not exist'})
          }else{
          const removethis = profile.workrole
            .map(item => item.id)
            .indexOf(req.params.w_id);
  
          profile.workrole.splice(removethis, 1);
  
          profile
            .save()
            .then(profile => res.json(profile))
            .catch(err => console.log(err));
        }})
        .catch(err => console.log(err));
    }
  );
  

module.exports=router  

