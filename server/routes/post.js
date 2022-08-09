const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Post = mongoose.model('Post');
const multer = require('multer');

router.get('/allpost', requireLogin, (req,res)=>{
    Post.find()
    .populate("postedBy","_id name username photo")
    .populate("comments.postedBy","_id name username")
    .then(posts => {
        res.json({posts});
    }).catch(err => {
        console.log(err);
    })
});

router.get('/getsubpost', requireLogin, (req,res)=>{
    Post.find({ postedBy: {$in: req.user.following} })
    .populate("postedBy","_id name username photo")
    .populate("comments.postedBy","_id name username photo")
    .then(posts => {
        res.json({posts});
    }).catch(err => {
        console.log(err);
    })
});

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, './files');
    },
    filename: (req,file,cb) => {
        cb(null, file.fieldname+'_'+Date.now()+"_"+file.originalname);
    }
});

let upload = multer({
    storage: storage
}).single('photo');

router.post('/createpost', requireLogin, upload, (req,res)=>{
    
    const {title, body} = req.body;
    const imagename = req.file.filename;
    req.body.photo = imagename;
    
    // const photo = req.body.photo;
    // photo = imagename;

    // upload(req,res,next);
    if(!title || !body){
        res.status(422).json({error: 'Пожалуйста, заполните все поля'});
    }
 
    req.user.password = undefined;
    const post = new Post({
        title,
        body,
        photo: req.body.photo,
        postedBy: req.user,
    })
    
    post.save().then(resl=>{
        res.json({post: resl})
    }).catch(err=>{
        console.log(err);
    });

  
});
 
router.get('/mypost',requireLogin, (req,res)=>{
    Post.find({postedBy: req.user._id})
    .populate("postedBy", "_id name username")
    .populate("comments.postedBy","_id name username photo")
    .then(myposts => {
        res.json({myposts});
    })
    .catch(err=>{
        console.log(err); 
    }) 
});

router.put('/like', requireLogin, (req,res)=>{
    Post.findByIdAndUpdate(req.body.postId, {
        $push: {likes: req.user._id}
    },{
        new: true
    })
    .populate("comments.postedBy","_id name username photo")
    .populate("postedBy","_id name username photo")
    .exec((err,result) => {
        if(err){
            return res.status(422).json({ error: err });
        }else{
            res.json(result);
        }
    })
});

router.put('/unlike', requireLogin, (req,res)=>{
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: {likes: req.user._id}
    },{
        new: true
    })
    .populate("comments.postedBy","_id name username photo")
    .populate("postedBy","_id name username photo")
    .exec((err,result) => {
        if(err){
            return res.status(422).json({ error: err });
        }else{
            res.json(result);
        }
    })
});

router.put('/comment', requireLogin, (req,res)=>{
    const comment = {
        text: req.body.text,
        postedBy: req.user,
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push: {comments: comment}
    },{
        new: true
    })
    .populate("comments.postedBy", "_id name username")
    .populate("postedBy", "_id name username photo")
    .exec((err,result) => {
        if(err){
            return res.status(422).json({ error: err });
        }else{
            res.json(result);
        }
    })
});

router.delete('/deletepost/:postId', requireLogin, (req,res) => {
    Post.findOne({_id: req.params.postId})
    .populate("postedBy", "_id")
    .exec((err, post) => {
        if(err || !post){
            return res.status(422).json({error: err});
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result => {
                // console.log(result);
                res.json(result);
            })
            .catch(err => {
                console.log(err);
            }); 
        }
    });
});

module.exports = router;