Campfire.NewRelicChartExpander = Class.create({
  initialize: function(chat) {
    this.chat = chat;
    var messages = this.chat.transcript.messages;
    for (var i = 0; i < messages.length; i++) {
      this.detectNewRelicChartURL(messages[i]);
    }
    this.chat.windowmanager.scrollToBottom();
  },

  detectNewRelicChartURL: function(message) {
    if (!message.pending() && message.kind === 'text') {
      var iframe = null, elem, height = 200;

      var charts = message.bodyElement().select('a[href*="rpm.newrelic.com/public/charts"]');

      if (charts.length == 1) {
        elem = charts[0];
        var href = elem.getAttribute('href');
        iframe = href;
      }

      if (!iframe || IFRAME_HATERS.include(this.chat.username)) return;
      message.bodyCell.insert({bottom:"<iframe style='border:0; margin-top: 5px' height='"+height+"' width='98%' src='"+iframe+"'></iframe>"});
    }
  },

  onMessagesInsertedBeforeDisplay: function(messages) {
    var scrolledToBottom = this.chat.windowmanager.isScrolledToBottom();
    for (var i = 0; i < messages.length; i++) {
      this.detectNewRelicChartURL(messages[i]);
    }
    if (scrolledToBottom) {
      this.chat.windowmanager.scrollToBottom();
    }
  },

  onMessageAccepted: function(message, messageID) {
    this.detectNewRelicChartURL(message);
  }
});

Campfire.Responders.push("NewRelicChartExpander");
window.chat.installPropaneResponder("NewRelicChartExpander", "newrelicchartexpander");
