class AddExpiredToStars < ActiveRecord::Migration
  def change
    add_column :stars, :expired, :boolean, :default => false
  end
end
