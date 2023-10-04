export const environment = {
  production: false,
  firebase: {
    projectId: 'demo-engineering-thesis-fc3ca',
    appId: '1:930613417880:web:27122ae372598e13393ded',
    storageBucket: 'engineering-thesis-fc3ca.appspot.com',
    locationId: 'europe-central2',
    apiKey: 'AIzaSyCVtEN8UBHdyihCjqUu2gzYe_lrLju_G1g',
    authDomain: 'engineering-thesis-fc3ca.firebaseapp.com',
    messagingSenderId: '930613417880',
  },
  useFirebaseEmulators: true,
  firebaseEmulatorsConfig: {
    host: '127.0.0.1',
    auth: {
      port: 9099,
    },
    functions: {
      port: 5001,
    },
    firestore: {
      port: 8080,
    },
    database: {
      port: 9000,
    },
    hosting: {
      port: 5002,
    },
    pubsub: {
      port: 8085,
    },
    storage: {
      port: 9199,
    },
    eventarc: {
      port: 9299,
    },
  },
};
