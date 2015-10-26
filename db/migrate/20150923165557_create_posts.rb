class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
      t.float :price, null: false
      t.string :picture_url
      t.string :title, null: false
      t.string :description
      t.boolean :sold, default: false
      t.boolean :public, default: true
      t.string :pickup
      t.string :condition, null: false
      
      t.integer :course_id, null: false
      t.integer :seller_id, null: false
      t.integer :buyer_id

      t.timestamps null: false
    end
  end
end
