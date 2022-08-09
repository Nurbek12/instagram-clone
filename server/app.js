const express = require('express');
const app = express();
const path = require('path');
const moongose = require('mongoose');
const PORT = process.env.PORT || 5000;
const { mongouri } = require('./keys');
const cors = require('cors');

app.use(express.static(path.resolve(__dirname, 'files')));
app.use('/profile',express.static(path.resolve(__dirname, 'files')));
app.use('/myfollowespost',express.static(path.resolve(__dirname, 'files')));
 
app.use(cors());
moongose.connect(mongouri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
moongose.connection.on('connected', ()=>{
    console.log('Connection to mongodb');
});
moongose.connection.on('error', (err)=>{
    console.log('Error: ', err);
});

require('./models/user');
require('./models/post');
require('./models/chat');

app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));

app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`);
});