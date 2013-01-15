swizzle(Campfire.StarManager, {
  toggle: function($super, element) {
    $super(element);

    var star = $(element).up('span.star'),
        message = this.chat.findMessage(element)
    if (star.hasClassName('starred')) {
      trackStar(message);
    }
  }
});

// 5490ef76-50fa-11e0-8fed-2495f6688d41
// bb628a4e-5199-11e0-949d-2e03dd584bf3 is a test cluster
function trackStar(message) {
  var id   = message.id()
    , url  = "http://allofthestars.com/clusters/.../campfire" +
      "?message="    + encodeURIComponent(message.bodyElement().innerText) +
      "&message_id=" + encodeURIComponent(id.toString()) +
      "&url="        + encodeURIComponent(starPermalink(id)) +
      "&author="     + encodeURIComponent(message.author()) +
      "&room="       + encodeURIComponent($('room_name').innerText)
  window.propane.requestJSON(id, url)
}

function starPermalink(id) {
  return location.href.toString().replace(/#.*/, '') +
    "transcript/message/" + id + "#message_" + id
}
