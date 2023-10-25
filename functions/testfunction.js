exports = async function(request, response){
  // This default function will get a value and find a document in MongoDB
  // To see plenty more examples of what you can do with functions see: 
  // https://www.mongodb.com/docs/atlas/app-services/functions/
  
  console.log(JSON.stringify(request.query));

  const genre = request.query.genre;

  const findResult = await context.functions.execute('search_movie', genre);
  return { result: findResult };
};
