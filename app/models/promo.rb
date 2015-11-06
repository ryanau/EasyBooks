class Promo < ActiveRecord::Base
  has_many :promouses
  validates :code, length: { is: 6 }
end
