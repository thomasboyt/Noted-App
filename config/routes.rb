Noted::Application.routes.draw do

  # if Rails.env.production?
  #   offline = Rack::Offline.configure :cache_interval => 120 do      
  #     #cache ActionController::Base.helpers.asset_path("application.css")
  #     #cache ActionController::Base.helpers.asset_path("application.js")
  #     # cache other assets
  #     network "/"  
  #   end
  #   match "/application.manifest" => offline  
  # end

  match "/application.appcache" => Rails::Offline

  root :to => 'assets#index'
end
