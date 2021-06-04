var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MessageSchema = ({
    title: {type: String, required: true, maxLength: 100},
    text: {type: String, required: true, maxLength: 1000},
    timestamp: Date.now(),
    user: {type: Schema.Types.ObjectId, ref: "User", required: true}
})

module.exports = mongoose.model("Message", MessageSchema)