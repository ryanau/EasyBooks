class CreateCourses < ActiveRecord::Migration
  def change
    create_table :courses do |t|
      t.string :department, null: false
      t.string :course_number, null: false
      t.string :semester, null: false
      t.string :year, null: false

      t.integer :university_id, null: false

      t.timestamps null: false
    end
  end
end
