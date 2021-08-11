const express = require("express"); //init express
const app = express();              //create an instance of express
const cors = require("cors");

app.use(express.json()); //enables using json for DB purposes
app.use(cors());

const db = require("./models");

//Routers
const postRouter = require("./routes/Posts");
app.use("/posts", postRouter);

const commentsRouter = require("./routes/Comments");
app.use("/comments", commentsRouter);

const usersRouter = require("./routes/Users");
app.use("/user", usersRouter);

const likesRouter = require("./routes/Likes");
app.use("/likes", likesRouter);

db.sequelize.sync().then(() => {
    app.listen(3001 , () => {
        console.log("Server running on port 3001");
    });
});
