class CreateEntries < ActiveRecord::Migration
  def change
    create_table :entries do |t|
      t.integer :seller_id, null: false
      t.integer :buyer_id, null: false
      t.integer :post_id, null: false
      t.string :venmo_transaction_id
      t.string :amount, null: false

      t.timestamps null: false
    end
  end
end