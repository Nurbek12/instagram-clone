const express = require('express');
const router = express.Router();
const moongose = require('mongoose');
const User = moongose.model('User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const {JWT_SECRET} = require('../keys');
const requireLogin = require('../middleware/requireLogin');

router.get('/protected', requireLogin, (req,res)=>{
    res.send("Hello user");
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

router.post('/signup', upload, (req,res)=>{
    const { name, email, password, username } = req.body;
    // console.log(req.body);
    if(!name || !email || !password || !username ) {
        return res.status(422).json({error: 'Пожалуйста, заполните все поля'});
    }
    const imagename = req.file.filename;
    req.body.photo = imagename;
    User.findOne({email:email})
    .then(saveUser => {
        if(saveUser){
            return res.status(422).json({error: 'Этот адрес электронной почта уже был зарегистрирован'});
        }

        bcrypt.hash(password, 12)
        .then(hashedpassword=>{
            const user = new User({
                username,
                name,
                email, 
                photo: req.body.photo,
                password: hashedpassword,
            });
    
            user.save()
            .then(usr => {
                res.json({message: 'Успешно сохранено'});
            })
            .catch(err=>{
                console.log(err);
            });
        })

    }).catch(err=>{
        console.log(err);
    })
});

router.post('/signin', (req,res)=>{
    const { email, password } = req.body;
    if(!email || !password){
        res.status(422).json({error: 'Пожалуйста, проверьте электронную почту или пароль'});
    }
    User.findOne({email: email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({ error: 'Электронной почта или пароль указан неверно' });
        } 
        bcrypt.compare(password,savedUser.password)
        .then(domatch => {
            if(domatch){
                // res.json({message: "successfully signed in"})
                const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET, {
                    "algorithm": "HS256",
                    expiresIn: 86400
                }); 
                const {_id, name, email, username,followers,following, photo} = savedUser;
                res.json({token, user: {_id, name, email, username,followers,following,photo}});
            }else{
                return res.status(422).json({ error: 'Неправильный пароль' });
            }
        }).catch(err=>{
            console.log(err);
        })
    }) 
});

module.exports = router;