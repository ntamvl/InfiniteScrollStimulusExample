Rails.application.routes.draw do
  get '/hello' => 'pages#hello'
  resources :posts
  get "up" => "rails/health#show", as: :rails_health_check
end
