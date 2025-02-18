const {
  addAgent,
  getAgents,
  getAgent,
  updateAgent,
  deleteAgent,
} = require("./controller/agentController");

const express = require("express");
const app = express();

app.use(express.json());
const PORT = 4001;

app.post("/add_agent", addAgent);
app.get("/get_agents", getAgents);
app.get("/get_agent/:id", getAgent);
app.put("/update_agent/:id", updateAgent);
app.delete("/delete_agent/:id", deleteAgent);

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
