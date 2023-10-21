const Messages = require("../models/messageModel");

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

// Body = all info 
module.exports.getChatbotRespond = async (req, res, next) => {

  try{
    const {from, to, messageList } = req.body;
    const systemMessage = {
      role: "system",
      content: "Answer the question as a role of a coustomer service agent."
    }

    const chatBotBodyRequest = {
      "model": "gpt-3.5-turbo",
      "messages": [systemMessage,...messageList]
    }
    const details = {
      method: 'POST',
      headers: {
        "Authorization": "Bearer " + process.env.CHATBOT_KEY,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(chatBotBodyRequest)
    }

    const message  = await fetch(process.env.CHATBOT_URL,details ).then((data) => {
      return data.json();
    }).then((data) => {
      return data.choices[0].message.content;
    }).catch((err) => {
      console.log(err);
    });

    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    
    if (data){
      return res.json({ status: true, message:message })
    }
    else{
      return res.json({ status: false })
    }


  }
  catch(ex){
    next(ex);
  } 
}

