exports = async function(request, response){
  // This default function will get a value and find a document in MongoDB
  // To see plenty more examples of what you can do with functions see: 
  // https://www.mongodb.com/docs/atlas/app-services/functions/
  
  console.log(JSON.stringify(request.query));

  const title = request.query.title;
  
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
    findResult = await collection.findOne({ title: title });
    
  } catch(err) {
    console.log("Error occurred while executing findOne:", err.message);

    return { error: err.message };
  }

  // To call other named functions:
  // var result = context.functions.execute("function_name", arg1, arg2);

  return { result: findResult };
};