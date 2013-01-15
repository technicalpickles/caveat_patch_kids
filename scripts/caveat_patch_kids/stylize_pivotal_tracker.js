Campfire.PivotalTrackerExpander = Class.create({
  initialize: function(chat) {
    this.chat = chat;
    var messages = this.chat.transcript.messages;
    for (var i = 0; i < messages.length; i++) {
      this.detectPivotalTracker(messages[i]);
    }
  },

  detectPivotalTracker: function(message) {
    if (!message.pending() && message.kind === 'text') {
      var body = message.bodyElement()
      if (body.innerText.match(/(in|to) project/i)) {
        if (body.innerText.match(/pivotaltracker.com/i)) {
          
          if (colorizePivotalTracker) {
            if (body.innerText.match(/added/g)) {
              message.bodyCell.setStyle({
                color: pivotalTrackerAddedColor
              })
            } else if (body.innerText.match(/started/g)) {
              message.bodyCell.setStyle({
                color: pivotalTrackerStartedColor
              })
            } else if (body.innerText.match(/finished/g)) {
              message.bodyCell.setStyle({
                color: pivotalTrackerFinishedColor
              })              
            } else if (body.innerText.match(/delivered/g)) {
              message.bodyCell.setStyle({
                color: pivotalTrackerDeliveredColor
              })
            } else if (body.innerText.match(/accepted/g)) {
              message.bodyCell.setStyle({
                color: pivotalTrackerAcceptedColor
              })
            } else if (body.innerText.match(/rejected/g)) {
              message.bodyCell.setStyle({
                color: pivotalTrackerRejectedColor
              })
            }
          }

          if (shortenPivotalName) {
            matches        = body.innerText.match(/^((?:[A-Z]{1}[a-z]* ?){2,3}) (?:added|started|finished|delivered|accepted|rejected)/)
            body.innerHTML = body.innerHTML.replace(/^((?:[A-Z]{1}[a-z]* ?){2,3})/, "<strong>" + matches[1].replace(/[^A-Z]/g, '') + "</strong> ")
          }

          if (linkifyPivotalStories) {
            matches        = body.innerText.match(/"(.*)" \((.*)\)/)
            body.innerHTML = body.innerHTML.replace(/(".*" \(.*\))/, "\"<a href='" + matches[2] + "' target='_blank'>" + matches[1] + "</a>\"");
          }
        }
      }
    }
  },

  onMessagesInsertedBeforeDisplay: function(messages) {
    for (var i = 0; i < messages.length; i++) {
      this.detectPivotalTracker(messages[i]);
    }
  },
  
  onMessageAccepted: function(message, messageID) {
    this.detectPivotalTracker(message);
  }
});

Campfire.Responders.push("PivotalTrackerExpander");
window.chat.installPropaneResponder("PivotalTrackerExpander", "pivotaltrackerexpander");
