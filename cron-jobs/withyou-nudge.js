const { MongoClient } = require('mongodb');

// Your exact clean original connection string
const uri = "mongodb+srv://jellymiso:I0jkdfwvOCYVJ06w@personal-core.o8jyue1.mongodb.net/?appName=Personal-Core";

// Export the function explicitly so index.js can execute it as a callable function module
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

    console.log("Sending a database query request to trigger cluster activity...");
    const doc = await collection.findOne({});
    
    const name = doc ? (doc.her && doc.her.firstName ? doc.her.firstName : "Record Found") : 'No document found';

    await client.close();
    
    // Return a clean serverless response back to the trigger caller
    return res.status(200).json({ 
      success: true, 
      message: `Database successfully nudged! Found: ${name}` 
    });

  } catch (error) {
    try { await client.close(); } catch(e){}
    console.error("❌ Database connection stream failed with error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};
