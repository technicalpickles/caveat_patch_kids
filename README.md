# CaveatPatchKids

CaveatPatchKids is a tool for generating caveatPatchor.js files and for easily sharing snippets for use in caveatPatchor.js

## Installation

Install in the usual way:

    $ gem install caveat_patch_kids

## Usage

To start, plant a cavet patch:

    $ caveat-patch-kids plant
          create  /Users/yourface/.caveat_patch_kids/caveatPatchor.js

This creates a basic caveatPatchor.js you can customize. Either drop you code at the bottom, or require scripts provided by CaveatPatchKids (see below).

When you are happy with the results, bloom it:

    $ caveat-patch-kids bloom
           bloom  /Users/yourface/Library/Application Support/Propane/unsupported/caveatPatchor.js 

Now you can quit Propane, and launch it again. Hopefully nothing breaks...

If something does break, and you really need to get back into Propane, you can till:

    $ caveat-patch-kids till
          remove  /Users/technicalpickles/Library/Application Support/Propane/unsupported/caveatPatchor.js
    
### Scripts

These scripts are provided by CaveatPatchKids. Include them by updating ~/.caveat_patch_kids/caveatPatchor.js like:

    //= require caveat_patch_kids/the_scripts

* caveat_patch_kids/display_avatars: display gravatars next to user's
* caveat_patch_kids/embiggen_message_history: increase message history
* caveat_patch_kids/stylize_diffs: colorize diffs with red/green
* caveat_patch_kids/stylize_diffs: colorize nagios alerts

The original caveatPatchor.js had a lot of mysterious and odd things. Those weren't included by default, but could be of use to someone, somewhere, or maybe just need some cleanup and documentation. See `scripts/caveat_patch_kids/unsupported` for the good.

### Bundles

For convience, a full bundles with several scripts are included. Require them like any other script:

* caveat_patch_kids/bundles/all: all scripts (that aren't unsupported)
* caveat_patch_kids/bundles/unsupported: all scripts, even ones unsupported. you probably shouldn't do this unless you are a crazy person

## Thanks

* [@protocool](https://github.com/protocool) for releasing Propane with caveatPatchor.js support
* [@wfarr](https://github.com/wfarr) for convincing someone to share their caveatPatchor.js
* [@sstephenson](https://github.com/sstephenson) for sprockets
* [@weppos](https://github.com/weppos) for [blogging about using sprockets outside of the context of a webapp](http://www.simonecarletti.com/blog/2011/09/using-sprockets-without-a-railsrack-project/)
* Maybe you? If you wrote a script here, and it's uncredited, please let me know

## TODO

* make it easy for other people to release their own scripts as gems, and be able to load them
* include screenshots of scripts in action
* review unsupported stuff more closely

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
