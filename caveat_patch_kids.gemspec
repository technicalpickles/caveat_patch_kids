# -*- encoding: utf-8 -*-
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'caveat_patch_kids/version'

Gem::Specification.new do |gem|
  gem.name          = "caveat_patch_kids"
  gem.version       = CaveatPatchKids::VERSION
  gem.authors       = ["Josh Nichols"]
  gem.email         = ["josh@technicalpickles.com"]
  gem.description   = %q{Manage caveatPatchor.js files for Propane}
  gem.summary       = %q{CaveatPatchKids is a tool for generating, sharing, and maintaing caveatPatchor.js files for use with Propane, powered by sprockets and other fun stuff}
  gem.homepage      = "https://github.com/technicalpickles/caveat_patch_kids"

  gem.files         = `git ls-files`.split($/)
  gem.executables   = gem.files.grep(%r{^bin/}).map{ |f| File.basename(f) }
  gem.test_files    = gem.files.grep(%r{^(test|spec|features)/})
  gem.require_paths = ["lib"]
  gem.add_dependency 'sprockets', '>= 0'
  gem.add_dependency 'thor', '>= 0'
  gem.add_dependency 'coffee-script', '>= 0'
end
