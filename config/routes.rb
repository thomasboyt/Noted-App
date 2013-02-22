Noted::Application.routes.draw do

  if Rails.env.production?
    offline = Rack::Offline.configure :cache_interval => 120 do      
      cache ActionController::Base.helpers.asset_path("application.css")
      cache ActionController::Base.helpers.asset_path("application.js")
      cache "assets/fontawesome-webfont.eot?v=3.0.2"
      cache "assets/fontawesome-webfont.eot?#iefix&v=3.0.2"
      cache "assets/fontawesome-webfont.woff?v=3.0.2"
      cache "assets/fontawesome-webfont.ttf?v=3.0.2"
      # cache other assets
      network "/"  
    end
    match "/application.appcache" => offline  
  end

  # match "/application.appcache" => Rails::Offline

  root :to => 'assets#index'
end
