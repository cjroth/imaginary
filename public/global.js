$(document).ready(function() {
  
  $('a[href="#delete"]').click(function() {
    var $post = $(this).parents('[name="post"]');
    var post_id = $post.data('post-id');
    var post_title = $post.find('.post-title').text();
    var $modal = $('#delete-post-modal');
    $modal.find('.modal-title').text('Delete ' + (post_title ? ('"' +  post_title + '"') : 'Untitled (#' + post_id + ')') + '?');
    $modal.data('post-id', post_id);
    $modal.modal('toggle');
    return false;
  });

  $('a[href="#publish"]').click(function() {
    var $post = $(this).parents('[name="post"]');
    var post_id = $post.data('post-id');
    $.post('/publish/' + post_id, function(data) {
      if (!data.result) {
        // @todo handle error
        return;
      }
      $('[name="post-published-at-section"]').removeClass('draft').addClass('published');
      $('[name="post-published-at"]').val(data.published_at);
    });
    return false;
  });

  $('a[href="#unpublish"]').click(function() {
    var $post = $(this).parents('[name="post"]');
    var post_id = $post.data('post-id');
    $.post('/unpublish/' + post_id, function(data) {
      if (!data.result) {
        // @todo handle error
        return;
      }
      $('[name="post-published-at-section"]').removeClass('published').addClass('draft');
      $('[name="post-published-at"]').val('');
    });
    return false;
  });

/*
  $('a[href="#publish"], [name="post-published-at"]').click(function() {
    var $post = $(this).parents('[name="post"]');
    var post_id = $post.data('post-id');
    var post_title = $post.find('.post-title').text();
    var $modal = $('#publish-post-modal');
    $modal.find('.modal-title').text('Publish ' + (post_title ? ('"' +  post_title + '"') : 'Untitled (#' + post_id + ')') + '?');
    $modal.data('post-id', post_id);
    $modal.modal('toggle');
    return false;
  });
*/
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
  
  $('a[href="#delete-final"]').click(function() {
    var $modal = $('#delete-post-modal');
    var post_id = $(this).parents('.modal').data('post-id');
    $.post('/delete/' + post_id, function(data) {
      if (!data.result) {
        // @todo handle error
      }
      window.location = '/posts';
    });
    return false;
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
  
  $('a[href="#new"]').click(function() {
    $.post('/new', function(data) {
      if (!data.result) {
        // @todo handle error...
        return;
      }
      window.location = data.post.slug + '#editing=true';
    });
    return false;
  });

  $('a[href="#publish-final"]').click(function() {
    var $modal = $('#publish-post-modal');
    var post_id = $(this).parents('.modal').data('post-id');
    $.post('/publish/' + post_id, function(data) {
      if (!data.result) {
        // @todo handle error
      }
      $modal.modal('hide');
    });
    return false;
  });

});