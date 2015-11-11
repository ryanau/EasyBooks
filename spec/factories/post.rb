FactoryGirl.define do
  factory :post do
    price 30
    title "Intro to Stats"
    condition "Good"
    university_id 1
    course_id 1
    seller_id 1
  end
end