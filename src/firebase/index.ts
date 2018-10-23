import firebase from "firebase/app"

class FirebaseApp {
  constructor() {
    this.firestore = undefined
  }

  setupFirestore() {
    this.firestore = firebase.firestore()
    this.firestore.settings({ timestampsInSnapshots: true })
  }
}

export default new FirebaseApp()
