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
    const reachEndPage = this.hasReachEndPage2()
    if (reachEndPage && !this.hasLastPageTarget) {
      this.loadMore()
    } else {
      this.hideLoadMoreButton()
    }
  }

  hasReachEndPage() {
    const bottomHeight = 20
    const body = document.body
    const html = document.documentElement
    const height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
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
