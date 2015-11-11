class Post < ActiveRecord::Base
  belongs_to :seller, :class_name => "User", :foreign_key => :seller_id
  belongs_to :buyer, :class_name => "User", :foreign_key => :buyer_id
  belongs_to :course
  has_one :entry

  # has_many :stars, dependent: :destroy
  has_many :stars,  -> { where(stars: {active: true}) }
  has_many :inactive_stars,  -> { where(stars: {active: false}) }, :class_name => "Star", :foreign_key => :post_id
  
  has_many :comments, dependent: :destroy
end
