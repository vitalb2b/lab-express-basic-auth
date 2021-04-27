const express = require('express');
const User = require('../models/User.model')
const passwordManager = require('../utils/passwordManager')

const router = express.Router();


const validateParams = (req, res, next) => {

    const {username, password} = req.body;

    const usernameNoSpaces = username.trim();
    const passwordNoSpaces = password.trim();

    const isEmpty = !usernameNoSpaces|| !passwordNoSpaces;

    if(isEmpty){
        res.render(
            'auth.views/signup',
            {
                usernameError: !usernameNoSpaces && 'Nome obrigatorio',
                passwordError: !passwordNoSpaces && 'Senha obrigatoria',
            },
        );
        return;
    }
    const usernameMin = username.length < 5;
    const passwordMin = password.length < 6; 
    const notMin = usernameMin || passwordMin;
    
    if(notMin) {
        res.render(
            'auth.views/signup',
            {
                usernameError: usernameMin && 'Minimo de 5 caracteres',
                passwordError: passwordMin && 'Minimo de 6 caracteres',
            },
        );
        return;

    }

    const usernameMax = username.length > 12;
    const passwordMax = password.length > 16; 
    const max = usernameMax || passwordMax;
    
    if(max) {
        res.render(
            'auth.views/signup',
            {
                usernameError: usernameMax && 'Maximo de 12 caracteres',
                passwordError: passwordMax && 'Maximo de 16 caracteres',
            },
        );
        return;

    }


    next();

};


/* GET home page */
router.get('/signup', (req, res) => res.render('auth.views/signup'));


//SIGNUP
router.post('/signup',validateParams, async (req, res, next) => {

    console.log(req.body);
    try{
        const {username, password} = req.body;
        const userExist = await User.findOne({username});
        
        if(userExist){
            res.render('auth.views/signup', {errorMessage: 'nome ja incluso!'})
            return;
        }
   
        const newUser = new User({
            username,
            password :await passwordManager.encryptPass(password),
        });
        
        console.log(newUser)
        await newUser.save();
        res.redirect('/login');

        }catch (error){
            return next(error);   
        }
});


//LOGIN


router.get('/login', (req, res) => res.render('auth.views/login'));


router.post('/login' ,async (req, res, next) => {
    
    try{
        const {username, password} = req.body;
        const userExist = await User.findOne({username});
        
        if(!userExist){
            res.render('auth.views/login', {errorMessage: 'Seu nome ou senha estao errados!!'})
            return;
        }
       
        //compara a senha inserida com a senha no banco
        //console.log(passwordManager.checkPass(password, userExist.password))
        if(!passwordManager.checkPass(password, userExist.password)){
        
        res.render('auth.views/login', {errorMessage: 'Seu nome ou senha estao errados!!'})
        return;

        }

        req.session.currentUser = userExist;
        res.redirect('/main');

        }catch (error){
            return next(error);   
        }
    
});

router.get('/logout', (req, res) => {
    req.session.destroy();

    res.redirect('/login');

});


module.exports = router;
