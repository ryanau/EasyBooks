class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
      t.float :price, null: false
      t.string :picture_url
      t.boolean :sold, default: true
      t.boolean :public, default: true
      t.string :pickup
      
      t.integer :coures_id, null: false
      t.integer :seller_id, null: false
      t.integer :buyer_id, null: false

      t.timestamps null: false
    end
  end
end
