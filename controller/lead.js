const Leads = require("../schema/leadModel");
const fs = require("fs");
const csvParser = require("csv-parser");
const path = require("path");

const uploadLead = (req, res) => {
  try {
    const filePath = req.file.path;
    const results = [];
    // Reading the CSV file
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data) => results.push(data)) // Push each row into results array
      .on("end", async () => {
        try {
          await Leads.insertMany(results, { ordered: false });
          //console.log("CSV Data:", results);
          res.json(results); // Send parsed data as JSON response
        } catch (error) {
          console.log("error", error);
        }
      });
  } catch (error) {
    console.log("error in uploadLead", error);
    return res.status(500).json({ msg: "server error" });
  }
};

const addLead = async (req, res) => {
  try {
    const { full_name, contact_no } = req.body;
    if (!full_name || !contact_no) {
      return res.status(500).json({ msg: "fill required field" });
    }
    const isExist = await Leads.findOne({ contact_no: contact_no });
    if (isExist) {
      return res.status(500).json({ msg: "lead already exist" });
    }
    const leadObj = new Leads({
      full_name,
      contact_no,
    });
    await leadObj.save();
    return res.status(200).json({ msg: "lead added successfully" });
  } catch (error) {
    console.log("error in addlead", error);
    return res.status(500).json({ msg: "server error" });
  }
};

const getLeads = async (req, res) => {
  try {
    const leads = await Leads.find();
    return res.status(201).json(leads);
  } catch (error) {
    console.log("error in getLeads", error);
    return res.status(500).json({ msg: "server error", success: false });
  }
};

const getLead = async (req, res) => {
  try {
    const leadId = req.params.leadId;
    const lead = await Leads.findOne({ _id: leadId });
    if (!lead) {
      return res.json(500).json({ msg: "lead not found" });
    }
    return res.status(201).json(lead);
  } catch (error) {
    console.log("error in getLead", error);
    return res.status(500).json({ msg: "server error" });
  }
};

const updateLead = async (req, res) => {
  try {
    const leadId = req.params.leadId;
    const lead = await Leads.findOne({ _id: leadId });
    if (!lead) {
      return res.status(500).json({ msg: "lead not found" });
    }
    const { full_name, contact_no } = req.body;
    const updatedLead = await Leads.findOneAndUpdate(
      { _id: leadId },
      { full_name, contact_no }
    );
    return res.status(201).json(updatedLead);
  } catch (error) {
    console.log("error in updateLead", error);
    return res.status(500).json({ msg: "server error" });
  }
};

const deleteLead = async (req, res) => {
  try {
    const leadId = req.params.leadId;
    await Leads.deleteOne({ _id: leadId });
    return res.status(201).json({ msg: "lead deleted successfully" });
  } catch (error) {
    console.log("error in deleteLead", error);
    return res.status(500).json({ msg: "server error" });
  }
};

module.exports = {
  uploadLead,
  addLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
};
