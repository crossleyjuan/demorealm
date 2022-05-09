exports = function(request, response){
  const bodyJson = JSON.parse(request.body.text());
    var collection = context.services.get("demo").db("crm").collection("products");
    
    collection.insertOne(bodyJson);
    return { "success": true };
};