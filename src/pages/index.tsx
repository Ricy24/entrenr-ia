import { useEffect, useState } from "react";
import { db } from "@/firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

interface Reto {
  id: number;
  titulo: string;
  descripcion: string;
  estado: "pendiente" | "completado";
  categoria: "individual" | "familiar" | "pareja";
  tipo: "estres" | "ansiedad" | "comunicacion" | "autoestima";
  respuesta?: string;
  aceptaTerminos?: boolean;
  nivelDificultad: 1 | 2 | 3;
  duracion: number; // en minutos
  etiquetas: string[];
  seguimiento?: {
    nivelEstres?: number;
    nivelAnsiedad?: number;
    estadoAnimo?: number;
    efectividad?: number;
  };
  preguntas?: string[];
  razonRechazo?: "no_interesa" | "no_tiempo" | null;
}

interface RespuestasReto {
  [key: string]: string;
  nivelEstres: string;
  nivelAnsiedad: string;
  efectividad: string;
}

const retosPredefinidos: Reto[] = [
  { 
    id: 1, 
    titulo: "🧘 Análisis de Patrones de Pensamiento", 
    descripcion: "Describe una situación reciente que te causó ansiedad. ¿Qué pensamientos específicos tuviste? ¿Identificas algún patrón en tu forma de pensar?", 
    estado: "pendiente",
    categoria: "individual",
    tipo: "ansiedad",
    nivelDificultad: 2,
    duracion: 15,
    etiquetas: ["patrones", "pensamientos", "autoconciencia"],
    preguntas: [
      "¿Cómo te sentiste durante el ejercicio?",
      "¿Qué pensamientos surgieron?",
      "¿Notaste cambios en tu respiración o en tu cuerpo?",
      "¿Te resultó fácil o difícil mantener la atención?"
    ]
  },
  { 
    id: 2, 
    titulo: "💭 Registro de Desencadenantes Emocionales", 
    descripcion: "Durante el día de hoy, ¿qué situaciones provocaron cambios en tu estado de ánimo? Describe el contexto, la emoción y su intensidad del 1 al 10.", 
    estado: "pendiente",
    categoria: "individual",
    tipo: "estres",
    nivelDificultad: 2,
    duracion: 20,
    etiquetas: ["emociones", "triggers", "intensidad"]
  },
  { 
    id: 3, 
    titulo: "👥 Comunicación Efectiva", 
    descripcion: "Practica la escucha activa con tu pareja durante 15 minutos. Uno habla mientras el otro escucha sin interrumpir, luego intercambien roles.", 
    estado: "pendiente",
    categoria: "pareja",
    tipo: "comunicacion",
    nivelDificultad: 1,
    duracion: 15,
    etiquetas: ["escucha", "pareja", "comunicacion"]
  },
  { 
    id: 4, 
    titulo: "👨‍👩‍👦 Tiempo de Calidad Familiar", 
    descripcion: "Organicen una actividad familiar sin dispositivos electrónicos. Compartan sus experiencias y emociones.", 
    estado: "pendiente",
    categoria: "familiar",
    tipo: "comunicacion",
    nivelDificultad: 1,
    duracion: 30,
    etiquetas: ["familia", "calidad", "emociones"]
  },
  { 
    id: 5, 
    titulo: "🎨 Expresión Creativa", 
    descripcion: "Dibuja o escribe sobre una emoción que estés sintiendo. No te preocupes por la calidad, enfócate en expresarte.", 
    estado: "pendiente",
    categoria: "individual",
    tipo: "ansiedad",
    nivelDificultad: 1,
    duracion: 20,
    etiquetas: ["creatividad", "emociones", "expresion"]
  },
  { 
    id: 6, 
    titulo: "🌱 Rutina de Autocuidado", 
    descripcion: "Dedica 30 minutos a una actividad que te haga sentir bien. Puede ser un baño relajante, leer, o hacer ejercicio.", 
    estado: "pendiente",
    categoria: "individual",
    tipo: "estres",
    nivelDificultad: 1,
    duracion: 30,
    etiquetas: ["autocuidado", "relajacion", "bienestar"]
  },
  { 
    id: 7, 
    titulo: "💑 Proyecto en Pareja", 
    descripcion: "Planifiquen juntos una actividad especial para el fin de semana. Compartan sus expectativas y deseos.", 
    estado: "pendiente",
    categoria: "pareja",
    tipo: "comunicacion",
    nivelDificultad: 1,
    duracion: 20,
    etiquetas: ["pareja", "planificacion", "comunicacion"]
  },
  { 
    id: 8, 
    titulo: "🏡 Roles Familiares", 
    descripcion: "Tengan una reunión familiar para distribuir responsabilidades. Asegúrense de que todos se sientan escuchados.", 
    estado: "pendiente",
    categoria: "familiar",
    tipo: "comunicacion",
    nivelDificultad: 1,
    duracion: 30,
    etiquetas: ["familia", "responsabilidades", "comunicacion"]
  },
  { 
    id: 9, 
    titulo: "🎭 Gestión de Emociones", 
    descripcion: "Identifica una emoción intensa que hayas sentido hoy. ¿Qué la provocó? ¿Cómo la manejaste?", 
    estado: "pendiente",
    categoria: "individual",
    tipo: "ansiedad",
    nivelDificultad: 2,
    duracion: 15,
    etiquetas: ["emociones", "gestion", "intensidad"]
  },
  { 
    id: 10, 
    titulo: "💕 Reconexión en Pareja", 
    descripcion: "Comparte con tu pareja un momento significativo de su relación. ¿Qué emociones te genera ese recuerdo?", 
    estado: "pendiente",
    categoria: "pareja",
    tipo: "comunicacion",
    nivelDificultad: 1,
    duracion: 20,
    etiquetas: ["pareja", "reconexion", "emociones"]
  },
  { 
    id: 11, 
    titulo: "🌟 Afirmaciones Positivas", 
    descripcion: "Escribe tres afirmaciones positivas sobre ti mismo/a. ¿Por qué son verdaderas?", 
    estado: "pendiente",
    categoria: "individual",
    tipo: "autoestima",
    nivelDificultad: 1,
    duracion: 10,
    etiquetas: ["afirmaciones", "positivas", "autoestima"]
  },
  { 
    id: 12, 
    titulo: "👨‍👩‍👧‍👦 Narrativa Familiar", 
    descripcion: "Comparte una historia familiar significativa. ¿Qué valores o lecciones transmite?", 
    estado: "pendiente",
    categoria: "familiar",
    tipo: "comunicacion",
    nivelDificultad: 1,
    duracion: 20,
    etiquetas: ["familia", "narrativa", "valores"]
  },
  { 
    id: 13, 
    titulo: "🌈 Visualización Guiada",
    descripcion: "Cierra los ojos y visualiza un lugar seguro y tranquilo. Describe los detalles: colores, sonidos, sensaciones.",
    estado: "pendiente",
    categoria: "individual",
    tipo: "ansiedad",
    nivelDificultad: 1,
    duracion: 15,
    etiquetas: ["relajacion", "visualizacion", "mindfulness"]
  },
  // ... Add 19 more exercises here ...
];

