class Paymentcode < ActiveRecord::Base
  belongs_to :conversation
  validates_uniqueness_of :random_num, scope: [:conversation_id, :seller_id, :buyer_id]
end
