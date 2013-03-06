Campfire.CloudAppExpander = Class.create({
  initialize: function(chat) {
    this.chat = chat;
    var messages = this.chat.transcript.messages;
    for (var i = 0; i < messages.length; i++) {
      this.detectCloudAppURL(messages[i]);
    }
  },

  detectCloudAppURL: function(message) {
    /* we are going to use the messageID to uniquely identify our requestJSON request
       so we don't check pending messages */
    if (!message.pending() && message.kind === 'text') {
      var links = message.bodyElement().select('a:not(image)');
      if (links.length != 1) {
        return;
      }
      var href = links[0].getAttribute('href');
      var match = href.match(/^https?:\/\/cl.ly\/image\/[A-Za-z0-9]+\/?$/);
      if (!match) return;
      window.propane.requestJSON(message.id(), href, 'window.chat.cloudappexpander', 'onEmbedDataLoaded', 'onEmbedDataFailed');
    }
  },

  onEmbedDataLoaded: function(messageID, data) {
    var message = window.chat.transcript.getMessageById(messageID);
    if (!message) return;

    if (data['item_type'] === 'image') {
      var imageURL = data['content_url'];
      message.resize((function() {
        message.bodyCell.insert({bottom: '<div style="width:100%; margin-top:5px; padding-top: 5px; border-top:1px dotted #ccc;"><a href="'+imageURL+'" class="image loading" target="_blank">' + '<img src="'+imageURL+'" onload="$dispatch(&quot;inlineImageLoaded&quot;, this)" onerror="$dispatch(&quot;inlineImageLoadFailed&quot;, this)" /></a></div>'});
      }).bind(this));
    }
  },

  onEmbedDataFailed: function(messageID) {
    /* No cleanup required, we only alter the HTML after we get back a succesful load from the data */
  },

  onMessagesInsertedBeforeDisplay: function(messages) {
    for (var i = 0; i < messages.length; i++) {
      this.detectCloudAppURL(messages[i]);
    }
  },

  onMessageAccepted: function(message, messageID) {
    this.detectCloudAppURL(message);
  }
});

Campfire.Responders.push("CloudAppExpander");
window.chat.installPropaneResponder("CloudAppExpander", "cloudappexpander");
