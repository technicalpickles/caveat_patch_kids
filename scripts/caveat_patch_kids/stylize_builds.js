Campfire.BuildExpander = Class.create({
  initialize: function(chat) {
    this.chat = chat;
    var messages = this.chat.transcript.messages;
    for (var i = 0; i < messages.length; i++) {
      this.detectBuild(messages[i]);
    }
  },

  detectBuild: function(message) {
    if (!message.pending() && message.kind === 'text') {
      var body = message.bodyElement()
      if (body.innerText.match(/^Build #(\d+) \([0-9a-zA-Z]+\) of (github-)?([-_0-9a-zA-Z]+)/)) {
        var failed_p = body.innerText.match(/failed/);
        var success_p = body.innerText.match(/success/);
        var color = failed_p ? '#ff0000' : '#00941f';
        if (failed_p || success_p)
          message.bodyCell.setStyle({
            color: color,
            fontWeight: 'bold'
          })

        var sha = body.innerText.match(/\(([0-9a-z]+)\)/i)[1]
        var build;
        if (body.outerHTML.match(/^github-(?!services)/)) {
         build = body.outerHTML.replace(/#(\d+) \(([0-9a-zA-Z]+)\) of (?:github-)?([-_0-9a-zA-Z]+)/, '<a target="_blank" href="http://ci2.rs.github.com:8080/job/github-$3/$1/console">#$1</a> ($2) of github-$3')
        } else {
          build = body.outerHTML.replace(/#(\d+) \(([0-9a-zA-Z]+)\) of ([-_0-9a-zA-Z]+)/, '<a target="_blank" href="https://janky.rs.github.com/$1/output">#$1</a> ($2) of $3')
        }
        var btime = build.match(/\d+s/)
        body.replace(build)
        build = build.replace(/^.*?<a/,'<a').replace(/<\/a>.*/, '</a>')

        var msgIndex = this.chat.transcript.messages.indexOf(message);
        if (msgIndex > -1) {
          for (var i=msgIndex; i > 0 && i > msgIndex - 5; i--) {
            var otherMsg = this.chat.transcript.messages[i]
            if (otherMsg.element.innerHTML.match("/commit/" + sha)) {
              build = build.replace(/<\/a>.*$/, '</a>').replace('Build ','');
              if (btime) build += "] [" + btime;
              otherMsg.bodyElement().insert({bottom: " ["+build+"]"})
              otherMsg.bodyCell.setStyle({color:color,fontWeight:'bold'})
              message.element.remove()
              break
            }
          }
        }
      }
    }
  },

  onMessagesInsertedBeforeDisplay: function(messages) {
    for (var i = 0; i < messages.length; i++) {
      this.detectBuild(messages[i]);
    }
  }
});

Campfire.Responders.push("BuildExpander");
window.chat.installPropaneResponder("BuildExpander", "buildexpander");
