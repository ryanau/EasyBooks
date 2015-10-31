class PromosController < ApplicationController
  before_action :authentication, only: [:verify]

  def verify
    promo = Promo.find_by(code: params[:promo].upcase)
    if promo
      if current_user.promouses.find_by(promo_id: promo.id)
        render json: {message: 'Code Previously Used'}
      else
        current_user.promouses.create(promo_id: promo.id)
        render json: {message: 'Code Applied'}
      end
    else
      render json: {message: 'Invalid Promo Code'}
    end
  end
end