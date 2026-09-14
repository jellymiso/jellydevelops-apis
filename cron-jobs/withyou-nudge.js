(async () => {
  // Native DNS utility override to clear the connection lock on the NAS
  const dns = require('dns');
  if (dns.setServers) {
    dns.setServers(['8.8.8.8']);
  }

  const { MongoClient } = await import('mongodb');

  // Your exact MongoDB Atlas connection string
  const uri = "mongodb+srv://jellymiso:I0jkdfwvOCYVJ06w@personal-core.o8jyue1.mongodb.net/?appName=Personal-Core";

  console.log("Connecting directly to MongoDB Atlas cluster from NAS...");
  const client = new MongoClient(uri, { 
    connectTimeoutMS: 10000, 
    socketTimeoutMS: 10000 
  });

  try {
    await client.connect();
    
    const database = client.db('0802-I-LOVE-YOU');
    const collection = database.collection('withyou_us');

    console.log("Sending a database query request to trigger cluster activity...");
    const doc = await collection.findOne({});
    
    console.log(`Successfully fetched record for: ${doc ? doc.her.firstName : 'No document found'}`);
    console.log("✅ Database successfully nudged natively from the NAS!");

  } catch (error) {
    console.error("❌ Database connection stream failed:", error.message);
  } finally {
    await client.close();
    console.log("Connection pool closed cleanly.");
  }
})();
