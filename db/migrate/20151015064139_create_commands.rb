class CreateCommands < ActiveRecord::Migration
  def change
    create_table :commands do |t|
      t.integer :star_id, null: false
      t.string :random_num, null: false
      t.string :action, null: false
      t.timestamps null: false
    end
  end
end
