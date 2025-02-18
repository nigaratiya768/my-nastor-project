const mongoose = require("mongoose");
const Agents = require("../schema/agentSchema");
const bcrypt = require("bcrypt");
const salt = 10;
const jwt = require("jsonwebtoken");
const { getJWTToken } = require("../helper/helper");

const addAgent = async (req, res) => {
  try {
    const {
      agent_name,
      agent_email,
      agent_mobile,
      agent_password,
      agent_role,
    } = req.body;
    if (!agent_name) {
      return res.status(400)({ msg: "agent_name is missing", success: false });
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
    const agentExist = await Agents.findOne({ email });
    if (agentExist) {
      return res
        .status(400)
        .json({ msg: "email already exist", success: false });
    }
    const hashPassword = bcrypt.hashSync(password, salt);

    const agentObj = new Agents({
      agent_name,
      agent_email,
      agent_mobile,
      agent_password: hashPassword,
      agent_role,
    });

    await agentObj.save();
    return res
      .status(200)
      .json({ msg: "agent added successfully", suceess: true });
  } catch (error) {
    console.log("error in addAgent", error);
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
    let { newName, newEmail, newMobile } = req.body;
    agent.agent_name =
      newName == "" || newName == undefined ? agent_name : newName;
    agent.agent_email =
      newEmail == "" || newEmail == undefined ? agent_email : newEmail;
    agent.agent_mobile =
      newMobile == "" || newMobile == undefined ? agent_mobile : newMobile;
    await agent.save();
    return res.send("agent updated successfully");
  } catch (error) {
    console.log("error in updateAgent");
    res.status(500).send("server error");
  }
};

const deleteAgent = (req, res) => {
  try {
    const id = req.params.id;
    const delAgent = Agents.deleteOne({ _id: id });
    return res.send("agent deleted successfully");
  } catch (error) {
    console.log("error in deleteAgent", error);
    return res.status(500).send("server error");
  }
};

module.exports = { addAgent, getAgent, getAgents, updateAgent, deleteAgent };
