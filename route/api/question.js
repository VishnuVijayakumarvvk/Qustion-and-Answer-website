let express=require('express')
let router=express.Router()
let jwt=require('passport-jwt')
let mongoose=require('mongoose')
let passport=require('passport')
let Person=require('../../model/Person')
let Profile=require('../../model/Profile')
let Question=require('../../model/Question')

// @type - get
// @route -/api/question
// @desc - route to display all the questions
// @access - public
router.get('/',(req,res)=>{
    Question.find()
    .sort({date:'desc'})
    .then(question=>res.json(question))
    .catch(err=>console.log('there is no questions to show '+err))
})

// @type - post
// @route -/api/question
// @desc - route to post questions
// @access - private
router.post('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const newQuestion=new Question({
        textOne:req.body.textOne,
        textTwo:req.body.textTwo,
        name:req.body.name, 
    }) 
    newQuestion
    .save()
    .then(question=>res.json(question))
    .catch(err=>console.log('inner '+err)) 
})

// @type - post
// @route -/api/question/answers/:id
// @desc - route to post answers to the question
// @access - private
router.post(
    "/answers/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      Question.findById(req.params.id)
        .then(question => {
          const newAnswer = {
            user: req.user.id,
            text: req.body.text,
            name: req.body.name,
          };
          question.answers.unshift(newAnswer);
  
          question
            .save()
            .then(question => res.json(question))
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    }
  );

  // @type    POST
//@route    /api/questions/upvote/:id
// @desc    route for for upvoting
// @access  PRIVATE
router.post(
    "/upvote/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      Profile.findOne({ user: req.user.id })
        .then(profile => {
          Question.findById(req.params.id)
            .then(question => {
              if (
                question.upvotes.filter(
                  upvote => upvote.user.toString() === req.user.id.toString()
                ).length > 0
              ) {
                return res.status(400).json({ noupvote: "User already upvoted" });
              }
              question.upvotes.unshift({ user: req.user.id });
              question
                .save()
                .then(question => res.json(question))
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    }
  );
module.exports=router
