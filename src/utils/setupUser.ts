import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

interface Reto {
  title: string;
  description: string;
  userId: string;
}

const retosBase: Omit<Reto, "userId">[] = [
  { title: "Reto 1", description: "Realiza una actividad relajante hoy." },
  { title: "Reto 2", description: "Escribe 3 cosas por las que estás agradecido." },
  { title: "Reto 3", description: "Haz 5 minutos de meditación." },
  { title: "Reto 4", description: "Envía un mensaje positivo a un amigo." },
  { title: "Reto 5", description: "Sal a caminar 10 minutos." },
  { title: "Reto 6", description: "Toma un vaso de agua y respira profundo." },
  { title: "Reto 7", description: "Escucha música relajante por 10 minutos." },
  { title: "Reto 8", description: "Escribe una meta para esta semana." },
  { title: "Reto 9", description: "Haz una pausa de 5 minutos sin pantallas." },
  { title: "Reto 10", description: "Prueba una nueva técnica de respiración." },
  { title: "Reto 11", description: "Dibuja algo, aunque sea simple." },
  { title: "Reto 12", description: "Haz estiramientos por 5 minutos." },
  { title: "Reto 13", description: "Lee algo motivador por 5 minutos." },
  { title: "Reto 14", description: "Haz una lista de 3 cosas que quieres mejorar." },
];

export const setupUserRetos = async (userId: string): Promise<void> => {
  const retosRef = collection(db, "retos");
  const userRetosQuery = query(retosRef, where("userId", "==", userId));
  const existingRetos = await getDocs(userRetosQuery);

  if (existingRetos.empty) {
    for (const reto of retosBase) {
      await addDoc(retosRef, { ...reto, userId });
    }
    console.log("Retos base asignados.");
  } else {
    console.log("El usuario ya tiene retos asignados.");
  }
};
