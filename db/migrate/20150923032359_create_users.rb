class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :uid, null: false
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.string :email
      t.string :phone
      t.string :token, null: false
      t.string :pic, null: false
      t.string :password_digest
      t.boolean :completed, default: false

      t.integer :university_id
      
      t.timestamps null: false
    end
  end
end
