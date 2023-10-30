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

async function patch(endpoint, data) {
  const arg = { 
    scheme: 'https', 
    host: 'cloud.mongodb.com', 
    path: 'api/atlas/v2/' + endpoint, 
    username: username, 
    password: password,
    headers: {
      'Content-Type': ['application/json'], 
      'Accept-Encoding': ['bzip, deflate'],
      'Accept': ['application/vnd.atlas.2023-02-01+json']
    }, 
    digestAuth:true,
    body: JSON.stringify(data)
  };
  
  const response = await context.http.patch(arg);
  
  return JSON.parse(response.body.text());
  
}

function print(data) {
  console.log(JSON.stringify(data));
}

async function getUsers(groupId) {
  res = await get(`groups/${groupId}/databaseUsers`, {});
  return res["results"];
}

async function addRoleForUser(groupId, roleToAdd, userData) {
  const roles = userData["roles"];
  roles.push({ "databaseName": "admin", "roleName": roleToAdd });
  const databaseName = userData["databaseName"];
  const username = userData["username"];
  print(await patch(`groups/${groupId}/databaseUsers/${databaseName}/${username}`, userData));
  
}

async function addRole(groupId, username, roleToAdd) {
  const users = await getUsers(groupId);
  users.forEach(u => {
    if (u["username"] == username) {
      addRoleForUser(groupId, roleToAdd, u);
    }
  })
}

exports = async function(arg){
  const groupId = "5bc75019d5ec1361b802eeb1";
  const clusterName = "Demo";
  const roleToAdd = "test";
  const username = "testuser";

  addRole(groupId, username, roleToAdd);
};