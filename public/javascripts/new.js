(function() {

  var $post = $('#post');
  var $title = $('#title');
  var $content = $('#content');
  var $view_tab = $('#view-tab');
  var $view = $('#view');
  var $edit = $('#edit');
  var $publish = $('#publish');
  var $save = $('#save');

  var serialize_post = function() {
    return {
      id: $post.data('id') || undefined,
      title: $title.val(),
      content: $content.val(),
      config: {
        include_tweet_button: $('#include-tweet-button').is(':checked'),
        include_signature: $('#include-signature').is(':checked')
      }
    };
  };

  $view_tab.click(function() {
    var markdown = $content.val();
    var html = marked(markdown);
    $view.find('.content').html(html);
  });

  $save.click(function() {
    $.post('/save', serialize_post(), function(data) {
      if (!data.result) {
        // @todo handle error...
        return;
      }
      $post.data('id', data.post.id);
    });
  });

  $publish.click(function() {
    $.post('/save', serialize_post(), function(data) {
      if (!data.result) {
        // @todo handle error...
        return;
      }
      window.location = '/' + data.post.slug;
    });
  });

})();