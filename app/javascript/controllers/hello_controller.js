import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    console.log("hello controller connected: ", (new Date()))
    this.element.textContent = "Hello World!"
  }
}
