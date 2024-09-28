# Verve Project

An unfinished yet event management website with implemented NextAuth.js authorisation and MySQL database, 
it has password encryption and is able to fetch events to display in a scheduler. Made with Next.js.

## Running the app locally

Clone the repository and install necessary dependencies
```
  git clone https://github.com/podanenko826/verve-project.git
  cd verve-project
  npm install
  npm run dev
```
Then you can access the app at https://localhost:3000/

You will also need to launch a local MySQL instance and apply the Prisma schema file located in the project directory to it.

Also the Google signing in option may be broken for you so you would need to create your own Google API and configure it to work with the app.
By the way, the built-in account creation credentials method should work, so you could register an account there.

## App overview

The design is yet unfinished and inconsistent, some pages are still incomplete

<img width="1728" alt="Screenshot 2024-09-28 at 11 37 35" src="https://github.com/user-attachments/assets/b29a4493-bd3c-4ddf-9414-314ce048482c">
<img width="1728" alt="Screenshot 2024-09-28 at 11 37 56" src="https://github.com/user-attachments/assets/94a0abfe-9b06-490f-aa77-1d923e512614">

## "Working" with the app

After you install all the necessary prerequisities, you can navigate through the app and do some basic stuff like:

* Creating and logging in to accounts
* Creating/modifying events
* Archiving the events
* Using the "Dynamic Search" (search bar) to quickly access actions with the events

# Contributing

The project is currently not in development so you can feel free to fork this project and use it as you want to. Just leave my creadentials somewhere on the website😁.

I don't honestly know what this project could be interesting for, if you are new to Next.js and building apps in general (though was I when building this app), it may be.
