class CreditsController < ApplicationController
  before_action :authentication, only: [:count]

  def count
    render json: {credit_count: current_user.credits.count}
  end
end
