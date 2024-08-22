const express = require("express");
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const PORT = 8080;

const MY_ACCESS_KEY="45568114-e8ead86ea7218b1cce79f7d1d";

app.use(bodyParser.json());  // Middleware to parse JSON bodies

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/orders', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define the Order Schema
const orderSchema = new mongoose.Schema({
    email: { type: String, required: true },
    fullName: { type: String, required: true },
    fullAddress: { type: String, required: true },
    imageUrls: { type: [String], required: true },
    frameColor: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Assuming a User model
}, { timestamps: true });

// Create the Order Model
const Order = mongoose.model('Order', orderSchema);


app.get("/api/images",  (req, res) => {
	const number = req.query.number;
    if (number) {
        // Send a greeting message as the response
		makeRequest()		
		 .then((json) => {res.json(json);})
		 .catch((error) => {res.status(500).send('An error occured ' + error)});
    } else {
        // Send an error message if the 'name' parameter is missing
        res.status(400).send('number parameter is required.');
    }	
  });
  
async function makeRequest() {
    try {
        const response = await fetch(`https://pixabay.com/api/?key=${MY_ACCESS_KEY}`);

        if (response.status === 429) {  // 429 is the status code for "Too Many Requests"
            const retryAfter = response.headers.get('Retry-After') || 60; // Retry-After header or a default value

            console.log(`Rate limit exceeded. Retrying after ${retryAfter} seconds...`);
            await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));

            return makeRequest();  // Retry the request
        }

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
		
        const data = await response.json();
        return data;

    } catch (error) {
		console.error('Error:', error);
        throw new Error('Error: ${error}');
    }
}

// Define the POST endpoint to create a new order
app.post('/orders', async (req, res) => {
    try {
        const { email, fullName, fullAddress, imageUrls, frameColor, user } = req.body;

        // Create a new order document
        const newOrder = new Order({
            email,
            fullName,
            fullAddress,
            imageUrls,
            frameColor,
            user,
        });

        // Save the order in the database
        const savedOrder = await newOrder.save();

        // Return the created order
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/orders/user', async (req, res) => {
    const userId = req.query.userId;
	if (userId) {
		try {
        // Find orders where the 'user' field matches the provided userId
        const userOrders = await Order.find({ user: userId });

        // Return the found orders
        res.status(200).json(userOrders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
	}
	else {
        // Send an error message if the 'name' parameter is missing
        res.status(400).send('userId parameter is required.');
	}
});



app.listen(PORT, () => console.log(`backend service started on port ${PORT}`));