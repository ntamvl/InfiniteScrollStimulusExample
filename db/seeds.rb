500.times do
  Post.create title: Faker::Movie.title, body: Faker::Quote.famous_last_words
end
