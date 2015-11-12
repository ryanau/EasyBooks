class SessionsController < ApplicationController
  before_action :authentication, only: [:venmo_status]
  def create
    token = auth_hash.credentials.token
    name = auth_hash.info.name
    pic = auth_hash.info.image
    uid = auth_hash.uid
    arr = []
    arr.unshift(name[0, name.index(/\s{1}/, 1)])
    arr.push(name[name.index(/\s{1}/, 1) + 1, name.length])

    user = User.find_by(uid: uid)
    if user
      user.update_attributes(token: token)
      jwt = JWT.encode({id: user.id, first_name: arr[0], last_name: arr[1], pic: pic, exp: 5.day.from_now.to_i}, ENV['SECRET_KEY_BASE'])
      query = {jwt: jwt}.to_query

      Rails.env == "development" ? link = "http://localhost:8080/?#{query}" : link = "https://easybooks.herokuapp.com/?#{query}"
      redirect_to link
    else
      user = User.create!(uid: uid, first_name: arr[0], last_name: arr[1], token: token, pic: pic, university_id: 1)
      jwt = JWT.encode({id: user.id, first_name: arr[0], last_name: arr[1], pic: pic, exp: 5.day.from_now.to_i}, ENV['SECRET_KEY_BASE'])
      query = {jwt: jwt}.to_query

      Rails.env == "development" ? link = "http://localhost:8080/?#{query}" : link = "https://easybooks.herokuapp.com/?#{query}"
      redirect_to link
    end
  end

  def venmo_create
    uid = auth_hash.uid
    token = auth_hash.credentials.token
    if auth_hash.info.phone.length != 10
      phone = auth_hash.info.phone[1..-1]
    end

    if venmo_account = VenmoAccount.find_by(venmo_uid: uid)
      venmo_account.update_attributes(token: token)
      message = "Venmo token updated"

      query = {venmo_status: true}.to_query

      Rails.env == "development" ? link = "http://localhost:8080/?#{query}" : link = "https://easybooks.herokuapp.com/?#{query}"
      redirect_to link
    else
      user = User.find_by(phone: phone)
      VenmoAccount.create(venmo_uid: uid, token: token, user_id: user.id)
      message = "Venmo account linked to EasyBooks"

      query = {venmo_status: true}.to_query

      Rails.env == "development" ? link = "http://localhost:8080/?#{query}" : link = "https://easybooks.herokuapp.com/?#{query}"
      redirect_to link
    end
  end

  def environment
    render json: {mode: Rails.env}
  end

  def venmo_status
    if VenmoAccount.find_by(user_id: current_user.id)
      status = true
    else
      status = false
    end
    render json: {status: status}
  end

  private

  def auth_hash
    request.env['omniauth.auth']
  end
end

