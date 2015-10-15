class SmsController < ApplicationController
  def approve
    from_input = params[:From]
    from = from_input[2, from_input.length]
    body = params[:Body].upcase

    p from_input
    p body
  end
end
