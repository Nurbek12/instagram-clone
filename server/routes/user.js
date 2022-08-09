const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Post = mongoose.model('Post');
const User = mongoose.model('User');
const Chat = mongoose.model('Chat');

router.get('/allusers', requireLogin, (req,res)=>{
    User.find()
    .select('-password')
    .then(users => {
        res.json({ users })
    })
});

router.get('/user/:id', requireLogin, (req,res) => {
    User.findOne({_id: req.params.id})
    .select("-password")
    .then(user => {
        Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id usename name")
        .exec((err, posts) => {
            if(err){
                return res.status(422).json({error: err});
            }
            res.json({ user, posts })
        });
    }).catch(err => {
        return res.status(404).json({ error: "Пользователь не найдено" });
    })
}); 

router.put('/follow',requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.followid, {
        $push: { followers: req.user._id }
    },
    {new: true},
    (err, result)=>{
        if(err){
            return res.status(422).json({error: err});
        }
        User.findByIdAndUpdate(req.user._id, {
            $push: {following: req.body.followid}
        },{
            new: true
        }) 
        .select("-password")
        .then(result => {
            res.json(result)
        }).catch(err => {
            return res.status(422).json({ error: err });
        });
    })
});

router.put('/unfollow',requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.followid, {
        $pull: { followers: req.user._id }
    },
    {new: true},
    (err, result)=>{
        if(err){
            return res.status(422).json({error: err});
        }
        User.findByIdAndUpdate(req.user._id, {
            $pull: {following: req.body.followid}
        },{
            new: true
        })
        .select("-password")
        .then(result => {
            res.json(result)
        }).catch(err => {
            return res.status(422).json({ error: err });
        });
    })
});

router.post('/searchuser', (req,res) => {
    let userPatter = new RegExp('^'+req.body.query);
    User.find({ name: {$regex: userPatter} })
    .select("_id name username photo")
        .then(user => {
            res.json({user});
        }).catch(err => {
            console.log(err);
        })
});

router.post('/sendmessage', requireLogin, (req,res)=>{
    const { text } = req.body;
    const message = new Chat({
        text,
        sendmessuser: req.user
    })
    message.save().then(resl => {
        res.json({ messages: resl })
    }).catch(err => {
        console.log(err);
    })
});

router.get('/allmessages', requireLogin, (req,res)=>{
    Chat.find()
    .select("-password")
    .populate("sendmessuser", "_id name username photo")
    .sort('createdAt')
    .then(mes => {
        res.json({ mes })
    }).catch(err => {
        console.log(err);
    })
});

module.exports = router;