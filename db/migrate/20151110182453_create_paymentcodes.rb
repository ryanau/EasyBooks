class CreatePaymentcodes < ActiveRecord::Migration
  def change
    create_table :paymentcodes do |t|
      t.integer :conversation_id, null: false
      t.string :random_num, null: false
      t.integer :seller_id, null: false
      t.integer :buyer_id, null: false
      
      t.timestamps null: false
    end
  end
end
