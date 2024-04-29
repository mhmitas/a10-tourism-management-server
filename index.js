const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;

// middleware
const corsConfig = {
    origin: ['http://localhost:5173', 'https://redknot-tourism-management.web.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsConfig))
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Let\'s explore South Asia')
})


// `````````````````````mongodb`````````````````````
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jt5df8u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const database = client.db("tourismDB");
        const touristSpotCollection = database.collection("touristSpots");

        app.get('/tourist-spots', async (req, res) => {
            const cursor = touristSpotCollection.find({});
            const allValues = await cursor.toArray();
            res.send(allValues);
        })

        app.get('/tourist-spots/user/:email', async (req, res) => {
            const userEmail = req.params.email;
            const query = { email: userEmail };
            const cursor = touristSpotCollection.find(query)
            const allValues = await cursor.toArray()
            res.send(allValues)
        })

        app.get('/tourist-spots/detail/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id)
            const query = { _id: new ObjectId(id) }
            const cursor = await touristSpotCollection.findOne(query)
            res.send(cursor)
        })

        app.get('/tourist-spots/limit/:num', async (req, res) => {
            const limit = parseInt(req.params.num);
            const cursor = touristSpotCollection.find().limit(limit);
            const result = await cursor.toArray()
            res.send(result);
        })

        app.get('/tourist-spots/sort/:value', async (req, res) => {
            const value = parseInt(req.params.value)
            const sort = { average_cost: value }
            const cursor = touristSpotCollection.find().sort(sort)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/tourist-spots', async (req, res) => {
            const touristSpot = req.body;
            const result = await touristSpotCollection.insertOne(touristSpot);
            res.send(result)
        })

        app.put('/tourist-spots/update/:id', async (req, res) => {
            const id = req.params.id
            const updatedSpot = req.body;
            const { image, tourist_spot_name, country_name, average_cost, short_description, location, seasonality, total_visitor_per_year, travel_time } = updatedSpot
            // console.log(updatedSpot)
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    tourist_spot_name, country_name, location, average_cost, seasonality, travel_time, total_visitor_per_year, image, short_description
                }
            }
            const result = await touristSpotCollection.updateOne(filter, updateDoc)
            res.send(result)
        })

        app.delete('/tourist-spots/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await touristSpotCollection.deleteOne(query);
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!😀"); // remove before submit
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.listen(port, () => {
    console.log(`tourism management server is listening on port ${port}`)
})