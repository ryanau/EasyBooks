class AddSubscriptionIdToCommands < ActiveRecord::Migration
  def change
    add_column :commands, :subscription_id, :integer
    change_column :commands, :star_id, :integer, :null => true
  end
end
