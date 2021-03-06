var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    first_name: {type: String, required: true, maxLength: 100},
    last_name: {type: String, required: true, maxLength: 100},
    username: {type: String, required: true, maxLength: 100},
    password: {type: String, required: true, maxLength: 100},
    member: {type: Boolean, default: false},
    admin: {type: Boolean, default: false}
})

module.exports = mongoose.model("User", UserSchema)