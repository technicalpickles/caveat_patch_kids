Campfire.HTMLExpander = Class.create({
  initialize: function(chat) {
    this.chat = chat;
    // var messages = this.chat.transcript.messages;
    // for (var i = 0; i < messages.length; i++) {
    //   this.detectHTML(messages[i]);
    // }
    // this.chat.windowmanager.scrollToBottom();
  },

  detectHTML: function(message) {
    if (!message.pending() && ['text','paste'].include(message.kind)) {
      var body = message.bodyElement()
      var match = body.innerText.match(/^HTML!\s+(.+)$/m);

      // Some people can't handle this much fun
      var halt = SOUND_HATERS.include(this.chat.username) && body.innerText.match(/<audio/)

      if (!halt && match && !body.innerText.match(/<\s*script/)) {
        body.update(match[1])
      }
    }
  },

  onMessagesInsertedBeforeDisplay: function(messages) {
    var scrolledToBottom = this.chat.windowmanager.isScrolledToBottom();
    for (var i = 0; i < messages.length; i++) {
      this.detectHTML(messages[i]);
    }
    if (scrolledToBottom) {
      this.chat.windowmanager.scrollToBottom();
    }
  },

  onMessageAccepted: function(message, messageID) {
    this.detectHTML(message);
  }
});

Campfire.Responders.push("HTMLExpander");
window.chat.installPropaneResponder("HTMLExpander", "htmlexpander");

