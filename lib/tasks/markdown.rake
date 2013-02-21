# compile all markdown templates in app/assets/javascripts/templates to handlebars (html) templates

require 'redcarpet'

namespace :markdown do
  desc "Compile all Markdown (.md) templates in app/assets/javascripts/templates to Handlebars (html) templates for use as Ember.JS partials"
  task :compile => :environment do

    # create markdown renderer
    markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML, :autolink => true)

    # find and render markdown (.md) files
    fl = FileList['app/assets/javascripts/templates/**/*.md']
    fl.each do |file_path| 
      contents = IO.read(file_path)
      name = File.basename(file_path)
      path = File.dirname(file_path)
      html = markdown.render(contents)
      new_file_path = File.join(path, "_#{name}.handlebars")
      File.open(new_file_path, mode='w') do |file|
        file.write(html)
      end
      puts "Created #{new_file_path}"
    end 
  end
end