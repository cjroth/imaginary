var Sequelize = require('sequelize')
  , _ = require('underscore')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , bcrypt = require('bcrypt')
  , express = require('express')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , RedisStore = require('connect-redis')(express)
  , marked = require('marked')
  ;

module.exports = function(config) {

  var sequelize = new Sequelize(config.sql.database, config.sql.username, config.sql.password, config.sql.config);

  sequelize.exports = {
    marked: marked
  };

  var Post = sequelize.import(__dirname + '/../models/post');
  var User = sequelize.import(__dirname + '/../models/user');

  sequelize.sync().error(function(errors) {
    console.log(errors);
  });


  /*
   * PASSPORT
   */

  passport.use(new LocalStrategy(function(username, password, done) {

    password = bcrypt.hashSync(password, config.salt);

    User
      .find({ where: { email: username, password: password } })
      .success(function(user) {
        done(undefined, user);
      })
      .error(function(error) {
        done(error);
      });

  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User
      .find(id)
      .success(function(user) {
        done(undefined, user);
      })
      .error(function(error) {
        done(error);
      });
  });

  passport.authorize = function(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login')
  };

  var blog = {
    'name': config.name
  };


  var title_to_slug = function(title) {
    title = title.replace(/ /g, '-');
    title = title.replace(/[^a-zA-Z0-9-]/g, '');
    title = title.toLowerCase();
    return title;
  };

  var app = express();

  app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session({ store: new RedisStore(config.redis), secret: 'keyboard cat' }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(require('stylus').middleware(__dirname + '/public'));
    app.use('/static', express.static(path.join(__dirname, '../public')));
  });

  app.configure('development', function(){
    app.use(express.errorHandler());
  });

  app.set('views', 'node_modules/imaginary/views');

  app.get('/', function(req, res) {
    Post.all({ where: 'deleted_at is null' })
      .success(function(posts) {
        res.render('home', {
          blog: blog,
          user: req.user,
          posts: posts
        });
      })
      .error(function(error) {
        // @todo
      });
  });

  app.get('/static/javascripts/marked.js', function(req, res) {
    res.sendfile(path.join(__dirname, '../node_modules/marked/lib/marked.js'));
  });

  app.get('/login', function(req, res) {
    res.render('login', {
      blog: blog
    });
  });

  app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(error, user, info) {
      if (error) return res.json({ result: false, errors: [error] });
      if (!user) return res.json({ result: false, errors: ['incorrect username or password'] });
      req.logIn(user, function(error) {
        if (error) return res.json({ result: false, errors: [error] });
        return res.json({ result: true });
      });
    })(req, res, next);
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.get('/new', function(req, res) {
    res.render('new', {
      blog: blog,
      user: req.user
    });
  });

  app.post('/save', function(req, res) {

    var post_config = {
      include_tweet_button: req.body.config.include_tweet_button || false,
      include_signature: req.body.config.include_signature || false
    };

    if (req.body.id) {

      Post.find(req.body.id)
        .success(function(post) {
          
          _.extend(post, req.body);

          post.slug = title_to_slug(post.title);
          post.config = JSON.stringify(post_config);

          errors = post.validate();
          if (errors) {
            res.json({ result: false, errors: errors });
            return;
          }

          post.save();

          res.json({ result: true, post: post });
        })
        .error(function(error) {
          res.json({ result: false, errors: [error] });
        });

      return;

    }

    var post = Post.build(req.body);

    post.slug = title_to_slug(post.title);
    post.config = JSON.stringify(post_config);

    errors = post.validate();
    if (errors) {
      res.json({ result: false, errors: errors });
      return;
    }

    post.save()
      .success(function(user) {
        res.json({ result: true, post: post });
      })
      .error(function(error) {
        res.json({ result: false, errors: [error] });
      });

  });

  app.post('/delete/:post_id', function(req, res) {

    Post.find(req.params.post_id)
    .success(function(post) {
      if (!post) {
        // @todo handle exception
        return;
      }
      post.destroy()
        .success(function() {
          res.json({ result: true });
        })
        .error(function(error) {
          // @todo handle exception
        });

    })
    .error(function(err) {
      // @todo handle exception
    });

  });

  app.get('/:path', function(req, res) {

    var path = req.params.path;

    Post.find({ where: _.isNumber(path) ? ['id = ?', path] : ['slug = ?', path] })
    .success(function(post) {
      post ? res.render('post', {
        post: post,
        blog: blog,
        user: req.user
      }) : res.render('404', {
        blog: blog,
        user: req.user
      });
    })
    .error(function(err) {
      // @todo handle exception
    });

  });

  http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
  });

  return app;

};