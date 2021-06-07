var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const { DateTime } = require("luxon");

var MessageSchema = new Schema({
    title: {type: String, required: true, maxLength: 100},
    text: {type: String, required: true, maxLength: 1000},
    timestamp: {type: Date, default: Date.now()},
    user: {type: Object, required: true}
})

MessageSchema
    .virtual("date_formatted")
    .get(function() {
        return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATE_MED);
    })

module.exports = mongoose.model("Message", MessageSchema)