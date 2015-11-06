class UniversitiesController < ApplicationController
  skip_before_action :authentication, only: [:index]
  before_action :authentication, only: [:find_school]
  def index
    universities = []
    University.all.each do |university|
      universities.push({payload: university.id.to_s, text: university.name})
    end
    render json: {data: universities}
  end

  def find_school
    email = params[:university]
    university = email[email.index(/\@(.*)/).. email.length]
    if university.include? "berkeley.edu"
      id = University.find_by(name: "University of California, Berkeley").id
      render json: {id: id}
    else
      render json: {id: 0}
    end
  end
end
