500.times { Post.create title: Faker::Name.name, body: Faker::Lorem.paragraph(sentence_count: 2) }
