Campfire.DiffExpander = Class.create({
  initialize: function(chat) {
    this.chat = chat;
    var messages = this.chat.transcript.messages;
    for (var i = 0; i < messages.length; i++) {
      this.detectDiff(messages[i]);
    }
    this.chat.windowmanager.scrollToBottom();
  },

  detectDiff: function(message) {
    if (message.kind === 'paste') {
      var code = message.bodyCell.select('pre code')
      if (code.length) {
        var diff = code[0].innerText
        if (diff.match(/^\+\+\+/m)) {
          var lines = diff.split("\n").map(function(line){
            if (line.match(/^(diff|index)/)) {
              return "<b>"+line.escapeHTML()+"</b>"
            } else if (match = line.match(/^(@@.+?@@)(.*)$/)) {
              return "<b>"+match[1]+"</b> " + match[2].escapeHTML()
            } else if (line.match(/^\+/)) {
              return "<font style='color:green'>"+line.escapeHTML()+"</font>"
            } else if (line.match(/^\-/)) {
              return "<font style='color:red'>"+line.escapeHTML()+"</font>"
            } else {
              return line.escapeHTML()
            }
          })
          code[0].innerHTML = lines.join("\n")
        }
      }
    }
  },

  onMessagesInsertedBeforeDisplay: function(messages) {
    var scrolledToBottom = this.chat.windowmanager.isScrolledToBottom();
    for (var i = 0; i < messages.length; i++) {
      this.detectDiff(messages[i]);
    }
    if (scrolledToBottom) {
      this.chat.windowmanager.scrollToBottom();
    }
  },

  onMessageAccepted: function(message, messageID) {
    this.detectDiff(message);
  }
});

Campfire.Responders.push("DiffExpander");
window.chat.installPropaneResponder("DiffExpander", "diffexpander");
