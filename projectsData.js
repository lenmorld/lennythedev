// TODO: this should come from Github, Devpost, or a Headless CMS

const projects = [
  {
    id: 'shoppy',
    name: 'Shoppy',
    liveLink: 'https://theshop.vercel.app',
    githubLink: 'https://github.com/lenmorld/theshop',
    imageLink:
      'https://res.cloudinary.com/dvfhgkkpe/image/upload/v1623326136/lennythedev/shoppy2.png',
    description: `E-commerce site built with Next.js and GraphCMS`,
    tags: ['react', 'node', 'serverless', 'netlify'],
  },
  {
    id: 'ofish_mongodb',
    name: 'O-FISH MongoDB - OSS contributor',
    githubLink: 'https://github.com/WildAid/o-fish-web',
    description: `Contributions to-date includes setting up test environment (Jest + React Test Library) with 
      test documentation, writing first UI unit tests for login, fixing search UI issues, one of which included
      a change in the MongoDB Realm serverless search function, and some refactoring. *O-FISH (Officer Fishery Information Sharing Hub), powered by MongoDB, is a multi-platform app for tracking 
      marine boarding records and violations, to help protect vulnerable marine environments.*`,
    imageLink:
      'https://res.cloudinary.com/dvfhgkkpe/image/upload/v1608038051/lennythedev/ofish_login.png',
    tags: ['react', 'jest', 'react-test-library', 'open-source', 'mongodb'],
  },
  {
    id: 'react_workshop',
    name: 'React Workshops at SCS Concordia',
    liveLink: 'https://lennythedev.com/react_and_node_workshops',
    // githubLink: 'https://github.com/lenmorld/react_workshop',
    imageLink:
      'https://res.cloudinary.com/dvfhgkkpe/image/upload/v1606080112/react_node_workshop/react_workshop_2020.jpg',
    description: `Collection of beginner to advanced workshop learning materials: self-paced lessons, articles, 
      practical code examples, and project-based exercises. Topics include JSX, ES6, components, state management, 
      hooks - state and effects, event handling, fetching data from public APIs, and building a project.
      `,
    tags: ['react', 'workshop'],
  },
  {
    id: 'node_workshop',
    name: 'Node Workshops at SCS Concordia',
    liveLink: 'https://lennythedev.com/react_and_node_workshops',
    githubLink: 'https://github.com/lenmorld/node_workshop',
    imageLink:
      'https://res.cloudinary.com/dvfhgkkpe/image/upload/v1606080122/react_node_workshop/node_workshop_2_august.jpg',
    description: `Collection of beginner to advanced workshop learning materials: self-paced lessons, articles, 
      practical code examples, and project-based exercises. Topics include Node server basics, Express routing, 
      building a REST API, connecting to MongoDB, server-rendered pages, session-based and token-based authentication, 
      and integrating with public APIs.
      `,
    tags: ['node', 'workshop'],
  },
  {
    id: 'lennythedev',
    name: 'Lennythedev site',
    liveLink: '/',
    githubLink: 'https://github.com/lenmorld/lennythedev',
    imageLink:
      'https://res.cloudinary.com/dvfhgkkpe/image/upload/v1606081216/lennythedev_f1s5j3.png',
    description: `My portfolio site and blog made with ♥️`,
    tags: ['gatsby', 'react', 'graphql', 'netlify'],
  },
  {
    id: 'poutinify',
    name: 'Poutinify',
    liveLink: 'https://poutinify.netlify.app/',
    githubLink: 'https://github.com/lenmorld/poutinify',
    imageLink:
      'https://res.cloudinary.com/dvfhgkkpe/image/upload/v1606081485/lennythedev/poutinify.png',
    description: `Poutine, eh? This app shows the current top poutine places in Montreal on Yelp, with a Leaflet map 
      and some Yelp data for each restaurant: average reviews, top review, photo and top review. 
      Served by a Netlify lambda function that sends query to Yelp on page load, with some localStorage caching.
      `,
    tags: ['react', 'node', 'serverless', 'netlify'],
  },
  {
    id: 'songhub',
    name: 'Songhub',
    liveLink: 'https://songhubapp.herokuapp.com/',
    githubLink: 'https://github.com/lenmorld/song-hub',
    imageLink:
      'https://res.cloudinary.com/dvfhgkkpe/image/upload/v1607815207/lennythedev/songhub_home.png',
    description: `Half-mini Spotify clone, half-song CRUD app. 
      Login with Spotify for user profile access,  
      Spotify playlists and full songs playback. 
      Node web server and REST API, MongoDB Atlas cloud database. Deployed in a Heroku dyno.`,
    tags: ['react', 'node', 'moongodb', 'spotify api', 'heroku', 'netlify'],
  },
  {
    id: 'recipe_app',
    name: 'Recipe App',
    liveLink: 'https://recipify.surge.sh/',
    githubLink: 'https://github.com/lenmorld/recipify',
    imageLink:
      'https://res.cloudinary.com/dvfhgkkpe/image/upload/v1606082663/lennythedev/recipify.png',
    description: `Recipe app that allows searching of new recipes (using TheMealDB API) and saving of favorites to localStorage`,
    tags: ['react', 'css'],
  },
  {
    id: 'food_ar',
    name: 'Food AR',
    // liveLink: 'https://recipify.surge.sh/',
    githubLink: 'https://github.com/lenmorld/FoodAR',
    imageLink:
      'https://raw.githubusercontent.com/lenmorld/FoodAR/master/UX_design.PNG',
    description: `Completed as Final Project in university HCI course. 
    Mobile web app for food Augmented Reality (AR). 
    The app’s objective is to increase awareness of users on the foods they eat, 
    by utilizing AR to digitally present nutritional information. 
    The app allows user to capture food items through mobile device camera, 
    then augments the food item with digital information.`,
    tags: ['javascript', 'Augmented Reality', 'node', 'Heroku'],
  },
]

export default projects
