import { db } from "./firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const addTestChallenge = async () => {
  try {
    const docRef = await addDoc(collection(db, "retos"), {
      title: "Primer Reto",
      description: "Realiza una actividad sencilla relacionada con tu tipo de terapia hoy.",
      createdAt: new Date()
    });
    console.log("Reto guardado con ID: ", docRef.id);
  } catch (error) {
    console.error("Error al guardar reto:", error);
  }
};

addTestChallenge();
