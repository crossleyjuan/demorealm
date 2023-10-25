
async function search(genre) {
  // Find the name of the MongoDB service you want to use (see "Linked Data Sources" tab)
  var serviceName = "Demo";
  
  // Update these to reflect your db/collection
  var dbName = "sample_mflix";
  var collName = "movies";

  // Get a collection from the context
  var collection = context.services.get(serviceName).db(dbName).collection(collName);

  var findResult;
  try {
    // Execute a FindOne in MongoDB 
    findResult = await collection.findOne({ genres: genre });
    
  } catch(err) {
    console.log("Error occurred while executing findOne:", err.message);

    return { error: err.message };
  }
  return findResult;
}

exports = async function(genre){
  return { "result": await search(genre) }
};