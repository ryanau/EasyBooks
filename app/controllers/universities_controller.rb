class UniversitiesController < ApplicationController
  skip_before_action :authentication, only: [:index]
  def index
    universities = []
    University.all.each do |university|
      universities.push({payload: university.id.to_s, text: university.name})
    end
    render json: {data: universities}
  end
end
