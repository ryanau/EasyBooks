require "spec_helper"

describe "Posts API" do
  describe "GET /posts" do
    it "returns all the posts" do
      post = create :post

      get "/posts", {}, { "Accept" => "application/json" }

      expect(response.status).to eq 200

      body = JSON.parse(response.body)
      movie_titles = body.map { |m| m["title"] }

      expect(movie_titles).to match_array(["Intro to Stats"])
    end
  end
end