## Welcome to SynthCity

1. SynthCity is an interactive and collaborative music making browser application
2. By Charlotte Ulrich, Laura Van Dyke, Maria Fernanda, and Kristin Carrillo
3. https://synthcity.herokuapp.com/

## Start

Running `npm run start:dev` will make great things happen!

### Heroku

1.  Set up the [Heroku command line tools][heroku-cli]
2.  `heroku login`
3.  Add a git remote for heroku:

[heroku-cli]: https://devcenter.heroku.com/articles/heroku-cli

- **If you are creating a new app...**

  1.  `heroku create` or `heroku create your-app-name` if you have a
      name in mind.
  2.  `heroku config:set JWT=<your secret here!>` to set a secret for JWT signing

- **If you already have a Heroku app...**

  1.  `heroku git:remote your-app-name` You'll need to be a
      collaborator on the app.

Now, you should be deployed!
