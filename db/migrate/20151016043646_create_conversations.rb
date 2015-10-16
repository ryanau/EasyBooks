class CreateConversations < ActiveRecord::Migration
  def change
    create_table :conversations do |t|
      t.integer :star_id, null: false
      t.integer :user_id, null: false
      t.string :phone_id, null: false

      t.timestamps null: false
    end
  end
end
