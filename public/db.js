const { get } = require("mongoose");
const { response } = require("express");

let db;
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = (e) => {
  const db = e.target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

request.oneerror = (e) => {
  console.lot("There was an error");
};

request.onsuccess = (e) => {
  db = e.target.result;

  if (navigator.onLine) {
    checkDatabase()
  };
};

function saveRecord(record) {
  const transaction = db.transaction(["pending", "readwrite"]);
  const store = transaction.objectStore("pending");
  
  store.add(record);
}

function checkDatabase() {
  const transaction = db.transaction(["pending", "readwrite"]);
  const store = transaction.objectStore("pending");
  const getAll = store.getAll();

  getAll.onsuccess = () => {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(() => {
          const transaction = db.transaction(["pending", "readwrite"]);
          const store = transaction.objectStore("pending");
          store.clear();
        });
    }
  };
};

window.addEventListener("online", checkDatabase);