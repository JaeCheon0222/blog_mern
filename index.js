const express = require('express');
const app = express();

const mongoose = require('mongoose');

// const db = "mongodb+srv://jaecheon:epffl0128!@cluster0-1fqcl.mongodb.net/test?retryWrites=true&w=majority";

// const db = "mongodb://teddykwak:k9915402@ds141294.mlab.com:41294/node-rest-shop";

const db = "mongodb+srv://jaecheon:epffl0128!@cluster0-1fqcl.mongodb.net/test?retryWrites=true&w=majority";

mongoose
    .connect(db, {
        useNewUrlParser: true, 
        useCreateIndex: true
    })
    .then(()=>{
        console.log(`mongo connected`);
    })
    .catch(err => {
        console.log("error: " + err);
    });

const postsRouter = require('./routes/api/posts');
const profileRouter = require('./routes/api/profile');
const usersRouter = require('./routes/api/users');

const PORT = process.env.PORT || 3000;

app.use('/posts', postsRouter);
app.use('/profile', profileRouter);
app.use('/users', usersRouter);




app.listen(PORT, () => console.log(`Server running on port ${PORT}`));