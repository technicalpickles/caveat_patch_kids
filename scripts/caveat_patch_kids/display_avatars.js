var USER_ACTIONS = ['enter','leave','kick','conference_created','lock','unlock'];

Object.extend(Campfire.Message.prototype, {
  authorID: function() {
    if (Element.hasClassName(this.element, 'you'))
      return this.chat.userID;

    var idtext = (this.element.className.match(/\s*user_(\d+)\s*/) || [])[1];
    return parseInt(idtext) || 0;
  },

  addAvatar: function() {
    var
      author = this.authorElement(),
      body = this.bodyCell,
      email,
      avatar, name, imgSize = 32, img;

    email = author.getAttribute('data-email')
    if (email) {
      var hash = calcMD5(email.trim().toLowerCase())
      avatar = "http://gravatar.com/avatar/"+hash
    } else {
      // avatar = author.getAttribute('data-avatar') || 'http://asset1.37img.com/global/missing/avatar.png?r=3';
      avatar = 'http://globase.heroku.com/redirect/gh.gravatars.' + this.authorID() + '?default=http://github.com/images/gravatars/gravatar-140.png';
    }
    name = '<strong class="authorName" style="color:#333;">'+author.textContent+'</strong>'

    if (USER_ACTIONS.include(this.kind)) {
      imgSize = 16
      if ('conference_created' != this.kind)
        body = body.select('div:first')[0]
      name += ' '
    } else if (this.actsLikeTextMessage()) {
      name += '<br>'
    } else {
      return;
    }

    img = '<img alt="'+this.author()+'" width="'+imgSize+'" height="'+imgSize+'" align="absmiddle" style="opacity: 1.0; margin: 0px; border-radius:3px" src="'+avatar+'">'

    if (USER_ACTIONS.include(this.kind)) {
      name = img + '&nbsp;&nbsp;' + name;
      img = ''
    }

    if (author.visible()) {
      author.hide();

      if (body.select('strong.authorName').length === 0) {
        body.insert({top: name});
        if (img)
          author.insert({after: img});
      }
    }
  }
});

/* if you can wrap rather than rewrite, use swizzle like this: */
swizzle(Campfire.Message, {
  setAuthorVisibilityInRelationTo: function($super, message) {
    $super(message);
    this.addAvatar();
  },
  authorElement: function($super) {
    if (USER_ACTIONS.include(this.kind)) {
      return $super().select('span.author')[0]
    } else {
      return $super()
    }
  }
});


/* defining a new responder is probably the best way to insulate your hacks from Campfire and Propane */
Campfire.AvatarMangler = Class.create({
  initialize: function(chat) {
    this.chat = chat;

    var messages = this.chat.transcript.messages;
    for (var i = 0; i < messages.length; i++) {
      var message = messages[i];
      message.addAvatar();
    }

    this.chat.layoutmanager.layout();
    this.chat.windowmanager.scrollToBottom();
  },

  onMessagesInserted: function(messages) {
    var scrolledToBottom = this.chat.windowmanager.isScrolledToBottom();

    for (var i = 0; i < messages.length; i++) {
      var message = messages[i];
      message.addAvatar();
    }

    if (scrolledToBottom) {
      this.chat.windowmanager.scrollToBottom();
    }
  }
});

/* Here is how to install your responder into the running chat */
Campfire.Responders.push("AvatarMangler");
window.chat.installPropaneResponder("AvatarMangler", "avatarmangler");
