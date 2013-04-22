$(document).ready(function() {
  
  $('[href="#delete"]').click(function() {
    var $post = $(this).parents('.post');
    var post_id = $post.data('post-id');
    var post_title = $post.find('.post-title').text();
    var $modal = $('#delete-post-modal');
    $modal.find('.modal-title').text('Delete ' + (post_title ? ('"' +  post_title + '"') : 'Untitled (#' + post_id + ')') + '?');
    $modal.data('delete-post', post_id);
    $modal.modal('toggle');
    return false;
  });

  $('[href="#publish"]').click(function() {
    var $post = $(this).parents('.post');
    var post_id = $post.data('post-id');
    var post_title = $post.find('.post-title').text();
    var $modal = $('#publish-post-modal');
    $modal.find('.modal-title').text('Publish ' + (post_title ? ('"' +  post_title + '"') : 'Untitled (#' + post_id + ')') + '?');
    $modal.data('publish-post', post_id);
    $modal.modal('toggle');
    return false;
  });

  $('.post-options-toggle').click(function() {
    var $this = $(this);
    $this.siblings('.post-options').toggle().position({
      my: 'right top',
      at: 'right bottom',
      of: $this
    }).click(function() {
      $this.hide();
    });
  });
  
  $('#delete-post').click(function() {
    var $modal = $('#delete-post-modal');
    var post_id = $(this).parents('.modal').data('delete-post');
    $.post('/delete/' + post_id, function(data) {
      if (!data.result) {
        // @todo handle error
      }
      window.location = '/posts';
    });
  });

  var $forms = $('.form');
  $forms.submit(function() {
    var url = $(this).attr('action');
    var data = $(this).serialize();
    $.post(url, data, function(data) {
      if (data.result) {
        window.location = '/';
      }
    });
    return false;
  });
  
  $('[href="#new"]').click(function() {
    $.post('/new', function(data) {
      if (!data.result) {
        // @todo handle error...
        return;
      }
      window.location = data.post.slug + '#editing=true';
    });
    return false;
  });

});