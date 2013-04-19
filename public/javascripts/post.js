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
    $('.post-options-handle').position({
      my: 'right center',
      at: 'right center',
      of: '.edit-content'
    });

  });

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

  $('.post-options-handle').click(function(e) {
    e.stopPropagation();
    $('.edit-container').toggleClass('options');
    $(this).position({
      my: 'right center',
      at: 'right center',
      of: '.edit-content'
    });
  });

  $('.post-options').click(function(e) {
    e.stopPropagation();
  });

})();