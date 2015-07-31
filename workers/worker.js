var app = require('../app')
var redis = require("redis")
var users = require('../services/users')

var client = redis.createClient()

client.on("error", function (err) {
  console.log("Error " + err)
})

function waitForJob() {
  client.brpop('reset_password_mailer', 0, function(err, data){
    if(err)
      return console.log(err)

      console.log(data)
    users.findByEmailAddress(data[1], function(user) {
      if(!user) {
        console.log('Could not find user for email', data[1])
      } else {
        app.mailer.send('password_reset_email.ejs', {
          to: user.emailAddress,
          subject: 'Password Reset Instructions',
          resetLink: 'http://'+app.get('default_host')+'/reset_password'
        }, function (err) {
          if (err)
            return console.log(err)

          console.log('Password reset email sent to', user.emailAddress)
        })
      }
      waitForJob()
    })
  })
}

waitForJob()
