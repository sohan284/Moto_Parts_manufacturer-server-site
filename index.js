const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000 ;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


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
            const result = await orderCollection.insertOne(order);
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