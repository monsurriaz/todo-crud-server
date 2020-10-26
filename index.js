const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const ObjectId = require('mongodb').ObjectId;

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x3yya.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const todoCollection = client.db("todoApp").collection("todoList");
  
  app.post('/addTodo', (req, res) => {
      const todos = req.body;
      console.log(todos)
      todoCollection.insertOne(todos)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
  });

  //email: req.query.email
  app.get('/showTodo', (req, res) => {
    console.log(req.query);
    todoCollection.find({})
    .toArray((err, documets) => {
        res.send(documets)
    })
  });


  app.get('/todolist/:id', (req, res) => {
    todoCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documets) => {
      res.send(documets[0]);
    })
  });


  app.patch('/update/:id', (req, res) => {
    console.log(req.body.name);
    todoCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {name: req.body.name}
    })
    .then(result => {
      console.log(result)
      res.send(result)
    }
    )
  })


  app.delete('/delete/:id', (req, res) => {
    todoCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(documets => {
      console.log(documets);
    })
  });



});

app.get('/', (req, res) => {
    res.send("Hello from db it's working!")
});

app.listen(process.env.PORT || port);