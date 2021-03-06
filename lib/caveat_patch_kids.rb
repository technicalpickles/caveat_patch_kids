require "caveat_patch_kids/version"

require 'sprockets'
require 'pathname'
require 'logger'
require 'fileutils'

require 'thor'

module CaveatPatchKids

  class App < Thor
    include Thor::Actions
    desc "plant", "Plant a basic ~/.caveat_patch_kids"
    def plant 
      create_file  "~/.caveat_patch_kids/caveatPatchor.js", <<END
//= require caveat_patch_kids
//
//= require caveat_patch_kids/display_avatars
//= require caveat_patch_kids/stylize_diffs
//
//= require_self
END
    end

    desc "bloom", "bloom a caveatPatchor.js using your planted ~/.caveat_patch_kids"
    def bloom
      root_dir = Pathname.new(__FILE__).dirname + '..'
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

      say_status "bloom", "#{unsupported_dir}/#{basename}"
      caveat_patchor.write_to "#{unsupported_dir}/#{basename}"
    end

    desc "till", "till planted ~/.caveat_patch_kids"
    def till
      caveat_patchor = Pathname.new("~/Library/Application Support/Propane/unsupported/caveatPatchor.js").expand_path

      remove_file caveat_patchor.to_s
    end
  end
end
