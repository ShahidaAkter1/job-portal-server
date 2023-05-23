const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app= express();
const port = process.env.PORT || 5000;
require("dotenv").config()
// middleware
app.use(cors());
app.use(express.json());


// console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fmduwbp.mongodb.net/?retryWrites=true&w=majority`;

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

    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const db=client.db("jobPortal");
    const jobsCollection = db.collection("jobs");
    console.log('database connected');


//post
    app.post("/postjob", async(req,res)=>{
      const body=req.body;

      //validation
      if(!body){
        return res.status(404).send({message: "body data not found"})

      }
      
      const result=await jobsCollection.insertOne(body);
      console.log(body);
      res.send(result)
    })

    //get all jobs
    app.get("/allJobs/:", async(req,res)=>{
      const result= await jobsCollection.find({}).toArray();
      res.send(result);
    })








  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res) =>{
    res.send('Job Portal is running')
})

app.listen(port, ()=>{
    console.log(`Job Portal Server is running on port ${port}`);
})