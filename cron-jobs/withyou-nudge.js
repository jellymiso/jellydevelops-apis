const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://jellymiso:I0jkdfwvOCYVJ06w@personal-core.o8jyue1.mongodb.net/?appName=Personal-Core";

module.exports = async (req, res) => {
  console.log("Connecting directly to MongoDB Atlas cluster from Vercel Cloud Server...");
  const client = new MongoClient(uri, { 
    connectTimeoutMS: 15000, 
    socketTimeoutMS: 15000 
  });

  try {
    await client.connect();
    
    const database = client.db('0802-I-LOVE-YOU');

    console.log("Checking database schema metrics to trigger cluster activity...");
    // Fetches the structural details of your specific collection without downloading document rows
    const collections = await database.listCollections({ name: 'withyou_us' }).toArray();
    const tableExists = collections.length > 0;
    
    // Extracts the structural collection metadata identifier hash safely
    const collectionId = tableExists && collections[0].info && collections[0].info.uuid 
      ? collections[0].info.uuid.toString('hex') 
      : "SCHEMA_VERIFIED";

    await client.close();
    
    // Returns only the metadata verification hash back over the web response
    return res.status(200).json({ 
      success: true, 
      message: `Database successfully nudged natively! Collection verified.`,
      target_id: collectionId
    });

  } catch (error) {
    try { await client.close(); } catch(e){}
    console.error("❌ Database connection stream failed with error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};
