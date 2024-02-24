# Startup Specification
A BYU CS260 creation

## Introducing... TOURIST TYCOON 🧳💼🛫 (Elevator Pitch)
How would you like to go to Hong Kong? Or Australia? Or Ecuador? Or Europe? Everyone loves the rush of dopamine at the idea of getting away and vacationing 😎. I mean, come on, wouldn't you rather go skydiving or embark on a cruise or sample fine dining as opposed to taking 18 credits and stressing over your chess project? There's only one thing cooler than that and that is money 🤑. Tourist Tycoon is an online game that gets you _both_! You get to start your own travel agency and work your way up to colonize the world... at least in terms of travel. Invite your friends to play and see who can become the biggest Tourist Tycoon!

## Home Page
![homepage](homepage.PNG)
Login and register buttons, development news and a brief blurb about the game.

## Register
![register](register.PNG)
Pretty self-explanatory.

## Gameplay
The gameplay will consist of three tabs.

### Agency Interface
![agency tab](agencyclicker.PNG)
This is where the user will uprgrade their agencies hotel bookings, travel means, and tours for each individual location.

### Locations
![worldmap](worldexpansions.PNG)
This is where the user can upgrade to expand to different locations.

### Leaderboard
![leaderboard](leaderboard.PNG)
Here the users can scroll and see who has the most money.

## Features
* Login over HTTPS into individual travel agency
* Open the agency and start making profits
* Upgrade attractions, hospitality, and transportation with profits
* Branch out to other contries
* Leaderboard of tycoon net worth
* Push notifications when other players make significant upgrades to their agency
* Tycoon saved and agency closed on logout

## Technology Usage
* **HTML** - page structure
* **CSS** - stylize a user interface that will make for a stylistically beautiful travel agency (for the aesthetic and the vibes)
* **JavaScript** - endpoint calls to login, upgrade tycoon, extend to other countries, view leaderboard
* **Services**
  * Login
  * Get Leaderboard
  * Upgrade agency element
  * Expand to a country
* **WebSocket** - notify other players about upgrades or expansions that a player has made
* **Database** - save login and travel agency

## HTML Deliverable

- **Simon HTML deployed** -- true
- **Github link in footer** -- got it
- **Notes about the deliverable** -- see heading below
- **10 commits** -- check
- **HTML pages for each compenent of application** -- 6 pages
- **proper use of HTML tags** -- i think so but there are so many dude
- **Links between pages** -- so far so good
- **Application textual content** -- eh could be better
- **Placeholder for 3rd party service calls** -- that palm tree image is gonna change based on location.
- **Application images** -- part of 3rd party call, also in canvas location element
- **Login placeholder w/ username display** --yeah theres a login place holder
- **Database placeholder** --should be obvious with login data, but I also think I'm going to turn the tycoons into jsons or something like that.
- **Websocket placeholder** --shows where other players are expanding to

### HTML Additions:

**index.html** - has news and information about the game
**register.html** - has a form including username, password and email. There is also a disclaimer saying I store the data and put the username out there.
**login.html** - similar to register, but doesn't include the disclaimer or ask for the email
**leaderboard** - shows ranking, score (which will be in net worth) and username. Available to public as well as players.
**agency.html** - the main part of where the magic happens. there is a button for each upgrade, an image that will call an external service and get a picture based on the players locations. There is also the stub for websocket notifications that will alert other players when someone has expanded to another location. Also includes the players current bank account
**locations.html** - the next part of where the magic happens. A canvas element is here that has been stubbed to show a world map. Later, it will be interactable and allow players to click and see where they can expand to.

## CSS Deliverable

Coming soon!