Campfire.GitHubExpander = Class.create({
  initialize: function(chat) {
    this.chat = chat;
    var messages = this.chat.transcript.messages;
    for (var i = 0; i < messages.length; i++) {
      this.detectGitHubURL(messages[i]);
    }
    this.chat.windowmanager.scrollToBottom();
  },

  detectGitHubURL: function(message) {
    if (!message.pending() && message.kind === 'text') {
      var iframe = null, elem, height = 150;

      var gists = message.bodyElement().select('a[href*="gist.github.com"]');
      if (gists.length == 1) {
        elem = gists[0];
        var href = elem.getAttribute('href');
        var match = href.match(/^https?:\/\/gist.github.com\/([A-Fa-f0-9]+)/);
        if (match) {
          iframe = 'https://gist.github.com/'+match[1]+'.pibb';
        }
      }

      var blobs = message.bodyElement().select('a[href*="#L"]');
      if (blobs.length == 1) {
        elem = blobs[0];
        var href = elem.getAttribute('href');
        iframe = href;
      }

      var blobs = message.bodyElement().select('a[href*="/blob/"]');
      if (!iframe && blobs.length == 1) {
        elem = blobs[0];
        var href = elem.getAttribute('href');
        if (href.indexOf('#') > -1)
          iframe = href;
        else
          iframe = href + '#L1';
      }

      // var commits = message.bodyElement().select('a[href*=/commit/]')
      // if (!iframe && commits.length == 1 && message.author() != 'Mister Robot' && message.author() != 'Git') {
      //   elem = commits[0];
      //   var href = elem.getAttribute('href');
      //   if (href.indexOf('#') > -1)
      //     iframe = href;
      //   else
      //     iframe = href + '#diff-stat';
      // }

      if (!iframe || IFRAME_HATERS.include(this.chat.username)) return;
      message.bodyElement().insert({bottom:"<iframe style='border:0; margin-top: 5px' height='"+height+"' width='98%' src='"+iframe+"'></iframe>"});
    }
  },

  onMessagesInsertedBeforeDisplay: function(messages) {
    var scrolledToBottom = this.chat.windowmanager.isScrolledToBottom();
    for (var i = 0; i < messages.length; i++) {
      this.detectGitHubURL(messages[i]);
    }
    if (scrolledToBottom) {
      this.chat.windowmanager.scrollToBottom();
    }
  },

  onMessageAccepted: function(message, messageID) {
    this.detectGitHubURL(message);
  }
});

Campfire.Responders.push("GitHubExpander");
window.chat.installPropaneResponder("GitHubExpander", "githubexpander");
