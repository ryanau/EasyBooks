Rails.application.routes.draw do
  match '*all', to: 'application#cors_preflight_check', via: [:options]

  scope :api do
    resources :users, only: [:create]
    resources :universities, only: [:index]
    get '/login', :to => 'users#login'
    get '/current_user', :to => 'users#current'
  end

  match '*all', to: 'client_app#show', via: [:get]
end
