class CreatePromos < ActiveRecord::Migration
  def change
    create_table :promos do |t|
      t.string :code, null: false
      t.date :expiry
      t.timestamps null: false
    end
  end
end
