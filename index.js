const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ku1yj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const ObjectId =  require('mongodb').ObjectID;
const port = 5000

const app = express();
app.use(cors());
app.use(bodyParser.json());




/******* connect database ********/
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

/********** child info data show ui *********/
client.connect(err => {
    const childCollections = client.db("volunteer-network").collection("child-info");
    app.get('/child-info', (req, res) => {
        childCollections.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })
});
/********** register volunteer*********/
client.connect(err => {
    const registerVolunterCollections = client.db("volunteer-network").collection("reg-volunter");
    
    app.post("/register-user", (req, res) => {
        const newRegUser = req.body;
        registerVolunterCollections.insertOne(newRegUser)
        .then(result => {
            res.send(result.insertedCount > 0 );
            console.log(result);
        })
    })

    // read data
    app.get('/register-person', (req, res) => {
        registerVolunterCollections.find({ email: req.query.email})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    // delete data
    app.delete('/deleteEvent/:id', (req, res) => {
        // console.log(req.params.id);
        registerVolunterCollections.deleteOne({ _id: ObjectId(req.params.id)})
        .then(result => {
            res.send(result.deletedCount > 0)
        })
    })
    
});


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT || port)