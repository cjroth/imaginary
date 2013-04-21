$(document).ready(function() {
  
  $('[data-delete-id]').click(function() {
    var $modal = $('#delete-post-modal');
    $modal.find('.modal-title').text('Delete "' + $(this).data('delete-title') + '"');
    $modal.data('delete-post', $(this).data('delete-id'));
    $modal.modal('toggle');
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
      window.location.reload();
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
      window.location = data.post.slug;
    });
    return false;
  });

});