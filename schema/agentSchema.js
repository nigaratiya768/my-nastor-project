const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema(
  {
    agent_name: {
      type: String,
      required: true,
    },
    agent_email: {
      type: String,
      required: true,
      unique: true,
    },
    agent_mobile: {
      type: Number,
      required: true,
      unique: true,
    },
    agent_password: {
      type: String,
      required: true,
    },

    agent_role: {
      type: String,
      default: "agent", //there are four types of role agent, groupleader, teamleader& admin
    },
    profile_image: {
      type: String,
    },
    agents: [{ type: mongoose.Schema.ObjectId, ref: "crm_agent" }],
    agent_status: {
      type: Number,
      default: 1, //1 means agent is active & 0 means inactive
    },
  },
  {
    timestamps: true,
  }
);

const Agents = mongoose.model("crm_agent", agentSchema);
module.exports = Agents;
