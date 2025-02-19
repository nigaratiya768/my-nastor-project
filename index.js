const {
  getAgents,
  getAgent,
  updateAgent,
  deleteAgent,
  createAgent,
  getAllTeamLeaders,
  getAllAgentByTeamLeader,
  getTeamLeaderByAgent,
} = require("./controller/agentController");

const express = require("express");
const app = express();
const { connectWithDB } = require("./database_connect/connect_mongodb");
connectWithDB();

app.use(express.json());
const PORT = 4001;

app.post("/add_agent", createAgent);
app.get("/get_agents", getAgents);
app.get("/get_agent/:id", getAgent);
app.put("/update_agent/:id", updateAgent);
app.delete("/delete_agent/:id", deleteAgent);
app.get("/get_all_team_leaders", getAllTeamLeaders);
app.get("/get_all_agent_by_team_leader", getAllAgentByTeamLeader);
app.get("/get_team_leader_by_agent", getTeamLeaderByAgent);

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
