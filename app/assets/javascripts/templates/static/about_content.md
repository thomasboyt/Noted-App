## About

Noted is a note-taking app that uses a modal interface. This makes it super easy to manipulate outlines - quickly move lines around, reindent them, etc.

It was made by Thomas Boyt. You should probably follow him on [Twitter](https://twitter.com/thomasaboyt) and [GitHub](https://github.com/thomasboyt).

## What's New?

*February 27*

* Added Markdown formatting! You now use `*italics*`, `**bold**`, `[links](http://placekitten.com)`, `` `code/fixed-width/monospace bits` ``, and `![images](http://placekitten.com/200/300)`.
* Fixed Dropbox syncing bugs, and actually enabled Dropbox for users besides me (turns out there's an approval process and everything!).

*February 26*

* You can now "full-screen" the faux-window in Noted with `shift+f`.
* This about page now exists!
* Noted now features a full clipboard
    * Deleting an item, whether with d, backspace, or x, will place a copy in your clipboard
    * You can also copy an item with c...
    * ...and, either way, press v to paste it.
* Noted also has very beta Dropbox support!
    * You can sign in with Dropbox using the button in the bottom right, and import or export all of your notes as flat text files
    * This is an early feature, and should not be relied on as your exclusive backup choice! If you care about your notes, make sure to make copies of your notes folder in Dropbox every now and then.
    * Also, heed the various warnings in the sync dialogs - when you import or export, your entire note set will be replaced! test test
* Finally, Noted now has offline support.
    * Visiting http://noted.herokuapp.com, even while completely offline (literally; try disabling your wi-fi), will give you a totally usable version of the page.
    * The flip side to this is that when Noted gets an update, it won't actually update in your browser until you refresh the page. You'll soon start seeing popups informing you when an update is available . Don't blame me, blame HTML5!

## Technical Details

**Front-end:** Noted uses [Ember.js](http://emberjs.com) as its framework, along with several other libraries, including RSVP.js, several of Ben Alman's jQuery plugins, jwerty, Dropbox.js, Marked (for Markdown formatting), and finally [rpflorence's invaluable localStorage adapter for ember-data](https://github.com/rpflorence/ember-localstorage-adapter). 

For styling, Noted uses LESS with Bootstrap. Noted also uses HTML5's Application Cache abilities for offline support.

**Back-end:** While Noted has no actual backend API, it relies on Rails (and the Ember-Rails gem) for building and serving its content. It also uses wycats's [Rack::Offline](https://github.com/wycats/rack-offline) to generate its application cache manifest.

Theoretically, at some point, Noted will use RSpec + Capybara + Selenium for integration/acceptance testing the app. Until then, I just try not to break stuff too often.

Oh, and finally, this about page and several other templates were written in Markdown compiled with Redcarpet.

I think that's everything!