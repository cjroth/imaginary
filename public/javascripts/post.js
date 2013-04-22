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
    $('.post-title').hide();
    $('.post-options-handle').position({
      my: 'right center',
      at: 'right center',
      of: '.edit-content'
    });
    $.bbq.pushState({ editing: true });
  });

  $(document).bind('click', function(e) {
    if ($(e.target).parents('.modal-dialog').length) {
      return;
    }
    $('.post').removeClass('edit');
    $('.post-title').show();
    $.bbq.removeState('editing');
  });

  $('.edit-content').bind('click', function(e) {
    e.stopPropagation();
  });

  $('.post-options-handle').click(function(e) {
    e.stopPropagation();
    $('.post').toggleClass('options');
    $(this).position({
      my: 'right center',
      at: 'right center',
      of: '.edit-content'
    });
    $('.post-options .buttons').position({
      my: 'bottom',
      at: 'bottom',
      of: '.post-options'
    });
    if ($('.post').hasClass('options')) {
      $.bbq.pushState({ 'options': true });
    } else {
      $.bbq.removeState('options');
    }
  });

  $('.post-options').click(function(e) {
    e.stopPropagation();
  });

  var serialize_post = function() {
    return {
      id: $('.post').data('post-id') || undefined,
      title: $('[name="post-title"]').val(),
      slug: $('[name="post-slug"]').val(),
      content: $('[name="post-content"]').val(),
      config: {
        include_tweet_button: $('[name="include-tweet-button"]').is(':checked'),
        include_signature: $('[name="include-signature"]').is(':checked')
      }
    };
  };

  var save_post = function() {
    $.post('/save', serialize_post(), function(data) {
      if (!data.result) {
        // @todo handle error
        return;
      }
      if (data.post.slug != window.location.pathname) {
        window.location = data.post.slug + '#' + $.param.fragment();
      }
      $('.post').data('post-id', data.post.id);
      $('.post .post-title').text(data.post.title);
      $('.post .post-content').html(marked(data.post.content));
      var post_config = JSON.parse(data.post.config);
      if (post_config.include_signature === 'true') {
        $('.post .post-signature').removeClass('hidden');
      } else {
        $('.post .post-signature').addClass('hidden');
      }
      if (post_config.include_tweet_button === 'true') {
        $('.post .twitter-share-button').removeClass('hidden');
      } else {
        $('.post .twitter-share-button').addClass('hidden');
      }
    });
  };

  var title_to_slug = function(title) {
    var slug = '';
    slug = title.replace(/ /g, '-');
    slug = slug.replace(/[^a-zA-Z0-9-]/g, '');
    slug = slug.toLowerCase();
    return '/' + slug;
  };

  $('[name="post-content"], [name="post-title"], [name="include-tweet-button"], [name="include-signature"]').on('keyup change', function() {
    save_post();
    // @todo show saving notification
  });

  $('[name="post-slug"]').on('change', function(e) {
    var slug = $('[name="post-slug"]').val();
    if (slug == '' || slug == '/') {
      return;
    }
    save_post();
  });

  $('[name="post-title"], [name="post-slug"]')
    .focus(function() {
      $(this).parents('.list-group-item').addClass('extended');
    })
    .blur(function() {
      $(this).parents('.list-group-item').removeClass('extended');
    });

  $('[name="post-title"]').keyup(function() {
    var post_id = $('.post').data('post-id');
    if (post_id) {
      return;
    }
    var title = $(this).val();
    var slug = title_to_slug(title);
    $('[name="post-slug"]').val(slug);
  });

  $.bbq.getState('editing') && $('.post-content').click();
  $.bbq.getState('options') && $('.post-options-handle').click();

  if ($('.post-content').text() == '') {
    $('.post-content').click();
  }

})();