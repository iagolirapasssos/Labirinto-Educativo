# Educational Maze 🚗🧩

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-yellow.svg)
![HTML5](https://img.shields.io/badge/HTML5-%23E34F26.svg?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-%231572B6.svg?logo=css3&logoColor=white)

[Português](./README-pt.md) | [English](./README-en.md) | [Español](./README-es.md)

Educational Maze is an interactive web application that allows users to program a car to navigate through a maze using visual programming blocks. Inspired by platforms like Scratch, this project aims to teach programming logic concepts in a fun and intuitive way.

## 📝 Description

With the Educational Maze, users can drag and drop command blocks to create sequences that direct the car's movement in the maze. In addition to the basic movement blocks, the project includes conditional blocks, loops, and even audio blocks that allow you to emit sounds at specific frequencies, similar to the `Tone` and `NoTone` commands in Arduino.

## 🚀 Features

- **Movement Blocks:** Commands to move the car forward, backward, and turn left or right.
- **Conditional Blocks:** Allows executing commands based on specific conditions, such as the presence of walls.
- **Repeat Blocks:** Repeat sequences of commands multiple times or indefinitely.
- **Mirroring Blocks:** Horizontally or vertically mirror movements.
- **Audio Blocks:** Emit sounds at specific frequencies and stop the emitted sounds.
- **Save and Open Programs:** Save your block sequences and reload them later.
- **Intuitive Interface:** Drag and drop blocks to create programming sequences.
- **Visual and Audio Feedback:** Informative messages during execution and sounds to enhance interactivity.
- **Difficulty Levels:** Choose between different maze sizes (Easy, Medium, Hard).

## 📸 Demonstration

![Maze Interface](screenshots/interface.png)
*Screenshot of the Educational Maze interface.*

*(Note: Add screenshots or animated GIFs in the `screenshots` folder and update the links accordingly.)*

## 🛠 Technologies Used

- **HTML5** - Application structure.
- **CSS3** - Styling and responsive layout.
- **JavaScript (ES6+)** - Programming logic and interaction.
- **Web Audio API** - Emitting sounds at specific frequencies.
- **Drag and Drop API** - Functionality for dragging and dropping blocks.
- **SVG** - Vector graphics for the car.

## 🧭 Getting Started

These instructions will provide you with a copy of the project and allow you to run it on your local machine for development and testing purposes.

### 📋 Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari).
- A local server to serve static files (optional, but recommended to avoid issues with ES6 modules).

### 🔧 Installation

1. **Clone the repository:**

   ```bash
   git clone git@github.com:iagolirapasssos/Educational-Maze.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd Educational-Maze
   ```

3. **Open the `index.html` file in your browser:**

   - **Option 1:** Double-click the `index.html` file.
   - **Option 2:** Use a local server. For example, with Python:

     ```bash
     # For Python 3.x
     python -m http.server 8000
     ```

     Open `http://localhost:8000` in your browser.

## 🖥️ Usage

1. **Select the Maze Level:**
   - Choose between Easy Level (8x8), Medium Level (12x12), or Hard Level (15x15) using the selector in the control panel.

2. **Create the Maze:**
   - Click "🔄 New Maze" to generate a new maze based on the selected level.

3. **Program the Car:**
   - Drag the available blocks from the "Available Blocks" section to the "My Program" area.
   - Arrange the blocks in the desired order to define the car's actions.
   - Use repeat, conditional, and audio blocks to create more complex sequences.

4. **Execute the Program:**
   - Click "▶ Execute" to start running the program.
   - Use "⏸ Pause" to pause the execution and "⏹ Stop" to completely interrupt it.
   - "🗑 Clear" removes all blocks from the "My Program" area.
   - Use the "💾 Save Program" and "📂 Open Program" buttons to manage your block sequences.

5. **Objective:**
   - Navigate the car through the maze until it reaches the finish flag 🏁.

## 🎨 Customization

Feel free to modify and customize the application according to your needs. You can add new blocks, change styles, or expand the existing functionality.

## 🤝 Contributing

Contributions are welcome! Feel free to open **issues** or submit **pull requests**.

1. **Fork the repository**
2. **Create a branch for your feature:**

   ```bash
   git checkout -b my-new-feature
   ```

3. **Commit your changes:**

   ```bash
   git commit -m "Add new feature X"
   ```

4. **Push to the branch:**

   ```bash
   git push origin my-new-feature
   ```

5. **Open a Pull Request**

## 🛡️ License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📫 Contact

Prof. Iago Lira - [prof.iagolirapassos@gmail.com](mailto:prof.iagolirapassos@gmail.com)

Project: [https://github.com/iagolirapasssos/Educational-Maze](https://github.com/iagolirapasssos/Educational-Maze)

## 💡 Acknowledgements

- [Scratch](https://scratch.mit.edu/) - Inspiration for visual programming.
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) - For audio implementation.
- [MDN Web Docs](https://developer.mozilla.org/) - Web development reference.