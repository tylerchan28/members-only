var Message = require("../models/message");

exports.get_messages = async function(req, res, next) {
    try {
        const messages = await Message.find({});
        if (!messages) {
            return next("No messages.")
    }
    res.render("index", { user: req.user, messages: messages })
} catch (err) {
    return next(err)
}
}
exports.create_message = function(req, res, next) {
    const message = new Message({
        user: req.user,
        text: req.body.text,
        timestamp: Date.now(),
        title: req.body.title
    }).save((err) => {
        if (err) { return next(err) }
        res.redirect("/");
    })
}