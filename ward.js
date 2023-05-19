const mongoose = require("mongoose");
const { uuid } = require("uuidv4");

const WardSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    representativeId: { type: String, required: false },
  },
  { collection: "ward" }
);

const wardSchema = mongoose.model("WardSchema", WardSchema);

async function addNewWard(req, res) {
  const { wardName } = req.body;
  if (!wardName) {
    return res.json({ status: "error", error: "Ward name cannot be empty" });
  }
  try {
    const id = uuid();
    await wardSchema.create({
      name: wardName,
      id,
    });
    return res.json({
      status: "ok",
      message: "Ward added successfully",
      data: {
        name: wardName,
        id,
      },
    });
  } catch (e) {
    console.log(e);
    return res.json({ status: "error", message: "Error in adding the ward" });
  }
}

async function getWards(req, res) {
  try {
    const wards = await wardSchema.find({}, { id: 1, name: 1, _id: 0 });
    console.log(wards);
    return res.json({ status: "ok", data: wards });
  } catch (e) {
    return res.json({
      status: "error",
      message: "Error in fetching the wards",
    });
  }
}

async function addWardtoRepresentative(req, res, wardId, representativeId) {
  try {
    await wardSchema.findOneAndUpdate(
      { id: wardId },
      {
        $set: {
          representativeId,
        },
      }
    );
  } catch (e) {
    return res.json({
      status: "error",
      message: "Error in adding the ward to representative",
    });
  }
}

module.exports = { addNewWard, getWards, addWardtoRepresentative, wardSchema };
