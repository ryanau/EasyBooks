Rails.application.routes.draw do
  match '*all', to: 'application#cors_preflight_check', via: [:options]

  scope :api do
    resources :users, only: [:create]
    resources :universities, only: [:index]
    resources :subscriptions, only: [:index, :create]
    resources :posts, only: [:index, :show, :create, :update]
    resources :courses, only: [:index]
    resources :comments, only: [:index, :create]
    put '/subscriptions', :to => 'subscriptions#update'
    post '/image_upload', :to => 'posts#image_upload'
    post '/parse_calendar', :to => 'subscriptions#parse_calendar'
    get '/login', :to => 'users#login'
    get '/current_user', :to => 'users#current'
  end

  match '*all', to: 'client_app#show', via: [:get]
end
