class UsersController < ApplicationController
  skip_before_action :authentication, only: [:create, :login]
  before_action :authentication, only: [:current]
  def create
    if User.find_by(email: params[:email])
      render json: {message: "error in signing up"}
    else
      user = User.new(first_name: params[:first_name].capitalize, last_name: params[:last_name].capitalize, phone: params[:phone], email: params[:email].downcase, password: params[:password], university_id: params[:university])
      if user.save
        token = JWT.encode({id: user.id, exp: 1.day.from_now.to_i}, ENV['SECRET_KEY_BASE'])
        render json: {message: "success in signing up", token: token}
      end
    end
  end

  def login
    user = User.find_by(email: params[:email]).downcase.try(:authenticate, params[:password])
    if user
      token = JWT.encode({id: user.id, exp: 1.day.from_now.to_i}, ENV['SECRET_KEY_BASE'])
      render json: {message: "logged in", token: token}
    else
      render json: {message: "logged in failed"}
    end
  end

  def current
    render json: {id: current_user.id, first_name: current_user.first_name}
  end
end
