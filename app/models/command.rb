class Command < ActiveRecord::Base
  belongs_to :star
  validates_uniqueness_of :random_num, scope: :star_id
end
