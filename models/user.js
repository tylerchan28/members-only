var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    first_name: {type: String, required: true, maxLength: 100},
    last_name: {type: String, required: true, maxLength: 100},
    username: {type: String, required: true, maxLength: 100},
    password: {type: String, required: true, maxLength: 100},
})

module.exports = mongoose.model("User", UserSchema)