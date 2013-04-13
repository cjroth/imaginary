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

});