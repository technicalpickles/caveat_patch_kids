Campfire.MusicExpander = Class.create({
  initialize: function(chat) {
    this.chat = chat;
    var messages = this.chat.transcript.messages;
    for (var i = 0; i < messages.length; i++) {
      this.detectMusic(messages[i]);
    }
    this.chat.windowmanager.scrollToBottom();
  },

  detectMusic: function(message) {
    if (message.actsLikeTextMessage()) {
      var body = message.bodyElement()
      var html = body.innerHTML

      var match = html.match(/(Now playing|is listening to|Queued up) "(.*)" by (.*), from(?: the album)? "(.*)"/i)
      if (match) {
        var text = match[1]
        var song = match[2], artist = match[3], album = match[4]
        var url = "http://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Ddigital-music&x=8&y=16&field-keywords="
        var linkify = function(text, query){
          if (!query) query = text
          return new Element('a', {target:'_blank',href:url+encodeURI(query)}).update(text).outerHTML;
        }

        html = text + ' "'
        if (song)
          html += linkify(song, song+" "+artist+" "+album)
        html += '" by '
        if (artist)
          html += linkify(artist)
        html += ', from the album "'
        if (album)
          html += linkify(album, artist+" "+album)
        html += '"'
        body.innerHTML = html
      }
    }
  },

  onMessagesInsertedBeforeDisplay: function(messages) {
    var scrolledToBottom = this.chat.windowmanager.isScrolledToBottom();
    for (var i = 0; i < messages.length; i++) {
      this.detectMusic(messages[i]);
    }
    if (scrolledToBottom) {
      this.chat.windowmanager.scrollToBottom();
    }
  },

  onMessageAccepted: function(message, messageID) {
    this.detectMusic(message);
  }
});

Campfire.Responders.push("MusicExpander");
window.chat.installPropaneResponder("MusicExpander", "musicexpander");
