Autolink['Emoji']['bear'] = '1f40b'
CAMPFIRE_EMOJI = new Hash(Autolink.Emoji).inject({}, function(hash,v){ hash[v[1]]=v[0]; return hash })
// from GitHub::HTML::EmojiFilter::EmojiPattern
GITHUB_EMOJI = /:(sparkles|key|scissors|octocat|warning|heart|clap|airplane|leaves|new|broken_heart|ok|couple|fire|iphone|sunny|rainbow|email|book|mag|koala|mega|apple|dog|princess|rose|calling|tophat|beer|art|v|cat|ski|thumbsup|punch|dolphin|cloud|zap|bear|fist|horse|lock|smoking|moneybag|computer|cake|taxi|cool|feet|tm|kiss|train|bulb|thumbsdown|sunflower|nail_care|bike|hammer|gift|lipstick|fish|zzz|lips|bus|star|cop|pencil|bomb|vs|memo|\-1|\+1|runner|wheelchair):/g

Campfire.EmojiExpander = Class.create({
  initialize: function(chat) {
    this.chat = chat;
    var messages = this.chat.transcript.messages;
    for (var i = 0; i < messages.length; i++) {
      this.detectEmoji(messages[i]);
    }
    this.chat.windowmanager.scrollToBottom();
  },

  detectEmoji: function(message) {
    if (message.kind == 'text') {
      var body = message.bodyElement()
      var emoji = body.select('span.emoji');
      emoji.each(function(e){
        var code = e.className.match(/emoji([\da-f]+)/)[1]
        e.replace(':' + CAMPFIRE_EMOJI[code] + ':')
      })
      var html = body.innerHTML
      var match = html.match(GITHUB_EMOJI)
      if (match) {
        body.innerHTML = html.replace(GITHUB_EMOJI, function(all, e){
          var size = 28
          if (e == 'octocat') size = 40
          if (message.author() == 'Mister Robot') size = 18
          return "<img title=':"+e+":' alt=':"+e+":' src='http://d3nwyuy0nl342s.cloudfront.net/images/icons/emoji/v2/"+e+".png' height='"+size+"' width='"+size+"' align='absmiddle'/>"
        })
      }
    }
  },

  onMessagesInsertedBeforeDisplay: function(messages) {
    var scrolledToBottom = this.chat.windowmanager.isScrolledToBottom();
    for (var i = 0; i < messages.length; i++) {
      this.detectEmoji(messages[i]);
    }
    if (scrolledToBottom) {
      this.chat.windowmanager.scrollToBottom();
    }
  },

  onMessageAccepted: function(message, messageID) {
    this.detectEmoji(message);
  }
});

Campfire.Responders.push("EmojiExpander");
window.chat.installPropaneResponder("EmojiExpander", "emojiexpander");
