const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://smartdbUser:VAj48vRBdFNDlz4o@cluster0.dsizbq5.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/', (req, res) => {
  res.send("Smart Server is running");
});

async function run() {
  try {
    await client.connect();

    const db = client.db("smart_db");
    const productsCollection = db.collection("products");
    const biddingsCollection = db.collection("bids");

app.get('/products', async (req, res) => {
    // const projectFields = { name: 1, price: 1, image: 1 };
    //   const cursor = productsCollection.find().sort({ _id: -1 }).limit(5).project(projectFields);
   console.log(req.query)
   const email = req.query.email;
   let query = {};
   if(email){
    query = {email: email}
   }
   
   
    const cursor = productsCollection.find(query); 
    const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });



    // POST: add product
    app.post('/products', async (req, res) => {
      const newProduct = req.body;
      console.log("Received:", newProduct);

      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    });


app.patch('/products/:id', async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          name: updatedProduct.name,
          price: updatedProduct.price,
 }
      }
      const result = await productsCollection.updateOne(query, update)
      res.send(result)
    });



// delete product
    app.delete('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    })


// bids related apis
    app.get('/bids', async (req, res) => {
        const email = req.query.email;
        let query = {};

   if(email){
    query.buyer_email= email;
   }
        const cursor = biddingsCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
      }
    );


    app.post('/bids', async (req, res) => {
      const newBid = req.body;
      console.log("Received:", newProduct);

      const result = await biddingsCollection.insertOne(newBid);
      res.send(result);
    });


     app.delete('/bids/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await biddingsCollection.deleteOne(query);
      res.send(result);
    })


    // singel bids 
     app.get('/bids/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await biddingsCollection.findOne(query);
      res.send(result);
    });




    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
