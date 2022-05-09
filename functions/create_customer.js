exports = function(request, response){
  const bodyJson = JSON.parse(request.body.text());
  bodyJson["created"] = new date();
  var collection = context.services.get("demo").db("crm").collection("customers");

  collection.insertOne(bodyJson);
  return { "success": true };
};
