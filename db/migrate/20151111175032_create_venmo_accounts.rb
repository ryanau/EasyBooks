class CreateVenmoAccounts < ActiveRecord::Migration
  def change
    create_table :venmo_accounts do |t|
      t.string :venmo_uid
      t.string :token
      t.integer :user_id
      t.timestamps null: false
    end
  end
end
