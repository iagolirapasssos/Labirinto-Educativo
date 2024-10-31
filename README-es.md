# Laberinto Educativo 🚗🧩

![Licencia](https://img.shields.io/badge/licencia-MIT-blue.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-yellow.svg)
![HTML5](https://img.shields.io/badge/HTML5-%23E34F26.svg?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-%231572B6.svg?logo=css3&logoColor=white)

[Português](./README-pt.md) | [English](./README-en.md) | [Español](./README-es.md)

El Laberinto Educativo es una aplicación web interactiva que permite a los usuarios programar un automóvil para navegar a través de un laberinto utilizando bloques de programación visual. Inspirado en plataformas como Scratch, este proyecto tiene como objetivo enseñar conceptos de lógica de programación de una manera divertida e intuitiva.

## 📝 Descripción

Con el Laberinto Educativo, los usuarios pueden arrastrar y soltar bloques de comandos para crear secuencias que dirigen el movimiento del automóvil en el laberinto. Además de los bloques de movimiento básicos, el proyecto incluye bloques condicionales, de repetición e incluso bloques de audio que permiten emitir sonidos a frecuencias específicas, similar a los comandos `Tone` y `NoTone` de Arduino.

## 🚀 Características

- **Bloques de Movimiento:** Comandos para mover el automóvil hacia adelante, hacia atrás y girar a la izquierda o derecha.
- **Bloques Condicionales:** Permite ejecutar comandos basados en condiciones específicas, como la presencia de paredes.
- **Bloques de Repetición:** Repetir secuencias de comandos múltiples veces o indefinidamente.
- **Bloques de Espejado:** Espejear movimientos horizontal o verticalmente.
- **Bloques de Audio:** Emitir sonidos a frecuencias específicas y detener los sonidos emitidos.
- **Guardar y Abrir Programas:** Guarda tus secuencias de bloques y vuelve a cargarlas posteriormente.
- **Interfaz Intuitiva:** Arrastrar y soltar blocos para crear secuencias de programación.
- **Retroalimentación Visual y de Audio:** Mensajes informativos durante la ejecución y sonidos para mejorar la interactividad.
- **Niveles de Dificultad:** Elige entre diferentes tamaños de laberintos (Fácil, Medio, Difícil).

## 📸 Demostración

![Interfaz del Laberinto](screenshots/interface.png)
*Captura de pantalla de la interfaz del Laberinto Educativo.*

*(Nota: Agrega capturas de pantalla o GIFs animados en la carpeta `screenshots` y actualiza los enlaces según sea necesario.)*

## 🛠 Tecnologías Utilizadas

- **HTML5** - Estructura de la aplicación.
- **CSS3** - Estilización y diseño responsive.
- **JavaScript (ES6+)** - Lógica de programación e interacción.
- **Web Audio API** - Emisión de sonidos a frecuencias específicas.
- **Drag and Drop API** - Funcionalidad de arrastrar y soltar bloques.
- **SVG** - Gráficos vectoriales para el automóvil.

## 🧭 Comenzando

Estas instrucciones te proporcionarán una copia del proyecto y te permitirán ejecutarlo en tu máquina local para fines de desarrollo y prueba.

### 📋 Requisitos Previos

- Un navegador web moderno (Chrome, Firefox, Edge, Safari).
- Un servidor local para servir archivos estáticos (opcional, pero recomendado para evitar problemas con módulos ES6).

### 🔧 Instalación

1. **Clona el repositorio:**

   ```bash
   git clone git@github.com:iagolirapasssos/Laberinto-Educativo.git
   ```

2. **Navega hasta el directorio del proyecto:**

   ```bash
   cd Laberinto-Educativo
   ```

3. **Abre el archivo `index.html` en tu navegador:**

   - **Opción 1:** Haz doble clic en el archivo `index.html`.
   - **Opción 2:** Utiliza un servidor local. Por ejemplo, con Python:

     ```bash
     # Para Python 3.x
     python -m http.server 8000
     ```

     Abre `http://localhost:8000` en tu navegador.

## 🖥️ Uso

1. **Seleccionar el Nivel del Laberinto:**
   - Elige entre Nivel Fácil (8x8), Nivel Medio (12x12) o Nivel Difícil (15x15) usando el selector en el panel de control.

2. **Crear el Laberinto:**
   - Haz clic en "🔄 Nuevo Laberinto" para generar un nuevo laberinto en función del nivel seleccionado.

3. **Programar el Automóvil:**
   - Arrastra los bloques disponibles de la sección "Bloques Disponibles" al área "Mi Programa".
   - Organiza los bloques en el orden deseado para definir las acciones del automóvil.
   - Utiliza bloques de repetición, condicionales y audio para crear secuencias más complejas.

4. **Ejecutar el Programa:**
   - Haz clic en "▶ Ejecutar" para iniciar la ejecución del programa.
   - Usa "⏸ Pausa" para pausar la ejecución y "⏹ Detener" para interrumpirla por completo.
   - "🗑 Limpiar" elimina todos los bloques del área "Mi Programa".
   - Usa los botones "💾 Guardar Programa" y "📂 Abrir Programa" para administrar tus secuencias de bloques.

5. **Objetivo:**
   - Navegar el automóvil a través del laberinto hasta llegar a la bandera de llegada 🏁.

## 🎨 Personalización

¡Siéntete libre de modificar y personalizar la aplicación de acuerdo a tus necesidades! Puedes agregar nuevos bloques, cambiar los estilos o expandir la funcionalidad existente.

## 🤝 Contribución

¡Las contribuciones son bienvenidas! No dudes en abrir **issues** o enviar **pull requests**.

1. **Haz un fork del repositorio**
2. **Crea una rama para tu nueva característica:**

   ```bash
   git checkout -b mi-nueva-caracteristica
   ```

3. **Realiza tus cambios y haz commit:**

   ```bash
   git commit -m "Agrega nueva característica X"
   ```

4. **Sube tus cambios a la rama:**

   ```bash
   git push origin mi-nueva-caracteristica
   ```

5. **Abre un Pull Request**

## 🛡️ Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

## 📫 Contacto

Prof. Iago Lira - [prof.iagolirapassos@gmail.com](mailto:prof.iagolirapassos@gmail.com)

Proyecto: [https://github.com/iagolirapasssos/Laberinto-Educativo](https://github.com/iagolirapasssos/Laberinto-Educativo)

## 💡 Agradecimientos

- [Scratch](https://scratch.mit.edu/) - Inspiración para la programación visual.
- [Web Audio API](https://developer.mozilla.org/es/docs/Web/API/Web_Audio_API) - Para la implementación de audio.
- [MDN Web Docs](https://developer.mozilla.org/) - Referencia para el desarrollo web.