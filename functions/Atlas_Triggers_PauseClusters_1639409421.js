
exports = async function() {
  
  // Supply projectID and clusterNames...
  const projectID = '5bc75019d5ec1361b802eeb1';

// Get stored credentials...
  const username = context.values.get("PublicKey");
  const password = context.values.get("PrivateKey");

  const clusters = await context.functions.execute('getAllClusters', username, password, projectID);
  
  const clusterNames = clusters["results"].map(c => c["name"]);
  
  console.log(JSON.stringify(clusterNames));
  
  // Set desired state...
  const body = {paused: true};

  var result = "";
  clusterNames.forEach(async function (name) {
    result = await context.functions.execute('modifyCluster', username, password, projectID, name, body)
    console.log("Cluster " + name + ": " + EJSON.stringify(result));
    
    if (result.error) { 
      return result;
    }
  })

  return clusterNames.length + " clusters paused";   
  /*
  return new Promise((resolve, reject) => {
    const https = require('https');
    const projectId = "";
    const baseURL = "https://cloud.mongodb.com/api/atlas/v1.0/";
    const getallclusters = "/groups/" + projectId + "/clusters";
  
    const options = {
      digestAuth: "ahryzxsc:900c60ed-6054-4feb-829c-e718d14f98f5"
    };
    const patch = "/groups/" + projectId + "/clusters/{CLUSTER-NAME}";
    
    https.get(baseURL + getallclusters, options, (resp) => {
      console.log("callin");
      let data = '';
    
      // A chunk of data has been received.
      resp.on('data', (chunk) => {
        data += chunk;
        console.log("data " + data);
      });
    
      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        resolve(JSON.parse(data).explanation);
      });
    
    }).on("error", (err) => {
      console.log("error");
      reject("Error: " + err.message);
    });
  })
  */
  
};

