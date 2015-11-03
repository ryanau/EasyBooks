class PromosController < ApplicationController
  before_action :authentication, only: [:verify]

  def verify
    promo = Promo.find_by(code: params[:promo].upcase)
    if promo
      if current_user.promouses.find_by(promo_id: promo.id)
        render json: {message: 'Code Previously Used'}
      else
        promouse = current_user.promouses.create(promo_id: promo.id)
        current_user.credits.create(promouse_id: promouse.id, method: "Promo Code")
        render json: {message: "Code Applied: #{promo.info}"}
      end
    else
      render json: {message: 'Invalid Promo Code'}
    end
  end
end