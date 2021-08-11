const express = require("express");
const router = express.Router();
const { Likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

//router.get("/", async (req, res) => {});


router.post("/", validateToken, async (req,res) => {
    const { PostId } = req.body;
    const username = req.user.username;

    const found = await Likes.findOne({ where: {PostId: PostId, UserUsername: username }});

    if (!found){
        await Likes.create({ PostId: PostId, UserUsername: username});
        res.json({liked: true});
    }
    else{
        await Likes.destroy({ where: {PostId: PostId, UserUsername: username }});
        res.json({liked: false});
    }
    
});


module.exports = router;