const jwt = require("jsonwebtoken");
require("dotenv").config();

const authAccess = {
  agent: ["get_lead", "upload_lead", "update_lead"],
  team_leader: [
    "get_lead",
    "add_lead",
    "add_product_service",
    "get_product_service",
  ],
};

const isAuthorized = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.send("unauthorized");
    }
    const decode = jwt.verify(token, process.env.JWTSECRET);
    console.log(decode);
    if (decode.role == "agent") {
      if (authAccess.agent.find((v) => req.path.includes(v))) {
        next();
        return;
      } else {
        return res.status(401).json({ msg: "you are unauthorized" });
      }
    } else if (decode.role == "team_leader") {
      if (authAccess.team_leader.find((v) => req.path.includes(v))) {
        next();
        return;
      } else {
        return res.status(401).json({ msg: "you are unauthorized" });
      }
    }
    console.log("decode", decode);
    // console.log("routes", req.originalUrl);
    // console.log("path", req.path);
    next();
  } catch (err) {
    res.send("unauthorized");
  }
};
module.exports = { isAuthorized };
