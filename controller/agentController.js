const mongoose = require("mongoose");
const Agents = require("../schema/agentSchema");
const bcrypt = require("bcrypt");
const salt = 10;
const jwt = require("jsonwebtoken");
const { getJWTToken } = require("../helper/helper");

const createAgent = async (req, res) => {
  try {
    const {
      agent_name,
      agent_email,
      agent_mobile,
      agent_password,
      agents,
      agent_role, //agent,team_leader,group_leader
    } = req.body;
    if (!agent_name) {
      return res
        .status(400)
        .json({ msg: "agent_name is missing", success: false });
    }
    if (!agent_email) {
      return res
        .status(400)
        .json({ msg: "agent_email is missing", success: false });
    }
    if (!agent_mobile) {
      return res
        .status(400)
        .json({ msg: "agent_mobile number is missing ", success: false });
    }
    if (agent_password.length < 8) {
      return res
        .status(400)
        .json({ msg: "password must be of 8 characters", success: false });
    }
    const agentExist = await Agents.findOne({ agent_email });
    if (agentExist) {
      return res
        .status(400)
        .json({ msg: "email already exist", success: false });
    }
    const hashPassword = bcrypt.hashSync(agent_password, salt);

    const agentObj = new Agents({
      agent_name,
      agent_email,
      agent_mobile,
      agent_password: hashPassword,
      agent_role,
      agents,
    });

    await agentObj.save();
    return res
      .status(200)
      .json({ msg: "agent added successfully", suceess: true });
  } catch (error) {
    console.log("error in createAgent", error);
    return res.status(500).json({ msg: "server error ", success: false });
  }
};

const getAgent = async (req, res) => {
  try {
    const id = req.params.id;
    const agent = await Agents.findOne({ _id: id });
    if (!agent) {
      res.send("there isn't any agent of this id");
    }
    return res.json(agent);
  } catch (error) {
    console.log("error in getAgent");
    return res.status(500).send("server error");
  }
};

const getAgents = async (req, res) => {
  try {
    let agents = await Agents.find();
    return res.json(agents);
  } catch (error) {
    console.log("error in getAgents");
    return res.status(500).send("server error");
  }
};

const updateAgent = async (req, res) => {
  try {
    const id = req.params.id;
    let agent = await Agents.findOne({ _id: id });
    if (!agent) {
      res.send("ther isn't any agent of this id");
    }
    let { new_name, new_email, new_mobile } = req.body;
    agent.agent_name =
      new_name == "" || new_name == undefined ? agent.agent_name : new_name;
    agent.agent_email =
      new_email == "" || new_email == undefined ? agent.agent_email : new_email;
    agent.agent_mobile =
      new_mobile == "" || new_mobile == undefined
        ? agent.agent_mobile
        : new_mobile;
    await agent.save();
    return res.send("agent updated successfully");
  } catch (error) {
    console.log("error in updateAgent");
    res.status(500).send("server error");
  }
};

const deleteAgent = async (req, res) => {
  try {
    const id = req.params.id;
    const delAgent = await Agents.deleteOne({ _id: id });
    return res.send("agent deleted successfully");
  } catch (error) {
    console.log("error in deleteAgent", error);
    return res.status(500).send("server error");
  }
};

//getting all team_leaders

const getAllTeamLeaders = async (req, res) => {
  try {
    let allTeamLeaders = await Agents.find({ agent_role: "team_leader" });
    return res.status(200).json(allTeamLeaders);
  } catch (error) {
    console.log("error in getAllTeamLeaders");
    return res.status(500).json({ msg: "server error" });
  }
};

//getting all agents by team_leader

const getAllAgentByTeamLeader = async (req, res) => {
  try {
    const team_leader_id = req.query.team_leader_id;
    const teamLeader = await Agents.findOne({ _id: team_leader_id });

    const agentsByTeamLeader = await Agents.find({
      _id: { $in: teamLeader.agents },
    });

    return res.status(200).json(agentsByTeamLeader);
  } catch (error) {
    console.log("error in getAllAgentByTeamLeader");
    return res.status(500).json({ msg: "server error" });
  }
};

//getting team_leader by agents

const getTeamLeaderByAgent = async (req, res) => {
  try {
    const agent_id = req.query.agent_id;

    const teamLeaderByAgent = await Agents.findOne({
      agents: { $in: [agent_id] },
    });

    return res.status(200).json(teamLeaderByAgent);
  } catch (error) {
    console.log("error in getTeamLeaderByAgent", error);
    return res.status(500).json({ msg: "server error" });
  }
};

module.exports = {
  createAgent,
  getAgent,
  getAgents,
  updateAgent,
  deleteAgent,
  getAllTeamLeaders,
  getAllAgentByTeamLeader,
  getTeamLeaderByAgent,
};
