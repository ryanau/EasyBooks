class Promouse < ActiveRecord::Base
  belongs_to :promo
  belongs_to :user
  validates_uniqueness_of :user_id, scope: :promo_id
end
