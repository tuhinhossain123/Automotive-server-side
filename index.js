const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

// brandShop
// oZECiq08EBTHe8aC




const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.taymcgi.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


 

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const database= client.db("brandShopDB");
    const brandsCollection  = database.collection("brands");
    const productCollection  = database.collection("product");

    app.get('/brands', async(req, res)=>{
        const brands = brandsCollection.find();
        const result= await brands.toArray();
        res.send(result)
    })

    app.get('/product/:name', async(req, res)=>{
        const name = req.params.name.replace(" ", "-");
        const cursor =productCollection.find({brand:name});
        const result = await cursor.toArray();
        res.send(result)
    })
    app.get('/product/details/:id', async(req, res)=>{
        const id = req.params.id;
        const cursor =await productCollection.findOne({_id: new ObjectId(id)});
        res.send(cursor)
    })

    app.get('/product/:id', async(req, res)=>{
        const id = req.params.id;
        const query= {_id: new ObjectId(id)};
        const result = await productCollection.findOne(query);
        res.send(result);
    })

    app.put('/product/:id', async(req, res)=>{
        const id =req.params.id;
        const filter = {_id: new ObjectId(id)};
        const options ={upsert:true}
        const updateProduct =req.body;
        console.log(updateProduct)
        const product ={
            $set:{
                name:updateProduct.name,
                brand:updateProduct.brand,
                price:updateProduct.price,
                rating:updateProduct.rating,
                img:updateProduct.img,
                description :updateProduct.description

            }
        }
        const result =  await productCollection.updateOne(filter, product, options);
        console.log(result)
        res.send(result)
    })
     

    app.post('/product', async(req, res)=>{
        const user = req.body;
        const result = await productCollection.insertOne(user);
        res.send(result);
    })

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);


app.get('/', (req, res)=>{
    res.send('Brand Shop Is Running')
})
app.listen(port, ()=>{
    console.log('My Port running On:', port)
})