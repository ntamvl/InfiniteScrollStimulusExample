import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="demo"
export default class extends Controller {
  connect() {
    console.log("demo controller connected: ", (new Date()))
    this.element.textContent = "Demo Stimulus!"
    window.addEventListener("scroll", this.handleScroll)
  }

  disconnect() {
    window.removeEventListener("scroll", this.handleScroll)
  }

  handleScroll() {
    console.log("demo scroll: ", (new Date()))
  }
}
