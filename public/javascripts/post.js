(function() {
  
  $('.post-options-toggle').click(function() {
    $('.post-options').toggle().position({
      my: 'right top',
      at: 'right bottom',
      of: $('.post-options-toggle')
    }).click(function() {
      $(this).hide();
    });
  });

  $('.post-content').click(function(e) {
    e.stopPropagation();
    $('.post').addClass('edit'); 
    $('.post-title').slideUp(30);
    $(document).bind('click', function(e) {
      var markdown = $('.edit-content').val();
      var html = marked(markdown);
      $('.post-content').html(html);
      $('.post').removeClass('edit');
      $('.post-title').slideDown(30);
    });
    $('.edit-content').bind('click', function(e) {
      e.stopPropagation();
    });
  });

})();