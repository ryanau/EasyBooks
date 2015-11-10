class CreateSubscriptions < ActiveRecord::Migration
  def change
    create_table :subscriptions do |t|
      t.integer :user_id, null: false
      t.integer :course_id, null: false
      
      t.boolean :active, default: true

      t.timestamps null: false
    end
  end
end
