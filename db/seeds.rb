require 'csv'  

# seed universities
university = University.create(name: "University of California, Berkeley")
University.create(name: "University of Southern California")
University.create(name: "Stanford University")


# seed courses
university.courses.create(department: "CS", course_number: "70", year: "2016", semester: "SPRING")
university.courses.create(department: "PE", course_number: "101", year: "2016", semester: "SPRING")
university.courses.create(department: "UGBA", course_number: "102A", year: "2016", semester: "SPRING")
university.courses.create(department: "ESPM", course_number: "50AC", year: "2016", semester: "SPRING")

# CSV.foreach(File.path('spring_16_classes.csv')) do |row|
#   if row[0] != "department"
#     university.courses.create(department: row[0], course_number: row[1], year: "2016", semester: "SPRING")
#   end
# end

# seed me
# User.create(first_name: "Ryan", last_name: "Au", email: "test@test.com", phone: "6265005826", password: "1234", university_id: 1)

# seed phone
Phone.create(number: "+15102963497")

# seed promo
Promo.create(code: "XYZXYZ", info: "1 Free Selling Credit", credit: 1)
Promo.create(code: "XYZXYA", info: "5 Free Selling Credit", credit: 5)
Promo.create(code: "XYZXYB", info: "1 Free Selling Credit", credit: 1)
Promo.create(code: "ILUVPM", info: "You love PM huh? You just earned yourself 10 Free Selling Credit! Note: Venmo Authorization is disabled for demo purposes.", credit: 10)

# seed users
# 10.times do
#   User.create(first_name: Faker::Name.first_name, last_name: Faker::Name.last_name, email: Faker::Internet.email, phone: Faker::Number.number(10), password: "1234", university_id: 1)
# end

# seed posts
# conditions = ['New', 'Like New', 'Good', 'Fair']
# (1..100).each do |id|
#   post = Post.create(seller_id: Faker::Number.between(0, 10), course_id: Faker::Number.between(0, 3000), pickup: Faker::Address.country, price: Faker::Number.between(15, 100), title: Faker::Commerce.product_name, description: 'its good', condition: conditions.shuffle.first, picture_url: "https://www.petfinder.com/wp-content/uploads/2012/11/140272627-grooming-needs-senior-cat-632x475.jpg")
# end

# seed stars
# [6,7,8,9,10].each do |id|
#   User.find(id).stars.create(post_id: id - 5)
# end



# seed subscriptions
# [1,2,3,4,5].each do |id|
#   User.find(id).subscriptions.create(course_id: id)
# end

# seed comments

# seed suggestedbooks
