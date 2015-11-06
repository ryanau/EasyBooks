class CreateCredits < ActiveRecord::Migration
  def change
    create_table :credits do |t|
      t.integer :user_id, null: false
      t.string :method
      t.integer :promouse_id
      t.timestamps null: false
    end
  end
end
