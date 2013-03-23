## Key Reference

### Movement Mode

#### Selecting

* Click an item to select it
* `j/down arrow` - Move selection down one item
* `k/up arrow` - Move selection up one item
* <del>`shift + (j/down arrow)` - Move selection to next item on the same level</del>
* <del>`shift + (k/up arrow)` - Move selection to previous item on the same level</del>
* <del>`a` - Select first item</del>
* <del>`f` - Select last item</del>

#### Editing

* `space/double click` - Edit item
* <del>??? - Change item (same as edit item but highlights all text so it can be replaced, copied, cut, etc)</del>
* `backspace/d` - Delete item(s)
* `shift + (backspace/d)` - Delete item & children
* `tab/l` - Indent item(s) one level
* `shift+l` - Indent item & children one level
* `shift+tab/h` - Outdent (probably not a word) item(s) one level

#### Clipboard

* `x` - cut item 
* `c` - copy item
* `v` - paste item(s) below current line
* `shift+x` - cut item and children
* `shift+c` - copy item and children

#### Inserting

* `enter` - Insert new item on the next line with the same indention level
* <del> `shift+enter` - Insert new item on the next line with one indention level deeper</del>
* <del>`ctrl+enter` - Insert new item on the next line with one indention level less </del>

### Edit Mode

* `enter` - Save item & exit edit mode
* `escape` - Revert changes & exit edit mode
* `tab` - Indent one level
* `shift+tab` - Outdent one level

### Misc.

* `shift+f` - fullscreen (experimental)
* `?` - show help

## Formatting

Noted supports a small subset of [Markdown](http://daringfireball.net/projects/markdown/) for formatting.

* Italics: `*italicized text*` or `_italicized text_`
* Bold: `**bolded text**` or `__bolded text__`
* Fixed/monospace: `` `monospace text` ``
* Links: `http://google.com` will be automatically made into a link, or you can use the `[title](link)` format (i.e.) `[Google](http://google.com)`
* Images: `![](http://placekitten.com/200/300)` *(note that images will not be saved for offline viewing)*
