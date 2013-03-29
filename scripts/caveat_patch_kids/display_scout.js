Campfire.ScoutGraphExpander = Class.create({
  initialize: function(chat) {
    this.chat = chat;
    var messages = this.chat.transcript.messages;
    for (var i = 0; i < messages.length; i++) {
      this.detectScoutGraphUrl(messages[i]);
    }
  },

  detectScoutGraphUrl: function(message) {
    if (!message.pending() && message.kind === 'text') {
      var links = message.bodyElement().select('a:not(image)');
      if (links.length != 1) {
        return;
      }
      var link = links[0];
      var href = link.getAttribute('href');
      var match = href.match(/^(https?:\/\/scoutapp.com\/.*\/charts)(\?.*)$/);
      if (!match) return;

      var embed_src = match[1] + '/embed' + match[2];

      // add an end_time, if it doesn't exist
      if (!href.match(/end_time/)) {
        href += '&end_time=' + message.chat.timestamp;
        link.setAttribute('href', href);

        embed_src += '&end_time=' + message.chat.timestamp;
      }

      var iframe = '<iframe src="' + embed_src + '" width="98%" height="200" style="border:0; margin-top: 5px"></iframe>';

      message.bodyCell.insert({bottom: iframe});
    }
  },

  onMessagesInsertedBeforeDisplay: function(messages) {
    for (var i = 0; i < messages.length; i++) {
      this.detectScoutGraphUrl(messages[i]);
    }
  },

  onMessageAccepted: function(message, messageID) {
    this.detectScoutGraphUrl(message);
  }
});

Campfire.Responders.push("ScoutGraphExpander");
window.chat.installPropaneResponder("ScoutGraphExpander", "scoutexpander");

