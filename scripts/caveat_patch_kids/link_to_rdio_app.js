Campfire.RdioExpander = Class.create({
  initialize: function(chat) {
    this.chat = chat;
    var messages = this.chat.transcript.messages;
    for (var i = 0; i < messages.length; i++) {
      this.detectRdioURL(messages[i]);
    }
  },

  detectRdioURL: function(message) {
    if (!message.pending() && message.kind === 'text') {
      var body = message.bodyElement()
      var links = message.bodyElement().select('a:not(image)');

      for (var i = 0; i < links.length; i++) {
        var link = links[i];
        var href = link.getAttribute('href');
        var match = href.match(/^http:\/\/(rd\.io\/x\/\w*)$/)
        if (match) {
          var rdioHref = "rdio://" + match[1];
          link.setAttribute('href', rdioHref);
        }
      }
    }
  },

  onMessagesInsertedBeforeDisplay: function(messages) {
    for (var i = 0; i < messages.length; i++) {
      this.detectRdioURL(messages[i]);
    }
  },
  
  onMessageAccepted: function(message, messageID) {
    this.detectRdioURL(message);
  }

});

Campfire.Responders.push("RdioExpander");
window.chat.installPropaneResponder("RdioExpander", "rdioexpander");
