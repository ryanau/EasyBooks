class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.string :email, null: false
      t.string :phone, null: false
      t.string :password_digest, null: false

      t.integer :university_id
      
      t.timestamps null: false
    end
  end
end
