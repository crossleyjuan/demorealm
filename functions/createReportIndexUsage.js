const username = "lpjpjldb";
const password = "a7bcf56b-4025-47f5-b6c3-1fff07f18ebd";
const usageThreshold = 100;

async function get(endpoint, query) {
  const arg = { 
    scheme: 'https', 
    host: 'cloud.mongodb.com', 
    path: 'api/atlas/v2/' + endpoint, 
    query: query,
    username: username, 
    password: password,
    headers: {
      'Content-Type': ['application/json'], 
      'Accept-Encoding': ['bzip, deflate'],
      'Accept': ['application/vnd.atlas.2023-02-01+json']
    }, 
    digestAuth:true
  };
  
  const response = await context.http.get(arg);
  
  return JSON.parse(response.body.text());
  
}

async function register_indexStats(service, dbName, collName, stat, startTime) {
  const db = service.db(dbName);

  if (stat["accesses"]["ops"] < usageThreshold) {
    service.db("reportStats").collection("indexesStats").updateOne({ "dbName": dbName, "collName": collName, "indexName": stat["name"] }, { $min: { "since": stat["accesses"]["since"] }}, { upsert: true });
  } else {
    service.db("reportStats").collection("indexesStats").deleteOne({ "dbName": dbName, "collName": collName, "indexName": stat["name"] });
  }
}

async function getServerStartTime(groupId, processId) {
  const res = await get(`groups/${groupId}/processes/${processId}/measurements`, { "period": ["PT10H"], "granularity": ["PT1M"] });
  const startDate = res["start"];
  return startDate;
}

async function getAllProcesses(groupId) {
  const url = `groups/${groupId}/processes`;
  console.log(url);
  const processes = (await get(url, {}))["results"];
  processes.forEach(async p => {
    const startTime = await getServerStartTime(groupId, p["id"])
    
  });
}

async function check_db(service, dbName, startTime) {
  const db = service.db(dbName);
  const collections = db.getCollectionNames();
  
  collections.forEach(async collName => {
    const coll = db.collection(collName);
    const indexStats = await coll.aggregate([ { "$indexStats": {} }]).toArray();
    
    indexStats.forEach(indexStat => {
      register_indexStats(service, dbName, collName, indexStat, startTime);
    })
  });
}

function print(data) {
  console.log(JSON.stringify(data));
}
async function processProjects() {
  await getAllProcesses("5bc75019d5ec1361b802eeb1");
}

function getServersFromConnectionString(connectionString) {
  connectionString = connectionString.substr("mongodb://".length);
  connectionString = connectionString.substr(0, connectionString.indexOf("/"));
  return connectionString.split(",");
}
async function getClusters(groupId) {
  res = await get(`groups/${groupId}/clusters`, {});
  return res["results"];
}

async function getCluster(groupId, clusterName) {
  res = await get(`groups/${groupId}/clusters/${clusterName}`, {});
  return res;
}

async function processCluster(service, groupId, cluster, databases) {
    const processes = getServersFromConnectionString(cluster["connectionStrings"]["standard"]);
    processes.forEach(async p => {
      const startTime = await getServerStartTime(groupId, p);
      
      databases.forEach(d => check_db(service, d, startTime));
    });
}

exports = async function(arg){
  const serviceName = "Demo";
  const service = context.services.get(serviceName);

  const databases   = ["sample_mflix", "sample_training"];
  
  const groupId = "5bc75019d5ec1361b802eeb1";
  const clusterName = "Demo";
  
  const cluster = await getCluster(groupId, clusterName);
  processCluster(service, groupId, cluster, databases);

};