export default function Home() {
  const [retos, setRetos] = useState<Reto[]>(retosPredefinidos);
  const [respuesta, setRespuesta] = useState<string>("");
  const [aceptaTerminos, setAceptaTerminos] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [razonRechazo, setRazonRechazo] = useState<"no_interesa" | "no_tiempo" | null>(null);
  const [respuestasMultiples, setRespuestasMultiples] = useState<{ [key: number]: RespuestasReto }>({});
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todos");
  const [nivelEstres, setNivelEstres] = useState<number>(5);
  const [nivelAnsiedad, setNivelAnsiedad] = useState<number>(5);

  const retosFiltrados = retos.filter(reto => {
    if (filtroCategoria === "todos") return true;
    return reto.categoria === filtroCategoria;
  });

  const handleRespuestaChange = (retoId: number, preguntaIndex: number, valor: string) => {
    setRespuestasMultiples(prev => ({
      ...prev,
      [retoId]: {
        ...(prev[retoId] || {}),
        [`pregunta_${preguntaIndex}`]: valor
      }
    }));
  };

  const completarReto = async (retoId: number) => {
    if (!aceptaTerminos) {
      setError("Debes aceptar los términos y condiciones para continuar");
      return;
    }

    const retoCompletado = retos.find(reto => reto.id === retoId);
    const respuestasReto = respuestasMultiples[retoId] || {};
    
    if (!retoCompletado || Object.keys(respuestasReto).length === 0) {
      setError("Por favor completa al menos una respuesta");
      return;
    }

    await addDoc(collection(db, "retos_completados"), {
      ...retoCompletado,
      respuestas: respuestasReto,
      fecha: new Date().toISOString(),
      hora: new Date().getHours(),
      diaSemana: new Date().getDay(),
    });

    setRetos(retos.map(reto =>
      reto.id === retoId ? { ...reto, estado: "completado" } : reto
    ));
    
    // Limpiar respuestas del reto completado
    setRespuestasMultiples(prev => {
      const newState = { ...prev };
      delete newState[retoId];
      return newState;
    });
  };

  const rechazarReto = async (retoId: number, razon: "no_interesa" | "no_tiempo") => {
    const reto = retos.find(r => r.id === retoId);
    if (!reto) return;

    await addDoc(collection(db, "retos_rechazados"), {
      retoId,
      titulo: reto.titulo,
      categoria: reto.categoria,
      tipo: reto.tipo,
      razon,
      fecha: new Date().toISOString()
    });

    setRetos(retos.map(r =>
      r.id === retoId ? { ...r, estado: "completado", razonRechazo: razon } : r
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Senti
              </span>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <span className="text-gray-500">Plataforma de IA Terapéutica</span>
                <div className="h-4 w-px bg-gray-300"></div>
                <span className="text-indigo-600 font-medium">Fase de Entrenamiento</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar con información */}
          <div className="lg:col-span-3">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Sobre el Proyecto</h2>
                <div className="space-y-4 text-sm text-gray-600">
                  <p>
                    Estamos desarrollando una aplicación de psicología potenciada por IA para ofrecer
                    terapia personalizada y adaptativa.
                  </p>
                  <div className="border-l-4 border-indigo-500 pl-4 py-2 bg-indigo-50 rounded-r-lg">
                    <p className="font-medium text-indigo-900">¿Cómo participar?</p>
                    <ul className="text-indigo-700 text-xs mt-2 space-y-1">
                      <li>• Explora los ejercicios disponibles</li>
                      <li>• Elige los que más te interesen</li>
                      <li>• Completa solo los que puedas hacer a conciencia</li>
                      <li>• No es necesario hacer todos</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <p className="text-yellow-800 text-xs">
                      💡 Recuerda: La calidad de tus respuestas es más importante que la cantidad.
                      Tómate tu tiempo con cada ejercicio.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>Datos 100% anónimos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Procesamiento seguro</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span>IA en entrenamiento</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-lg font-semibold mb-4">Términos Legales</h2>
                <div className="text-sm text-gray-600 space-y-3">
                  <p>
                    Al completar ejercicios, aceptas que tus respuestas sean utilizadas para:
                  </p>
                  <ul className="list-disc pl-4 space-y-2">
                    <li>Entrenar nuestro modelo de IA</li>
                    <li>Mejorar las recomendaciones</li>
                    <li>Análisis anónimo de patrones</li>
                  </ul>
                  <p className="text-xs">
                    Consulta nuestra{" "}
                    <a href="#" className="text-indigo-600 hover:underline">política de privacidad</a>
                    {" "}para más detalles.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-9">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                Senti IA - Ejercicios Terapéuticos
              </h1>
              <div className="space-y-4">
                <div className="bg-blue-50 p-6 rounded-xl space-y-3">
                  <p className="text-blue-800 font-medium">
                    👋 ¡Bienvenido a la plataforma de ejercicios terapéuticos de Senti!
                  </p>
                  <p className="text-blue-700 text-sm">
                    Explora los ejercicios y completa aquellos que más te resuenen. 
                    Tu participación consciente nos ayuda a entrenar nuestra IA.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 text-xs bg-blue-100/50 p-2 rounded-lg">
                    <span className="bg-white/50 px-2 py-1 rounded">{'🎯 Elige los que te interesen'}</span>
                    <span className="bg-white/50 px-2 py-1 rounded">{'⏱️ Sin presión de tiempo'}</span>
                    <span className="bg-white/50 px-2 py-1 rounded">{'✨ Calidad es mejor que cantidad'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Filtrar por categoría:</p>
              <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
                {["todos", "individual", "pareja", "familiar"].map((categoria) => (
                  <button
                    key={categoria}
                    onClick={() => setFiltroCategoria(categoria)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      filtroCategoria === categoria
                        ? "bg-indigo-100 text-indigo-700 ring-2 ring-indigo-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <ul className="space-y-4">
              {retosFiltrados.map((reto) => (
                <li 
                  key={reto.id} 
                  className="transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className={`p-4 rounded-xl border-2 ${
                    reto.estado === "pendiente" 
                      ? "bg-white border-indigo-100 animate-border-pulse" 
                      : "bg-green-50 border-green-200"
                  }`}>
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold mb-3">{reto.titulo}</h3>
                      <p className="text-gray-600 text-lg mb-4">{reto.descripcion}</p>
                      <div className="flex gap-3 mb-4">
                        <span className="text-sm font-semibold px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 ring-2 ring-blue-100">
                          {reto.categoria}
                        </span>
                        <span className="text-sm font-semibold px-3 py-1.5 rounded-full bg-purple-100 text-purple-800 ring-2 ring-purple-100">
                          {reto.tipo}
                        </span>
                      </div>
                    </div>

                    {reto.estado === "pendiente" && (
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                          {reto.preguntas?.map((pregunta, index) => (
                            <div key={index} className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">{pregunta}</label>
                              <textarea
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                                rows={3}
                                placeholder="Tu respuesta..."
                                value={respuestasMultiples[reto.id]?.[`pregunta_${index}`] || ""}
                                onChange={(e) => handleRespuestaChange(reto.id, index, e.target.value)}
                              />
                            </div>
                          ))}
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-sm text-gray-600">Nivel de estrés (1-10)</label>
                              <input
                                type="number"
                                min="1"
                                max="10"
                                className="w-full p-2 border rounded"
                                value={respuestasMultiples[reto.id]?.nivelEstres || ""}
                                onChange={(e) => handleRespuestaChange(reto.id, 'nivelEstres', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="text-sm text-gray-600">Nivel de ansiedad (1-10)</label>
                              <input
                                type="number"
                                min="1"
                                max="10"
                                className="w-full p-2 border rounded"
                                value={respuestasMultiples[reto.id]?.nivelAnsiedad || ""}
                                onChange={(e) => handleRespuestaChange(reto.id, 'nivelAnsiedad', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                          <p className="font-medium text-gray-700 text-sm">¿Cómo te sientes?</p>
                          
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Nivel de estrés</span>
                                <span>{nivelEstres}/10</span>
                              </div>
                              <input
                                type="range"
                                min="1"
                                max="10"
                                value={nivelEstres}
                                onChange={(e) => setNivelEstres(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                              />
                            </div>

                            <div>
                              <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Nivel de ansiedad</span>
                                <span>{nivelAnsiedad}/10</span>
                              </div>
                              <input
                                type="range"
                                min="1"
                                max="10"
                                value={nivelAnsiedad}
                                onChange={(e) => setNivelAnsiedad(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => completarReto(reto.id)}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all"
                          >
                            ✨ Completar ejercicio
                          </button>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => rechazarReto(reto.id, "no_interesa")}
                              className="flex-1 px-4 py-2 text-sm text-gray-600 border rounded-lg hover:bg-gray-50"
                            >
                              No me interesa
                            </button>
                            <button
                              onClick={() => rechazarReto(reto.id, "no_tiempo")}
                              className="flex-1 px-4 py-2 text-sm text-gray-600 border rounded-lg hover:bg-gray-50"
                            >
                              No tengo tiempo
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {reto.estado === "completado" && (
                      <div className="mt-4">
                        {reto.razonRechazo ? (
                          <div className="flex items-center gap-2 text-gray-600 mb-3">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <span>
                              {reto.razonRechazo === "no_interesa" ? "No te interesó este reto" : "No tuviste tiempo para este reto"}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-green-600 font-semibold mb-3">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>¡Ejercicio completado!</span>
                          </div>
                        )}
                        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                          <p className="text-gray-700 text-lg">{reto.respuesta}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-start gap-2 mb-4">
                <input
                  type="checkbox"
                  id="terminos"
                  checked={aceptaTerminos}
                  onChange={(e) => {
                    setAceptaTerminos(e.target.checked);
                    setError("");
                  }}
                  className="mt-1"
                />
                <label htmlFor="terminos" className="text-sm text-gray-600">
                  Acepto que mis respuestas sean utilizadas para entrenar el modelo de IA de Senti.
                  Los datos serán procesados de acuerdo con la{" "}
                  <a href="#" className="text-indigo-600 hover:underline">política de privacidad</a> y los{" "}
                  <a href="#" className="text-indigo-600 hover:underline">términos de servicio</a>.
                </label>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            <footer className="mt-8 text-center text-sm text-gray-500">
              <p>© 2024 Senti - Plataforma de IA Terapéutica</p>
              <p className="mt-1">
                Desarrollado con tecnología de procesamiento de lenguaje natural y aprendizaje automático.
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
