Noted is a note-taking app that uses a modal interface. This makes it super easy to manipulate outlines - quickly move lines around, reindent them, etc.

Below is a mostly-speculative user guide, since the majority of these commands are not implemented yet (thus the strikethroughs).

## Command Reference

(ctrl/cmd are interchangeable)

In addition to the below bindings, there's also some secret-ish VIM bindings (that are also half-implemented). Eventually there will be a toggle between "Noted" bindings and "VIM" bindings.

### Command Mode

<del>There are two selection modes in command mode: single and multi. In single mode, the selection is whatever item you navigate to. In multi mode, which is entered by pressing s on the first item you want to select, each selected item is highlighted yellow, with the navigation cursor turning green.</del>

#### Selecting

* Click an item to select it
* j/up arrow - Move selection down one item
* k/down arrow - Move selection up one item
* <del>a - Select first item</del>
* <del>f - Select last item</del>
* <del>s - Add item to selection</del>
* <del>d - Remove item from selection</del>

#### Editing

* space/double click - Edit item
* <del>??? - Change item (same as edit item but highlights all text so it can be replaced, copied, cut, etc)</del>
* backspace/d - Delete item(s)
* tab/l - Indent item(s) one level
* shift+tab/h - Outdent (probably not a word) item(s) one level

#### Clipboard

* x - cut item(s)
* c - copy item(s)
* v - paste item(s) below current line

(VIM bindings mode will be different)

#### Inserting

* enter - Insert new item on the next line with the same indention level
* <del> shift+enter - Insert new item on the next line with one indention level deeper</del>
* <del>ctrl+enter - Insert new item on the next line with one indention level less </del>

### Edit Mode

* enter - Save item & exit edit mode
* escape - Revert changes & exit edit mode
* tab - Indent one level
* shift+tab - Outdent one level

## Formatting

* <del>`_underscores_` put text in italics</del>
* <del>`*asterisks*` bold text</del>