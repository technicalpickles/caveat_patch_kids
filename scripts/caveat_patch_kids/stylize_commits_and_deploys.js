Campfire.CommitExpander = Class.create({
  initialize: function(chat) {
    this.chat = chat;
    var messages = this.chat.transcript.messages;
    for (var i = 0; i < messages.length; i++) {
      this.detectCommit(messages[i]);
    }
  },

  detectCommit: function(message) {
    if (!message.pending() && message.kind === 'text') {
      var body = message.bodyElement()
      if (body.innerText.match(/^\[[\w-\.]+(\/|\])/) || body.innerText.match(/(is deploying|deployment of)/)) {
        message.bodyCell.setStyle({
          color: '#888888'
        })
      }
      else if (body.innerText.match(/^\w+'s deploy of (.*) failed$/)) {
        message.bodyCell.setStyle({
          color: '#ff0000',
          fontWeight: 'bold'
        })
      }
    }
  },

  onMessagesInsertedBeforeDisplay: function(messages) {
    for (var i = 0; i < messages.length; i++) {
      this.detectCommit(messages[i]);
    }
  }
});

Campfire.Responders.push("CommitExpander");
window.chat.installPropaneResponder("CommitExpander", "commitexpander");

