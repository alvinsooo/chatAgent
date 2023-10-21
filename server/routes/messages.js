const { addMessage, getMessages,getChatbotRespond } = require("../controllers/messageController");
const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);
router.post("/getchatbotrespond/", getChatbotRespond);

module.exports = router;
