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
    if (!user) res.json({error: "User doesn't exist..."}); // if {error;}
    bcrypt.compare(password, user.password).then(async (match) => {
        if (!match) res.json({error: "Wrong Password!"}) //if {error;}

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

module.exports = router;