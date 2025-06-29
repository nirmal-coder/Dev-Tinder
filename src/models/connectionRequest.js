const { Schema, model } = require("mongoose");

const connectionRequestSchema = new Schema(
  {
    fromUserId: {
      type: Schema.ObjectId,
      ref: "User",
      required: [true, "From user id is required!"],
    },
    toUserId: {
      type: Schema.ObjectId,
      ref: "User",
      required: [true, "To user id is required!"],
    },
    status: {
      type: String,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: "{VALUE} was not a valid status",
      },
      required: [true, "Status is required!"],
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId))
    throw new Error("User connot give request to yourself..");
  next();
});
const ConnectionRequest = model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;
