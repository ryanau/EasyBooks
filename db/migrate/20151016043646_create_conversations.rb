class CreateConversations < ActiveRecord::Migration
  def change
    create_table :conversations do |t|
      t.integer :star_id, null: false
      t.integer :seller_id, null: false
      t.integer :buyer_id, null: false
      t.integer :seller_phone_id, null: false
      t.integer :buyer_phone_id, null: false

      t.timestamps null: false
    end
  end
end
