require "caveat_patch_kids/version"

require 'sprockets'
require 'pathname'
require 'logger'
require 'fileutils'

require 'thor'

module CaveatPatchKids

  class App < Thor
    include Thor::Actions
    #desc "plant", "Plant a basic ~/.caveat_patch_kids"
    #def plant 
    #end

    desc "generate", "generate caveatPatchor.js using your plantted ~/.caveat_patch_kids"
    def generate
      root_dir = Pathname.new(__FILE__).basename + '..'
      sprockets = Sprockets::Environment.new(root_dir)

      vendor_assets_dir = root_dir + 'vendor/assets'
      scripts_dir = root_dir + 'scripts'
      home_dir = Pathname.new("~/.caveat_patch_kids")
      unsupported_dir = Pathname.new("~/Library/Application Support/Propane/unsupported/").expand_path

      sprockets.append_path vendor_assets_dir.to_s
      sprockets.append_path scripts_dir.to_s
      sprockets.append_path home_dir.expand_path.to_s

      caveat_patchor = sprockets.find_asset('caveatPatchor.js')

      prefix, basename = caveat_patchor.pathname.to_s.split('/')[-2..-1]

      FileUtils.mkdir_p(unsupported_dir.to_s)

      caveat_patchor.write_to "#{unsupported_dir}/#{basename}"
    end
  end
end
