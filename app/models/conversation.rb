class Conversation < ActiveRecord::Base
  belongs_to :star
  belongs_to :phone
end
