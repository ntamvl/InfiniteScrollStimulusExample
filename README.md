# Infinite Scroll with Stimulus

Infinite scroll is a pagination mechanism where whenever the user reaches the end of the scroll area more content is loaded till there are no more content to load.

**Introduction**

Hotwire is a new set of tools extracted from Hey by Basecamp. It uses Asynchronous HTML and HTTP (also known as AHAH) to render partial updates to the DOM without full browser reload. You build your servers with any language of your choice and let Turbo handle the partial updates for you. Which makes your application to have a speed of an SPA while having the benefits of server-rendered partials.

HOTWire is not a single tool, but three tools that allow you to build super fast apps while not having to write tons of client-side JavaScript to manage the updates. The tools within HOTWire are

1- Turbo: which is responsible for the navigation in your application and rendering the server responses to update the correct partial in the DOM.

2- Stimulus: Sometimes we would like to add a little bit of client-side behaviour to our site, the feature is too simple to let Turbo manage it and doesn't require a round trip to the server. There, Stimulus comes into play. You add behaviour to your HTML and sprinkles of JavaScript for this.

3- Strada: Standardizes the way that web and native parts of a mobile hybrid application talk to each other via HTML bridge attributes

References:
- https://stimulus.hotwired.dev/

## Setup Rails project
```bash
rails new InfiniteScrollStimulusExample  -c=bootstrap -j=esbuild

cd InfiniteScrollStimulusExample
bundle add kaminari faker
yarn add @rails/request.js

rails g scaffold Post title body:text
```

**Modify action index in app/controllers/posts_controller.rb**
```rb
# app/controllers/posts_controller.rb
class PostsController < ApplicationController
  ...

  def index
    @page = params[:page] || 1
    @posts = Post.page @page
  end

  ...
end
```

**Create infinitive_pagination stimulus controller**
```bash
rails g stimulus infinitive_pagination
```

```js
// infinitive_pagination_controller.js
import { Controller } from "@hotwired/stimulus"
import { get } from "@rails/request.js"

// Connects to data-controller="infinitive-pagination"
export default class extends Controller {
  static targets = ['lastPage', 'loadMoreButton']

  static values = {
    url: String,
    page: Number,
  }

  initialize() {
    this.handleScroll = this.handleScroll.bind(this)
    this.pageValue = this.pageValue || 1
    this.loading = false
  }

  connect() {
    window.loadMoreButtonTarget = this.loadMoreButtonTarget
    window.addEventListener("scroll", this.handleScroll)
  }

  disconnect() {
    window.removeEventListener("scroll", this.handleScroll)
  }

  handleScroll() {
    const reachEndPage = this.hasReachEndPage()
    if (reachEndPage && !this.hasLastPageTarget) {
      this.loadMore()
    } else {
      this.hideLoadMoreButton()
    }
  }

  hasReachEndPage() {
    const bottomHeight = 20
    let body = document.body, html = document.documentElement
    let height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
    const distance = height - window.innerHeight - bottomHeight
    const reachEndPage = window.scrollY >= distance
    return reachEndPage
  }

  hasReachEndPage2() {
    const bottomHeight = 20
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement
    const distance = scrollHeight - scrollTop - clientHeight
    return distance < bottomHeight
  }

  async loadMore() {
    if (this.loading) {
      return
    }

    this.loading = true
    this.pageValue += 1
    const url = new URL(this.urlValue)
    url.searchParams.set('page', this.pageValue)
    await get(url.toString(), { responseKind: 'turbo-stream' })
    this.loading = false
  }

  async handleLoadMoreButton(e) {
    await this.loadMore()
    e.target.blur()
  }

  hideLoadMoreButton() {
    this.loadMoreButtonTarget.classList.add('d-none')
  }
}

```

**Modify index.html.erb**
```html
<p style="color: green"><%= notice %></p>
<h1>Posts</h1>
<%= link_to "New post", new_post_path %>
<div data-controller="infinitive-pagination"
  data-infinitive-pagination-url-value="<%= posts_url %>"
  data-infinitive-pagination-page-value="1"
>
  <div id="posts">
    <% @posts.each do |post| %>
      <%= render post %>
      <p>
        <%= link_to "Show this post", post %>
      </p>
    <% end %>
  </div>
  <button data-action="click->infinitive-pagination#handleLoadMoreButton" data-infinitive-pagination-target="loadMoreButton">
    Load more
  </button>
</div>
```

**Create index.turbo_stream.erb**
```html
<%= turbo_stream.append "posts" do %>
  <%= render @posts %>
  <% if @posts.page(@page.to_i + 1).out_of_range? %>
    <span class="hidden" data-infinitive-pagination-target="lastPage"></span>
  <% end %>
<% end %>
```

Modify `db/seeds.rb`
```rb
# db/seeds.rb
500.times { Post.create title: Faker::Name.name, body: Faker::Lorem.paragraph(sentence_count: 2) }

```

Migrate database and seed data
```bash
rails db:migrate db:seed
```

Currently I'm running many apps, Rails app will run on default port 3000, so I modify `Procfile.dev` to run different port to avoid confict, I modify like this:
```
web: env RUBY_DEBUG_OPEN=true bin/rails server -p 4001
js: yarn build --watch
css: yarn watch:css
```

**Run app**
```bash
./bin/dev
```

Open your browser and goto `http://localhost:4001/posts`

Enjoy!!! :smile:

Tam Nguyen *(Oct 31, 2023)*
