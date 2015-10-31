class CreatePromouses < ActiveRecord::Migration
  def change
    create_table :promouses do |t|
      t.integer :user_id, null: false
      t.integer :promo_id, null: false
      t.timestamps null: false
    end
  end
end
