require('dotenv').config(); 
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI; 

module.exports = async (req, res) => {
  console.log("Connecting directly to MongoDB Atlas cluster from Vercel Cloud Server...");
  const client = new MongoClient(uri, { 
    connectTimeoutMS: 15000, 
    socketTimeoutMS: 15000 
  });

  try {
    await client.connect();
    
    const database = client.db('0802-I-LOVE-YOU');
    const collection = database.collection('withyou_us');

    console.log("Submitting secure query projection to trigger cluster activity...");
    // The projection flag { projection: { _id: 1 } } strips out all data columns completely
    const doc = await collection.findOne({}, { projection: { _id: 1 } });
    
    // Safely extract the hex string representation of the target document _id
    const targetId = doc && doc._id ? doc._id.toString() : "NO_RECORD_FOUND";

    await client.close();
    
    // Return the response showcasing the exact record id you requested
    return res.status(200).json({ 
      success: true, 
      message: "Successfully nudged.",
      withyou_us_id: targetId
    });

  } catch (error) {
    try { await client.close(); } catch(e){}
    console.error("❌ Database connection stream failed with error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};
