class CreateSuggestedbooks < ActiveRecord::Migration
  def change
    create_table :suggestedbooks do |t|
      t.string :name, null: false
      t.string :edition, null: false
      t.string :author, null: false
      t.float :store_price

      t.integer :course_id, null: false

      t.timestamps null: false
    end
  end
end
