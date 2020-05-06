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
    autoIncrement: true,
  });
};
// TODO: log any indexedDB errors
request.onerror = (err) => {
  console.log(err);
};

request.onsuccess = (event) => {
  db = event.target.result;

  if (navigator.onLine) {
    checkDB();
  }
};

// sends stored transactions to server
// called when online
function checkDB() {
  const transaction = db.transaction("pending", "readonly");
  const store = transaction.objectStore("pending");
  const getAll = store.getAll();

  getAll.onsuccess = () => {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          response.json();
        })
        .then(() => {
          const transaction = db.transaction("pending", "readwrite");
          const store = transaction.objectStore("pending");
          store.clear();
        });
    }
  };
}

//This function is called in index.js when the user creates a transaction while offline.
function saveRecord(record) {
  const transaction = db.transaction("pending", "readwrite");
  const store = transaction.objectStore("pending");
  store.add(record);
}

// listen for connection to online
window.addEventListener("online", checkDatabase);
