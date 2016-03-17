# Trip Map

### Summary

Provide an efficient and straightforward way to plan a trip, user only need to input start and destination as well as route perference, and then the route would be calculated depending on comment and reviews wrote by other users.

This application was powered by ***react.js, node.js, Bootstrap and mongoDB***, and also used some tools such as ***Gulp, browerify and git***.


### Home
You could input your start and destination at left side with route perference (entertainment, food, traffic, beauty), and then the route based on your input would show up on right side.

![home_page](/screenshot/page_01.png)

### Review
At the top of the page is a summery of the current place, and you can view the comments by scrolling down a little bit, at bottom of the page you are allowed to leave you own comment. 

<p align="center">
  <img src="/screenshot/page_02.png" alt="Review" width="800" />
</p>

### Place
This page would allow user to add new place with basic information, but don't worry about too much details such as latitude and longitude, google map api will help you to fill those.

<p align="center">
  <img src="/screenshot/page_03.png" alt="Place" width="800" />
</p>

### Run
Build the app
```sh
$ gulp
```
Start mongoDB
```sh
$ mongod
```
Start node.js server and automatically restart it when file changes
```sh
$ npm run watch
```
