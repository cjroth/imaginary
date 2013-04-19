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
  
})();