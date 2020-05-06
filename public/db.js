
// TODO: open  indexedDB
const indexedDB =
window.indexedDB ||
window.mozIndexedDB ||
window.webkitIndexedDB ||
window.msIndexedDB ||
window.shimIndexedDB;


const request = indexedDB.open("budget", 1);

let db;
// TODO: create an object store in the open db
// Create schema
request.onupgradeneeded = (event) => {
  db = event.target.result;
  db.createObjectStore("pending", {
    keyPath: "id",
    autoIncrement: true
  });
};
// TODO: log any indexedDB errors
request.onerror = (err) => {
  console.log(err);
};

request.onsuccess = (event) => {
  db = event.target.result

  if(navigator.onLine) {
    checkDB();
  }
}


// TODO: add code so that any transactions stored in the db
// are sent to the backend if/when the user goes online
// Hint: learn about "navigator.onLine" and the "online" window event.

//This function is called in index.js when the user creates a transaction while offline.
function saveRecord(record) {
  const transaction = db.transaction("pending", "readwrite");
  const store = transaction.objectStore("pending")
  store.add(record);
 
}
