require 'faker'

# seed universities
university = University.create(name: "University of California, Berkeley")
University.create(name: "University of Southern California")
University.create(name: "Stanford University")


# seed courses
university.courses.create(department: "ESPM", course_number: "50AC", year: "2015", semester: "FALL")
university.courses.create(department: "CS", course_number: "70", year: "2015", semester: "FALL")
university.courses.create(department: "PE", course_number: "101A", year: "2015", semester: "FALL")
university.courses.create(department: "UGBA", course_number: "109", year: "2015", semester: "FALL")
university.courses.create(department: "ESPM", course_number: "50AC", year: "2015", semester: "SPRING")

# seed users
10.times do
  User.create(first_name: Faker::Name.first_name, last_name: Faker::Name.last_name, email: Faker::Internet.email, phone: Faker::Number.number(10), password: "1234", university_id: 1)
end

# seed posts and books
[1,2,3,4,5].each do |id|
  post = Post.create(seller_id: id, course_id: id, pickup: Faker::Address.country, price: Faker::Number.between(15, 100), title: Faker::Commerce.product_name)
  post.books.create(name: Faker::App.name, edition: Faker::App.version, condition: "New")
end

# seed stars
[6,7,8,9,10].each do |id|
  User.find(id).stars.create(post_id: id - 5)
end

# seed subscriptions
[1,2,3,4,5].each do |id|
  User.find(id).subscriptions.create(course_id: id)
end

# seed comments

# seed suggestedbooks
