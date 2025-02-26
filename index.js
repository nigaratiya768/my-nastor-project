const {
  getAgents,
  getAgentDetails,
  updateAgent,
  deleteAgent,
  createAgent,
  getAllTeamLeaders,
  getAllAgentByTeamLeader,
  getTeamLeaderByAgent,

  getGroupLeaderByTeamLeader,
  getAllTeamLeadersByGroupLeader,
  login,
} = require("./controller/agentController");

const express = require("express");
const app = express();
const { connectWithDB } = require("./database_connect/connect_mongodb");
const upload = require("./config/upload_file");
const uploadFile = require("./controller/file_controller");
const {
  uploadProductService,
  addProductService,
  updateProductService,
  getProductService,
  getProductsServices,
  deleteProductService,
} = require("./controller/productServiceController");
const { isAuthorized } = require("./middleware/auth");
const {
  addLead,
  getLeads,
  updateLead,
  getLead,
  deleteLead,
  uploadLead,
} = require("./controller/lead");

connectWithDB();
global.rootPath = __dirname;
app.use(express.json());
const PORT = 4001;

app.post("/add_agent", createAgent);
app.get("/get_agents", getAgents);
app.get("/get_agent_details/:id", getAgentDetails);
app.put("/update_agent/:id", updateAgent);
app.delete("/delete_agent/:id", deleteAgent);
app.get("/get_all_team_leaders", getAllTeamLeaders);
app.get("/get_all_agent_by_team_leader", getAllAgentByTeamLeader);
app.get("/get_team_leader_by_agent", getTeamLeaderByAgent);
app.get("/get_group_leader_by_team_leader", getGroupLeaderByTeamLeader);
app.get(
  "/get_all_team_leaders_by_group_leader",
  getAllTeamLeadersByGroupLeader
);
app.post("/login", login);

app.post(
  "/upload_file",
  isAuthorized,
  upload.single("file"),
  uploadFile.uploadFile
);

//TODO:need to update
// function arrayIntoObj(arr){
//   for(i=0;i<arr.length;i++){

//   }
// }

app.post("/uploadExcelFIle", upload.single("file"), uploadFile.uploadExcelFile);

app.post("/uploadProductService", upload.single("file"), uploadProductService);

app.post("/add_product_service", isAuthorized, addProductService);
app.put(
  "/update_product_service/:productId",
  isAuthorized,
  updateProductService
);
app.get("/get_product_service/:productId", getProductService);
app.get("/get_products_services", getProductsServices);
app.delete(
  "/delete_product_service/:productId",
  isAuthorized,
  deleteProductService
);

app.post("/add_lead", isAuthorized, addLead);
app.get("/get_leads", getLeads);
app.get("/get_lead/:leadId", getLead);
app.put("/update_lead/:leadId", isAuthorized, updateLead);
app.delete("/delete_lead/:leadId", isAuthorized, deleteLead);
app.post("/upload_lead", isAuthorized, upload.single("leadData"), uploadLead);

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});

//console.log(process.env);
