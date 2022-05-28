const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000 ;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const query = require('express/lib/middleware/query');
const { ObjectID } = require('bson');


const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e1zau.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        await client.connect();
        const partsCollection = client.db('moto_parts').collection('parts');
        const orderCollection = client.db('moto_parts').collection('order');
        const userCollection = client.db('moto_parts').collection('users');
        const reviewCollection = client.db('moto_parts').collection('reviews');
        app.get('/part',async(req,res)=>{
            const query = {};
            const cursor = partsCollection.find(query);
            const parts = await cursor.toArray();
            res.send(parts);
        })
        app.get('/part/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const part = await partsCollection.findOne(query);
            res.send(part);
        })
        app.get('/user',async(req,res)=>{
            const users = await userCollection.find().toArray();
            res.send(users)
        })
        app.put('/user/:email',async(req,res)=>{
            const email = req.params.email;
            const filter = {email: email};
            const user = req.body;
            const options = {upsert: true};
            const updateDoc = {
                $set: user,
            };
            const result = await userCollection.updateOne(filter,updateDoc,options);
            res.send(result);

        })

        app.get('/order',async(req,res)=>{
            const query = {};
            const cursor = orderCollection.find(query);
            const order = await cursor.toArray();
            res.send(order);
        })
        
        app.get('/order/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const order = await orderCollection.findOne(query);
            res.send(order);
          })

        
        app.post('/order',async(req,res)=>{
            const order = req.body;
            const query = {price: order.price}
            const result = await orderCollection.insertOne(query);
            res.send(result);
        })
        app.get('/review',async(req,res)=>{
            const query = {};
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })
       
        app.post('/review',async(req,res)=>{
            const review = req.body;
            const query = {name : review.name , review :review.star ,rating : review.rating ,img : review.img}
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })
        
        

    }
    finally{

    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Hello From MoTo Parts')
  })

  app.listen(port, () => {
    console.log(`MoTo Parts server is running  on port ${port}`)
  })