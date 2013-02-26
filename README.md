## About

Noted is a note-taking app that uses a modal interface. This makes it super easy to manipulate outlines - quickly move lines around, reindent them, etc.

You can use the app here: http://noted.herokuapp.com/

### Running Locally

Noted doesn't require anything special to run that isn't included in the `gemfile`. Just make sure you have Rails and preferably RVM and run:

```
rvm gemset create noted
rvm gemset use noted
bundle install
rails s
```

### Testing

`rake spec` will run acceptance tests in Selenium (assuming you have Firefox installed).