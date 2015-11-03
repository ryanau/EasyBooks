class User < ActiveRecord::Base
  validates :phone, uniqueness: true
  # has_secure_password

  belongs_to :university
  has_many :credits, dependent: :destroy
  has_many :courses, through: :subscriptions
  has_many :subscriptions, dependent: :destroy
  has_many :stars, dependent: :destroy
  has_many :posts, through: :stars
  has_many :selling_posts, :class_name => "Post", :foreign_key => :seller_id, dependent: :destroy
  has_many :buying_posts, :class_name => "Post", :foreign_key => :buyer_id
  has_many :comments, through: :posts
  has_many :comments, dependent: :destroy
  has_many :promouses, dependent: :destroy
  has_many :selling_conversations, :class_name => "Conversation", :foreign_key => :seller_id, dependent: :destroy
  has_many :buying_conversations, :class_name => "Conversation", :foreign_key => :buyer_id

  validates_uniqueness_of :uid, scope: :phone
end
