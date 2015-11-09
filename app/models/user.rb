class User < ActiveRecord::Base
  # validates :phone, uniqueness: true
  # has_secure_password

  belongs_to :university
  has_many :credits, -> { where(credits: {active: true, used: false}) }
  has_many :used_credits, -> { where(credits: {active: true, used: true}) }, :class_name => "Credit", :foreign_key => :user_id
  has_many :inactive_credits, -> { where(credits: {active: false}) }, :class_name => "Credit", :foreign_key => :user_id

  has_many :courses, -> { where(courses: {active: true}) }, through: :subscriptions

  has_many :subscriptions, -> { where(subscriptions: {active: true}) }
  has_many :inactive_subscriptions, -> { where(subscriptions: {active: false})}, :class_name => "Subscription", :foreign_key => :user_id

  has_many :stars, -> { where(stars: {active: true}) }
  has_many :inactive_stars,  -> { where(stars: {active: false}) }, :class_name => "Star", :foreign_key => :user_id

  has_many :posts, -> { where(posts: {active: true}) }, :through => :stars

  has_many :selling_posts, -> { where(posts: {active: true}) }, :class_name => "Post", :foreign_key => :seller_id
  has_many :inactive_selling_posts, -> { where(posts: {active: false}) }, :class_name => "Post", :foreign_key => :seller_id

  has_many :buying_posts, -> { where(posts: {active: true}) }, :class_name => "Post", :foreign_key => :buyer_id
  has_many :inactive_buying_posts, -> { where(posts: {active: false}) }, :class_name => "Post", :foreign_key => :buyer_id

  has_many :comments, through: :posts
  has_many :promouses

  has_many :selling_conversations,  -> { where(conversations: {active: true}) }, :class_name => "Conversation", :foreign_key => :seller_id
  has_many :inactive_selling_conversations,  -> { where(conversations: {active: false}) }, :class_name => "Conversation", :foreign_key => :seller_id

  has_many :buying_conversations, -> { where(conversations: {active: true}) }, :class_name => "Conversation", :foreign_key => :buyer_id
  has_many :buying_conversations, -> { where(conversations: {active: false}) }, :class_name => "Conversation", :foreign_key => :buyer_id

  validates_uniqueness_of :uid, scope: :phone
end