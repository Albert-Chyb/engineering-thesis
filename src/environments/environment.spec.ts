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
    host: 'http://127.0.0.1',
    auth: {
      port: 9100,
    },
    functions: {
      port: 5005,
    },
    firestore: {
      port: 8081,
    },
    database: {
      port: 9001,
    },
    hosting: {
      port: 5003,
    },
    pubsub: {
      port: 8086,
    },
    storage: {
      port: 9198,
    },
    eventarc: {
      port: 9298,
    },
  },
};
