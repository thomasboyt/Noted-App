# Noted

Noted is a note-taking app that uses a modal interface. Basically, this makes it super easy to manipulate outlines - quickly move lines around, reindent them, whatever.

Below is an uber-tentative speculative user guide I pulled from my last attempt at creating this thing. It probably will have at least some bearing on how I develop this thing.

## Command Reference

(ctrl/cmd are interchangeable)

### Command Mode

There are two selection modes in command mode: single and multi. In single mode, the selection is whatever item you navigate to. In multi mode, which is entered by pressing s on the first item you want to select, each selected item is highlighted yellow, with the navigation cursor turning green.

#### Selecting

* Click an item to select it
* j/up arrow - Move selection down one item
* k/down arrow - Move selection up one item
* a - Select first item
* f - Select last item
* s - Add item to selection
* d - Remove item from selection

#### Editing

* space/double click - Edit item
* backspace - Delete item(s)
* tab - Indent item(s) one level
* shift+tab - Outdent (probably not a word) item(s) one level

#### Clipboard

* x - cut item(s)
* c - copy item(s)
* v - paste item(s) below current line

#### Inserting

* enter - Insert new item on the next line with the same indention level
* shift+enter - Insert new item on the next line with one indention level deeper
* ctrl+enter - Insert new item on the next line with one indention level less

### Edit Mode

* enter - Save item & exit edit mode
* escape - Revert changes & exit edit mode
* tab - Indent one level
* shift+tab - Outdent one level

## Formatting

* `_underscores_` put text in italics
* `*asterisks*` bold text