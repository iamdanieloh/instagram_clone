var express = require('express')
var router = express.Router()
var users = require('../services/users')
var pg =require('pg')
var conString = process.env.DATABASE_URL || "postgres://localhost/instagram"


function loadUser(req, res, next) {
  if(!req.signedCookies.userId)
  return next()

  console.log("Looking for user with ID="+req.signedCookies.userId)
  users.findById(req.signedCookies.userId, function(user){
    if(user) {
      console.log("Logged in as "+ user.emailAddress)
      req.user = user
    } else {
      console.log("Could not find user with ID="+req.signedCookies.userId)
    }
    next()
  })
}

/* GET home page. */
router.get('/', loadUser, function(req, res) {
  res.render('index', { currentUser: req.user })
})

router.get('/sign_up', function(req, res) {
  res.render('sign_up')
})

router.post('/sign_up', function(req, res) {
  console.log('Looking for email='+req.body.emailAddress)
  users.findByEmailAddress(req.body.emailAddress, function(user) {
    if(user) {
      res.render('sign_up', { emailAddress: req.body.emailAddress, error: 'User already exists' })
    } else {
      users.createUser({ emailAddress: req.body.emailAddress, password: req.body.password }, function(user){
        console.log("User "+user.id+" created")
        res.cookie('userId', user.id, { signed: true }).redirect('/')
      })
    }
  })
})

router.get('/log_in', function(req, res) {
  res.render('log_in')
})

router.post('/log_in', function(req, res) {
  users.authenticate(req.body.emailAddress, req.body.password, function(user) {
    if(user) {
      res.cookie('userId', user.id, { signed: true }).redirect('/')
    } else {
      res.render('log_in', { emailAddress: req.body.emailAddress, error: 'Log In Failed' })
    }
  })
})

router.get('/log_out', function(req, res) {
  res.clearCookie('userId').redirect('/')
})

router.get('/forgot_password', function(req, res) {
  res.render('forgot_password')
})

router.post('/forgot_password', function(req, res) {
  users.findByEmailAddress(req.body.emailAddress, function(user) {
    if(user) {
      client.lpush('reset_password_mailer', user.emailAddress, function(cb){
        console.log('Queued job')
        res.redirect('/password_reset_sent')
      })
    } else {
      res.render('forgot_password', { emailAddress: req.body.emailAddress, error: 'Account not found' })
    }
  })
})

router.get('/password_reset_sent', function(req, res) {
  res.render('password_reset_sent')
})

router.get('/posts/new', function(req, res) {
  res.render('post_form')
})

router.get('/posts', function(req, res) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      console.error('error fetching client from pool', err);
      res.status(500).send('Could not connect to database');
      return;
    }
    client.query('SELECT * FROM posts WHERE id=' + req.signCookies.userId), function(err,results) {
      done();
      if (err) {
        throw err;
      }
      res.render('posts', {postView: "test"})
    }

  })
})

router.post('/posts', function(req, res, next) {
  if (req.signedCookies.userId) {
    pg.connect(conString, function(err, client, done) {
      if (err) {
        console.error('error fetching client from pool', err);
        res.status(500).send('Could not connect to database');
        return;
      }

      client.query('INSERT INTO posts (user_id, image_url, title, created_at) VALUES ($1, $2, $3, now())', [req.signedCookies.userId, req.body.imageUrl, req.body.titlePost], function(err, result) {
        done();
        if (err) {
          console.error('error running query', err);
          res.status(500).send('Error running query');
        } else {
          res.render('signed_in', {userEmail: result.rows[0].email_address});
        }
      });
    });
  }
  else {
    res.render('index');
  }
});


module.exports = router
