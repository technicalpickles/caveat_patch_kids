// from https://gist.github.com/1481799
Campfire.YouTube = Class.create({
  initialize: function(chat) {
    this.chat = chat;
    var messages = this.chat.transcript.messages;
    for (var i = 0; i < messages.length; i++) {
      this.detectYouTubeURL(messages[i]);
    }
  },

  detectYouTubeURL: function(message) {
    if (!message.pending() && message.kind === 'text') {

if(message.bodyElement().innerHTML.match(/http:\/\/www\.youtube\.com\//)){

  setTimeout(function(){
    var links = message.bodyElement().select('a');
        if (!links.length) {
          return;
              }
        var href = links[0].getAttribute('href');
    var vid_id = href.split("v=")[1].split(/\&amp;|\&|,|%2C/)[0];
    message.bodyElement().innerHTML  = '<iframe width="420" height="315" src="http://www.youtube.com/embed/'+ vid_id+ '" frameborder="0" allowfullscreen></iframe>' ;
  },300);
}
    }
  },
  onMessagesInsertedBeforeDisplay: function(messages) {
    for (var i = 0; i < messages.length; i++) {
      this.detectYouTubeURL(messages[i]);
    }
  },

  onMessageAccepted: function(message, messageID) {
    this.detectYouTubeURL(message);
  }
});

Campfire.Responders.push("YouTube");
window.chat.installPropaneResponder("YouTube", "youtube");
