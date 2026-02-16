const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;

// Prepara o Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handle);

  // LIGA O WEBSOCKET NO MESMO SERVIDOR
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("Novo cliente conectado:", socket.id);

    // Entrar na sala do próprio usuário
    socket.on("entrar", (user) => {
        socket.join(user.username);
    });

    // Chat Privado
    socket.on("private_message", (data) => {
        io.to(data.para).emit("new_message", data);
        // Opcional: mandar de volta para quem enviou pra confirmar
        io.to(data.de).emit("new_message", data); 
    });
  });

  // Inicia o servidor na porta certa
  httpServer.listen(port, () => {
    console.log(`> Servidor pronto em http://${hostname}:${port}`);
  });
});