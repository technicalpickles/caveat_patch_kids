Campfire.RdioExpander = Class.create({
  initialize: (chat) ->
    this.chat = chat
    this.detectRdioURL(message) for message in chat.transcript.messages

  detectRdioURL: (message) ->
    if !message.pending() and message.kind == 'text'
      links = message.bodyElement().select('a:not(image)')
      for link in links
        href = link.getAttribute('href')
        match = href.match(/^http:\/\/(rd\.io\/x\/\w*)$/)
        if match
          rdioHref = "rdio://" + match[1]
          link.setAttribute('href', rdioHref)

  onMessagesInsertedBeforeDisplay: (messages) ->
    this.detectRdioURL(message) for message in messages

  onMessageAccepted: (message, messageID) ->
    this.detectRdioURL(message)
})

Campfire.Responders.push("RdioExpander")
window.chat.installPropaneResponder("RdioExpander", "rdioexpander")
