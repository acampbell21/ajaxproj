Rails.application.routes.draw do
  root 'games#index'

  get 'game_form', to: 'games#form'
  get 'character_form', to: 'characters#form'

  resources :games do
    resources :characters
  end
end
