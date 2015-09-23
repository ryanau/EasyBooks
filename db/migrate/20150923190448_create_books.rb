class CreateBooks < ActiveRecord::Migration
  def change
    create_table :books do |t|
      t.string :name, null: false
      t.string :edition, null: false
      t.string :condition, null: false

      t.integer :post_id

      t.timestamps null: false
    end
  end
end
