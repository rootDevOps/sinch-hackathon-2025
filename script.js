// === FUNCIONES AUXILIARES ===
const getPrediction = async (dateStr, timeStr) => {
  try {
    const response = await fetch(chrome.runtime.getURL("prob_table.json"));
    const table = await response.json();

    const date = new Date(`${dateStr}T${timeStr}`);
    const dayOfWeek = date.getDay(); // 0 = Sunday
    const hour = date.getHours();

    const prob = table[dayOfWeek]?.[hour];
    return (prob !== undefined) ? prob : "N/A";
  } catch (error) {
    console.error("❌ Error loading prob_table.json:", error);
    return "N/A";
  }
};

// === ENVÍO DEL FORMULARIO ===
document.getElementById('formulario').addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const values = Object.fromEntries(formData.entries());

  const apiKey = document.getElementById('apiKey').value.trim();
  if (!apiKey) {
    alert("Por favor, ingresa tu API Key de Gemini.");
    return;
  }

  const prob = await getPrediction(values.date, values.time);

  // Mostrar probabilidad antes de enviar
  const infoProb = document.createElement("p");
  infoProb.textContent = `📈 ${typeof prob === 'number' ? (prob * 100).toFixed(2) + "%" : prob}`;
  document.getElementById('mensaje').innerHTML = '';
  document.getElementById('mensaje').appendChild(infoProb);

  const prompt = `
    Hola, quiero realizar un análisis basado en datos reales.   
    Contexto: 
    - Proyecto o situación: Análisis de lectura de mensajes enviados. 
    - País:  ${values.country}
    - Ciudad: ${values.city}  
    - Fecha(s) de interés: ${values.date} 
    - Hora de interés: ${values.time}
    - Predicción con RandomForestClassifier: ${typeof prob === 'number' ? (prob * 100).toFixed(2) + "%" : prob}

    Requisitos del análisis:
    - Consulta fuentes actualizadas en internet y considera únicamente los eventos confirmados y relevantes que puedan afectar la lectura inmediata (cortes de energía, protestas, festividades, horarios laborales/escolares, traslados, eventos deportivos/culturales, horas de sueño, horas de antro, dias de descanso, horas que van al parque, hora donde hacen ejecicio, etc).
    - No menciones eventos si no se encuentran registrados o verificados.
    - Ajusta la probabilidad base hacia arriba o hacia abajo según los eventos detectados.
    - Devuelve solo una línea de salida, en el idioma oficial del país, con el siguiente formato:
    - Probabilidad de lectura esperada: XX.XX% (Ajuste [al alza / a la baja] debido a [motivo claro y entendible por el cliente, como "es hora habitual de comida", "hay tráfico elevado en la zona", "hay partido de fútbol en curso", "es un día festivo no laboral", etc.]).
    - Condiciones adicionales:
    - No repitas los datos de entrada.
    - No incluyas descripciones genéricas como “condiciones que pueden dificultar la atención”.
    - No supongas motivos, solo usa los que encuentres en fuentes oficiales.
    - Usa redacción clara y orientada al negocio.
    - Importante: Traduce el resultado de acuerdo al país responde de acuerdo a su idioma oficial, si es México en español, si es en Inglaterra en Ingles, así con todos los países
    - Valida que todo eñ resultado este traducido deacuerdo al idioma
  `;

  const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  try {
    const response = await fetch(`${endpoint}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    const data = await response.json();
    let output = '⚠️ No response from Gemini.';
    if (data.candidates && data.candidates.length > 0) {
      const parts = data.candidates[0].content?.parts;
      output = (parts && parts.length > 0) ? parts[0].text : '[⚠️ Gemini responded without content]';
    } else if (data.error) {
      output = `[❌ Gemini Error] ${data.error.message || JSON.stringify(data.error)}`;
    }

    const respuesta = document.createElement("p");
    respuesta.textContent = output;
    document.getElementById('mensaje').appendChild(respuesta);
    document.getElementById('reiniciar').style.display = 'block';
    document.getElementById('formulario').style.display = 'none';

  } catch (error) {
    console.error("❌ Error calling Gemini:", error);
    document.getElementById('mensaje').textContent = '❌ Network or Gemini connection error.';
  }
});

document.getElementById('reiniciar').addEventListener('click', () => {
  document.getElementById('formulario').reset();
  document.getElementById('formulario').style.display = 'block';
  document.getElementById('mensaje').textContent = '';
  document.getElementById('reiniciar').style.display = 'none';
});

const countrySelect = document.getElementById("country");
const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola",
  "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus",
  "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
  "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
  "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada",
  "Cape Verde", "Central African Republic", "Chad", "Chile", "China",
  "Colombia", "Comoros", "Costa Rica", "Croatia", "Cuba",
  "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica",
  "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea",
  "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji",
  "Finland", "France", "Gabon", "Gambia", "Georgia",
  "Germany", "Ghana", "Greece", "Grenada", "Guatemala",
  "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras",
  "Hungary", "Iceland", "India", "Indonesia", "Iran",
  "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast",
  "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya",
  "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia",
  "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein",
  "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia",
  "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania",
  "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco",
  "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand",
  "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia",
  "Norway", "Oman", "Pakistan", "Palau", "Palestine",
  "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines",
  "Poland", "Portugal", "Qatar", "Republic of the Congo", "Romania",
  "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
  "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal",
  "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia",
  "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea",
  "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname",
  "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan",
  "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga",
  "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
  "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela",
  "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

countries.forEach(function (country) {
  const option = document.createElement("option");
  option.value = country;
  option.textContent = country;
  countrySelect.appendChild(option);
});
