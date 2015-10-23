class SessionsController < ApplicationController
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
      jwt = JWT.encode({id: user.id, first_name: arr[0], last_name: arr[1], pic: pic, exp: 1.day.from_now.to_i}, ENV['SECRET_KEY_BASE'])
      query = {jwt: jwt}.to_query

      # comment the following line for development
      redirect_to "https://easybooks.herokuapp.com/?#{query}"

      # comment the following line when deploying on heroku
      # redirect_to "http://localhost:8080/?#{query}"
    else
      user = User.create!(uid: uid, first_name: arr[0], last_name: arr[1], token: token, pic: pic, university_id: 1)
      jwt = JWT.encode({id: user.id, first_name: arr[0], last_name: arr[1], pic: pic, exp: 1.day.from_now.to_i}, ENV['SECRET_KEY_BASE'])
      query = {jwt: jwt}.to_query

      # comment the following line for development
      redirect_to "https://easybooks.herokuapp.com/?#{query}"

      # comment the following line when deploying on heroku
      # redirect_to "http://localhost:8080/?#{query}"
    end
  end

  private

  def auth_hash
    request.env['omniauth.auth']
  end
end

