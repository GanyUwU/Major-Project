const mongoose = require("mongoose");
const { uuid } = require("uuidv4");

const GrievancesSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    userId: { type: String, required: true },
    status: { type: String },
    wardId: { type: String },
    createdOn: { type: Number, required: true },
    complaint: { type: String, required: true },
  },
  { collection: "grievances" }
);

const grievancesSchema = mongoose.model("GrievancesSchema", GrievancesSchema);

async function addNewGrievance(req, res) {
  const { complaint, userId, wardId } = req.body;
  try {
    const id = uuid();
    await grievancesSchema.create({
      complaint,
      userId,
      wardId,
      id,
      createdOn: new Date().getTime(),
      status: "New",
    });
    return res.json({
      status: "ok",
      message: "Grievance added successfully",
    });
  } catch (e) {
    console.log(e);
    return res.json({
      status: "error",
      message: "Error in adding the grievance",
    });
  }
}

async function getGrievances(req, res) {
  const { wardId } = req.params;
  try {
    const response = await grievancesSchema.find({ wardId });
    return res.json({
      status: "ok",
      data: response,
    });
  } catch (e) {
    console.log(e);
    return res.json({
      status: "error",
      message: "Error in fetching the grievances",
    });
  }
}

module.exports = { addNewGrievance, getGrievances };
