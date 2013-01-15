Campfire.NagiosExpander = Class.create({
  initialize: function(chat) {
    this.chat = chat;
    var messages = this.chat.transcript.messages;
    for (var i = 0; i < messages.length; i++) {
      this.detectNagios(messages[i]);
    }
  },

  detectNagios: function(message) {
    if (!message.pending() && message.kind === 'text') {
      var body = message.bodyElement()
      var author = message.author();
      var email = message.authorElement().getAttribute('data-email');
      if (body.innerText.match(/^Nagios : /) || (email && email.match(/nagios/i))) {
        if (body.innerText.match(/PROBLEM/)) {
          message.bodyCell.setStyle({
            color: "#ef2929"
          })
        } else if (body.innerText.match(/WARNING/)) {
          message.bodyCell.setStyle({
            color: "#fce94f"
          })
        } else if (body.innerText.match(/RECOVERY/)) {
          message.bodyCell.setStyle({
            color: "#4e9a06"
          })
        }
      }
    }
  },

  onMessagesInsertedBeforeDisplay: function(messages) {
    for (var i = 0; i < messages.length; i++) {
      this.detectNagios(messages[i]);
    }
  },
  
  onMessageAccepted: function(message, messageID) {
    this.detectNagios(message);
  }
});

Campfire.Responders.push("NagiosExpander");
window.chat.installPropaneResponder("NagiosExpander", "nagiosexpander");
