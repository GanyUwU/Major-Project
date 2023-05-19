const mongoose = require("mongoose");
const { uuid } = require("uuidv4");
const ward = require("./ward");

const PrabhagSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    wardId: { type: String, required: true },
  },
  { collection: "prabhag" }
);

const prabhagSchema = mongoose.model("PrabhagSchema", PrabhagSchema);
async function addNewPrabhag(req, res) {
  const { prabhagName, wardId } = req.body;
  if (!prabhagName) {
    return res.json({ status: "error", error: "Prabhag name cannot be empty" });
  }
  try {
    const id = uuid();
   
    await prabhagSchema.create({
      name: prabhagName,
      id,
      wardId,
    });
    return res.json({
      status: "ok",
      message: "Prabhag added successfully",
      data: {
        name: prabhagName,
        id,
      },
    });
  } catch (e) {
    console.log(e);
    return res.json({
      status: "error",
      message: "Error in adding the prabhag",
    });
  }
}

async function getPrabhags(req, res) {
  try {
    const prabhags = await prabhagSchema.find(
      {},
      { id: 1, name: 1, wardId: 1, _id: 0 }
    );
    return res.json({ status: "ok", data: prabhags });
  } catch (e) {
    return res.json({
      status: "error",
      message: "Error in fetching the prabhags",
    });
  }
}

async function addPrabhagtoRepresentative(
  req,
  res,
  prabhagId,
  representativeId
) {
  try {
    await prabhagSchema.findOneAndUpdate(
      { id: prabhagId },
      {
        $set: {
          representativeId,
        },
      }
    );
  } catch (e) {
    return res.json({
      status: "error",
      message: "Error in adding the prabhag to representative",
    });
  }
}
async function showward(){
  if(this.value==='b7933af1-ae62-4296-9138-63a45f3a167a'|| this.value==='Tanajiwadi')
  {
  alert("your ward is 109")
  }
  else if(this.value==='Nahur staion'|| this.value=='cbdaabe7-09f3-4799-81c7-c4ce99874be5')
  {
  alert("your ward is 110")
  }
  else if(this.value==='Bhandup Station'|| this.value=='Nirmal nagar')
  {
  alert("your ward is 112")
  }
  }

module.exports = {
  addNewPrabhag,
  getPrabhags,
  addPrabhagtoRepresentative,
  showward,
  prabhagSchema,
};
