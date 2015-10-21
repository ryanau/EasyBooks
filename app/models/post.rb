class Post < ActiveRecord::Base
  belongs_to :seller, :class_name => "User", :foreign_key => :seller_id
  belongs_to :buyer, :class_name => "User", :foreign_key => :buyer_id
  belongs_to :course

  has_many :stars, dependent: :destroy
  has_many :comments, dependent: :destroy
end
