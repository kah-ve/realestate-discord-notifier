# Real Estate Notifier w/ Discord (Work in Progress)

![Preliminary Image of App](https://github.com/kah-ve/realestate-discord-notifier/blob/master/assets/ExploreRealEstate.png)

Building a Real Estate Notifier that scrapes websites and presents results through a react frontend which communicates with a flask server hooked up to a postgresql db.

### My purposes with this app:

Practice design principles and best practices that catch my eye (such as oop, python typing, design patterns, decorators, factories). Think about architecture of code more and the whole system from frontend -> backend -> db, including familiarizing myself further with react & postgres.

### Usage Goal

3. Having a simple and interesting interaction between the app and discord to allow for real-time notifications and control such as favoriting a new home or removing it from your watchlist
4. Building a react frontend to display favorites and other homes that you have combed through. Also having the ability to list out features and do more finely tuned filtering that websites would not provide.
5. Buy a home?!

### How

Frontend: React -> Will display homes already saved, will be able to list homes together and apply finely tuned filtering
Backend: Flask -> Will handle scraping, parsing, sql queries, working with discord, etc
Database: Postgresql -> Retains persistent data regarding homes that were liked, filter settings, etc

## Documentation on running this repo

All you need to do to run this is fork then clone and build with

      docker-compose build

then run with

      docker-compose up

Then navigate on your browser to

      http://localhost:3000/

Here you will see a very basic react app that will be able to send some data as a request from react to flask and then from flask to the postgresql db.

### PostgreSQL Commands

You can

     docker exec -it [container id] bash

to the postgres container (named postgres) and then run the command

     psql -U postgres

This will open up a commandline within docker that looks like

     postgres=# ...

Here you can type commands such as \l to list databases, then \c to connect to a database, then \dt to list out the data tables within that database. Also you can execute normal SQL commands such as

      "SELECT * FROM [table-name];"

or

      "CREATE TABLE IF NOT EXISTS [table-name] (name text, ......);"

### React (Client side)

For outputs from react, see the developer console, and the network tab to get an idea of what's going on.

The app currently is just for playing around with the communications between the different tiers. You can post and get which will communciate with flask, which will subsequently communicate with postgresql to then execute the respective commands.

Can enter the docker container with the command

     docker exec -it [container id] sh (docker exec -it client sh)

### Flask (API side)

In the terminal that you ran

     docker-compose up

on, you can see the containers that are running and the outputs. I use this to see the outputs from a flask.

Also

     docker exec -it [container id] bash

into the flask container (named api) and run the command

     tail -f apiLogs.log

This will give you a live output of the logs in a less cluttered fashion for the backend.
