class CreateStars < ActiveRecord::Migration
  def change
    create_table :stars do |t|
      t.integer :post_id, null: false
      t.integer :user_id, null: false
      t.boolean :sent, default: false
      t.boolean :accepted, default: false

      t.boolean :active, default: true
      
      t.timestamps null: false
    end
  end
end
