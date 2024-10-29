# Labirinto Educativo 🚗🧩

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-yellow.svg)
![HTML5](https://img.shields.io/badge/HTML5-%23E34F26.svg?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-%231572B6.svg?logo=css3&logoColor=white)

Labirinto Educativo é uma aplicação web interativa que permite aos usuários programar um carro para navegar através de um labirinto utilizando blocos de programação visual. Inspirado em plataformas como Scratch, este projeto visa ensinar conceitos de lógica de programação de maneira divertida e intuitiva.

## 📝 Descrição

Com o Labirinto Educativo, os usuários podem arrastar e soltar blocos de comandos para criar sequências que direcionam o movimento do carro no labirinto. Além dos blocos de movimento básicos, o projeto inclui blocos condicionais, de repetição e até mesmo blocos de áudio que permitem emitir sons em frequências específicas, semelhante aos comandos `Tone` e `NoTone` do Arduino.

## 🚀 Funcionalidades

- **Blocos de Movimento:** Comandos para mover o carro para frente, para trás, e girar à esquerda ou direita.
- **Blocos Condicionais:** Permite executar comandos baseados em condições específicas, como a presença de paredes.
- **Blocos de Repetição:** Repetir sequências de comandos múltiplas vezes ou indefinidamente.
- **Blocos de Espelhamento:** Espelhar movimentos horizontal ou verticalmente.
- **Blocos de Áudio:** Emitir sons em frequências específicas e parar os sons emitidos.
- **Salvar e Abrir Programas:** Salvar suas sequências de blocos e recarregá-las posteriormente.
- **Interface Intuitiva:** Arrastar e soltar blocos para criar sequências de programação.
- **Feedback Visual e Sonoro:** Mensagens informativas durante a execução e sons para melhorar a interatividade.
- **Níveis de Dificuldade:** Escolha entre diferentes tamanhos de labirintos (Fácil, Médio, Difícil).

## 📸 Demonstração

![Interface do Labirinto](screenshots/interface.png)
*Captura de tela da interface do Labirinto Educativo.*

*(Nota: Adicione capturas de tela ou GIFs animados na pasta `screenshots` e atualize os links conforme necessário.)*

## 🛠 Tecnologias Utilizadas

- **HTML5** - Estrutura da aplicação.
- **CSS3** - Estilização e layout responsivo.
- **JavaScript (ES6+)** - Lógica de programação e interação.
- **Web Audio API** - Emissão de sons em frequências específicas.
- **Drag and Drop API** - Funcionalidade de arrastar e soltar blocos.
- **SVG** - Gráficos vetoriais para o carro.

## 🧭 Começando

Estas instruções fornecerão uma cópia do projeto e permitirão que você o execute na sua máquina local para fins de desenvolvimento e teste.

### 📋 Pré-requisitos

- Um navegador web moderno (Chrome, Firefox, Edge, Safari).
- Um servidor local para servir arquivos estáticos (opcional, mas recomendado para evitar problemas com módulos ES6).

### 🔧 Instalação

1. **Clone o repositório:**

   ```bash
   git clone git@github.com:iagolirapasssos/Labirinto-Educativo.git
   ```

2. **Navegue até o diretório do projeto:**

   ```bash
   cd Labirinto-Educativo
   ```

3. **Abra o arquivo `index.html` no seu navegador:**

   - **Opção 1:** Clique duas vezes no arquivo `index.html`.
   - **Opção 2:** Utilize um servidor local. Por exemplo, com Python:

     ```bash
     # Para Python 3.x
     python -m http.server 8000
     ```

     Abra `http://localhost:8000` no seu navegador.

## 🖥️ Uso

1. **Selecionar o Nível do Labirinto:**
   - Escolha entre Nível Fácil (8x8), Médio (12x12) ou Difícil (15x15) usando o seletor no painel de controles.

2. **Criar o Labirinto:**
   - Clique em "🔄 Novo Labirinto" para gerar um novo labirinto com base no nível selecionado.

3. **Programar o Carro:**
   - Arraste os blocos disponíveis da seção "Blocos Disponíveis" para a área "Meu Programa".
   - Organize os blocos na ordem desejada para definir as ações do carro.
   - Utilize blocos de repetição, condicionais e áudio para criar sequências mais complexas.

4. **Executar o Programa:**
   - Clique em "▶ Executar" para iniciar a execução do programa.
   - Use "⏸ Pausar" para pausar a execução e "⏹ Parar" para interromper completamente.
   - "🗑 Limpar" remove todos os blocos da área "Meu Programa".
   - Utilize os botões "💾 Salvar Programa" e "📂 Abrir Programa" para gerenciar suas sequências de blocos.

5. **Objetivo:**
   - Navegar o carro através do labirinto até chegar à bandeira de chegada 🏁.

## 🎨 Personalização

Sinta-se à vontade para modificar e personalizar a aplicação de acordo com suas necessidades. Você pode adicionar novos blocos, alterar estilos ou expandir a funcionalidade existente.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir **issues** ou enviar **pull requests**.

1. **Fork o repositório**
2. **Crie uma branch para sua feature:**

   ```bash
   git checkout -b minha-nova-feature
   ```

3. **Commit suas alterações:**

   ```bash
   git commit -m "Adiciona nova funcionalidade X"
   ```

4. **Push para a branch:**

   ```bash
   git push origin minha-nova-feature
   ```

5. **Abra um Pull Request**

## 🛡️ Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📫 Contato

Prof. Iago Lira - [prof.iagolirapassos@gmail.com](mailto:prof.iagolirapassos@gmail.com)

Projeto: [https://github.com/iagolirapasssos/Labirinto-Educativo](https://github.com/iagolirapasssos/Labirinto-Educativo)

## 💡 Agradecimentos

- [Scratch](https://scratch.mit.edu/) - Inspiração para a programação visual.
- [Web Audio API](https://developer.mozilla.org/pt-BR/docs/Web/API/Web_Audio_API) - Para a implementação de áudio.
- [MDN Web Docs](https://developer.mozilla.org/) - Referência para desenvolvimento web.

---
