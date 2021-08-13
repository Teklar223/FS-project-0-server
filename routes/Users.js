const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { sign } = require('jsonwebtoken');
const { validateToken } = require ('../middlewares/AuthMiddleware')

router.post("/", async (req,res) => {
    const { username, password } = req.body;
    bcrypt.hash(password, 10).then((hash) => {
        Users.create({
            username: username,
            password: hash,
        });
        res.json("User Created!");
    });
});

router.post("/login", async (req,res) => {
    const { username, password } = req.body;
    const user = await Users.findOne({where: { username: username} });
    if (!user) res.json({error: "User doesn't exist..."}); //if (something) res.json{error;}
    bcrypt.compare(password, user.password).then(async (match) => {
        if (!match) res.json({error: "Wrong Password!"}) //if (something) res.json{error;}

        const accessToken = sign({username: user.username}, "secret"); //replace 'secret' with a more secure "password"
        res.json({token: accessToken, username: username});
    })
});

router.get("/basicinfo/:username", async (req,res) => {
    const username = req.params.username;
    const basicInfo = await Users.findByPk(username, {attributes: {exclude: ["password"]}});
    if (basicInfo===null){res.json(false);}   
    else {res.json(true);}
});

router.get('/auth', validateToken, (req,res) => {
    res.json(req.user);
});

router.put("/resetpassword", validateToken, async (req,res) => {
    const {oldPassword, newPassword} = req.body;
    const user = await Users.findOne({where: { username: req.user.username} });

    bcrypt.compare(oldPassword, user.password).then(async (match) => {
        if (!match) res.json({error: "Wrong Password!"}) //if (something) res.json{error;}

        bcrypt.hash(newPassword, 10).then(async (hash) => {
            await Users.update({password: hash},{where: {username : req.user.username }});
            res.json("password updated");
        });
    })
});

module.exports = router;