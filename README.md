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

Prerequisite: Simon CSS deployed to your production environment

Prerequisite: A link to your GitHub startup repository prominently displayed on your application's home page

Prerequisite: Notes in your startup Git repository README.md file

30% Header, footer, and main content body. Yeah I used flex. 💪

20% Navigation elements. Cursor changes on hover, they are in the header

10% Responsive to window resizing. Looks good on desktop, acceptable on smaller sizes.

20% Application elements. Buttons tables and fields custom styled by yours truly, canvas element still displays an image using basic javascript

10% Application text content. Title, navigation and some gameplay elements use downloaded fonts. Everything else is in a sans-serif

10% Application images. Gameplay displays some in the background, next to the buttons, and canvas element from above.

### CSS additions by html page:

**index.html** - uses home.css. Started creation of "branding" by choosing a logo font and making the link buttons resemble dollars. Created a header and footer, althought the header on this page is bigger than all other pages. The footer is consistant throughout the pages. Navigation elements dynamically size. The web page has a flex main body that wraps the news and welcome sections.

**register and login** - use the same css sheet called session.css. This also has the header and footer, however the header has been minimized to be less distracting. The main body is centered, with stacked fields. Login has a register link next to the login button. Register has a disclaimer stacked above the submit button.

**leaderboard** -  uses leaderboard.css. Implements the minimized header and footer. Simple styling of the page title and the table that stores data. Each user would need to be stored as a row and then sorted based on score.

**agency.html** - uses gameplay.css. Implements the minimized header and footer. The agency name that the user will pick and the location are mentioned in a green subheader. The background image is anticpated to come from a external call to display the location of the agency. For desktops, the websocket messages are in a space reserved on the side. As the window shrinks, flex wraps the content to the bottom. In a further implentation of javascript, I will attempt to put this in a sidebar with push notifications. The player's score is displayed just below the subheader, using stylized font. The main clicker button, "Book Tours" will display either to the side of it or wrap just below, depending on the space. Each facet of the agency has an icon and a button. Multiple buttons may be added in the future to add multiple facets (i.e. hotels, attractions) to the user's agency in a country, in which sense more icons may be added to represent this. Icon's will change as well the user upgrades them. These icon's wrap with the buttons. You'll notice past a certain size, the gameplay is no longer centered. This was a conflict between bigger windows and small windows, as I wanted big windows to have the game play left aligned in it's flex box, but centered when smaller. I anticipate fixing this issue in the javascript phase of this project.

**locations.html** - uses gameplay.css. Implements the minimized header and footer. The same background image idea is implemented here. Here the user will travel from various agencies, as well as upgrade to other locations. The canvas element will be a map with pins of locations where the user can expand, and they will select one of these pins to either travel or upgrade using the message under the side. 

## Javascript deliverable

20% JavaScript support for future login. Auth token and username are saved as cookies, and the expiration date is saved in the local storage.

20% JavaScript support for future database data. Player data is custom serialized and will be saved in the database.

20% JavaScript support for future WebSocket. Messages will appear where notifications for new locations and not enough money are appearing. They will announce when other players have expanded or made significant purchases.

40% JavaScript support for your application's interaction logic. Website functions as a small clicker game.

### JavaScript additions by javascript file:

**menu.js** - used by index.html and leaderboard.html. Changes the menu if in postlogin. Exports the logout function.

**session.js** - used by login.html and register.html. Currently creates the authentication cookies and sets the time it expires in local storage. Later will make API calls to the server to handle this.

**leaderboard.js** - used by leaderboard.html. Deletes dummy data and adds the user to the leaderboard.

**csv.js** - constant strings of csv that controls a lot of the gameplay. 3 locations were included in the deployment. This will later be moved to server-side

The document was created first as a google sheet. Request permission to view this document: https://docs.google.com/spreadsheets/d/1l7_V36-MijxOzC2QLCyAr1BkeHqVX8THYX7Sc7Z9DM4/edit?usp=sharing

**agency.js** - used by agency.html and locations.html. Creates classes for agency, upgrade, travel, attraction, hospitality and location. 

**tycoon.js** - used by agency.html and locations.html. Class that keeps track of money and agency objects.

**gameplay.js**- used by agency.html and locations.html This has the bulk of the playing logic. Renders the page, reads the csv, adds buttons and logic for the available upgrades.

**locations.js** - used by locations.html. Rather than implementing a canvas element, I used a library called "Leaflet to create a map with pins for possible places to upgrade to.