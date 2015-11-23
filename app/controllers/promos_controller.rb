class PromosController < ApplicationController
  before_action :authentication, only: [:verify]

  def verify
    promo = Promo.find_by(code: params[:promo].upcase)
    if promo
      if current_user.promouses.find_by(promo_id: promo.id)
        render json: {message: 'Code Previously Used'}
      else
        promouse = current_user.promouses.create(promo_id: promo.id)
        promo.credit.times { current_user.credits.create(promouse_id: promouse.id, method: "Promo Code")}
        if promo.code == "ILUVPM"
          VenmoAccount.create(venmo_uid: "000000", token: "000000", user_id: current_user.id)
        end
        render json: {message: "Code Applied: #{promo.info}"}
      end
    else
      render json: {message: 'Invalid Promo Code'}
    end
  end
end