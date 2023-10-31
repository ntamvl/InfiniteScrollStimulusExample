// This file is auto-generated by ./bin/rails stimulus:manifest:update
// Run that command whenever you add a new controller or create them with
// ./bin/rails generate stimulus controllerName

import { application } from "./application"

import DemoController from "./demo_controller"
application.register("demo", DemoController)

import HelloController from "./hello_controller"
application.register("hello", HelloController)

import InfinitivePaginationController from "./infinitive_pagination_controller"
application.register("infinitive-pagination", InfinitivePaginationController)