class User < ActiveRecord::Base
  validates :email, uniqueness: true
  has_secure_password

  belongs_to :university
  has_many :courses, through: :subscriptions
  has_many :subscriptions
  has_many :stars
  has_many :posts, through: :stars
  has_many :selling_posts, :class_name => "Post", :foreign_key => :seller_id
  has_many :buying_posts, :class_name => "Post", :foreign_key => :buyer_id
  has_many :comments, through: :posts

end
