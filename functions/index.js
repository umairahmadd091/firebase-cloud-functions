const functions = require("firebase-functions");
// const admin = require("firebase-admin");
// admin.initializeApp({
//   credential: admin.credential.cert(require("./accountCredentials.json")),
// });

const { initializeApp, cert } = require("firebase-admin/app");

const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("./accountCredentials.json");

initializeApp({
  credential: cert(serviceAccount),
});
// const cors = require("cors")({ origin: true });
const db = getFirestore();

exports.students = functions.https.onRequest((request, response) => {
  if (request.method === "POST") {
    const { name, age } = request.body;

    db.collection("users")
      .doc()
      .set({ name, age })
      .then(() => {
        response.status(200).send("Student Created!");
      })
      .catch((e) => response.send(e));
  } else if (request.method === "PUT") {
    const { name, age } = request.body;
    const { id } = request.query;

    db.collection("users")
      .doc(id)
      .update({ name, age })
      .then(() => {
        response.status(200).send("Student Updated Successfully!");
      })
      .catch((e) => response.send(e));
  } else if (request.method === "DELETE") {
    const { id } = request.query;

    db.collection("users")
      .doc(id)
      .delete()
      .then(() => {
        response.status(200).send("Student Deleted Successfully!");
      })
      .catch((e) => response.send(e));
  } else if (request.method === "GET") {
    const { id } = request.query;

    if (id) {
      db.collection("users")
        .doc(id)
        .get()
        .then((data) => {
          response.send(data.data());
        })
        .catch((e) => response.send(e));
    } else {
      const students = [];
      db.collection("users")
        .get()
        .then((snapshot) => {
          snapshot.docs.forEach((doc) => {
            const items = doc.data();
            students.push(items);
          });
          response.send({ students });
        })
        .catch((e) => response.send(e));
    }
  } else {
    response.status(404).send({ error: "Not Found" });
  }
});
