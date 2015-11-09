Rails.application.routes.draw do
  match '*all', to: 'application#cors_preflight_check', via: [:options]

  scope :api do
    # resources :users, only: [:create]
    resources :universities, only: [:index]
    resources :subscriptions, only: [:index, :create]
    resources :posts, only: [:index, :show, :create, :destroy]
    resources :courses, only: [:index]
    resources :comments, only: [:index, :create]
    resources :stars, only: [:index, :create]

    get '/universities/find_school', :to => 'universities#find_school'
    
    get '/credits/count', :to => 'credits#count'

    delete '/stars', :to => 'stars#destroy'
    get '/stars/count', :to => 'stars#count'
    get '/stars/starred', :to => 'stars#starred'
    get '/stars/position', :to => 'stars#position'

    put '/posts/mark_sold', :to => 'posts#mark_sold'
    get '/active_posts', :to => 'posts#active_posts'
    get '/starred_posts', :to => 'posts#starred_posts'
    get '/starred_posts_count', :to => 'posts#starred_posts_count'
    get '/archived_posts', :to => 'posts#archived_posts'
    get '/mutual_friends', :to => 'posts#mutual_friends'
    post '/image_upload', :to => 'posts#image_upload'
    get '/sell_status', :to => 'posts#sell_status'
    get '/follow_count', :to => 'posts#follow_count'

    put '/subscriptions', :to => 'subscriptions#update'
    post '/parse_calendar', :to => 'subscriptions#parse_calendar'

    get '/promo/verify', :to => 'promos#verify'

    # get '/login', :to => 'users#login'
    get '/current_user', :to => 'users#current'
    post '/register', :to => 'users#register'

    post '/sms_inbound', :to => 'sms#approve'

    get '/environment', :to => 'sessions#environment'
  end
  get '/auth/facebook/callback', :to => 'sessions#create'

  match '*all', to: 'client_app#index', via: [:get]
end
