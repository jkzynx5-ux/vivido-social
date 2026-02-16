"use client";
import { useEffect, useState } from "react";
import Pusher from "pusher-js";

export default function PaginaChat() {
  const [mensagem, setMensagem] = useState("");
  const [historico, setHistorico] = useState<{usuario: string, texto: string, hora: string}[]>([]);
  
  // Configurações (Pode mudar 'Voce' para seu nome)
  const meuNome = "Voce";
  const canalGeral = "Geral"; 

  useEffect(() => {
    // Inicia o Pusher com a sua KEY
    const pusher = new Pusher("2c02992e337b650b4202", {
      cluster: "sa1",
    });

    // Se inscreve no canal
    const channel = pusher.subscribe(canalGeral);

    // Quando chegar 'nova-mensagem', adiciona na tela
    channel.bind("nova-mensagem", (dados: any) => {
      setHistorico((prev) => [...prev, dados]);
    });

    return () => {
      pusher.unsubscribe(canalGeral);
    };
  }, []);

  const mandarMensagem = async () => {
    if (!mensagem.trim()) return;

    // CHAMA A SUA ROTA DE API
    await fetch("/api/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        texto: mensagem,
        usuario: meuNome,
        para: canalGeral,
      }),
    });

    setMensagem(""); // Limpa o campo depois de enviar
  };

  return (
    <div className="flex h-screen flex-col bg-slate-900 text-white p-4">
      <div className="mx-auto flex w-full max-w-md flex-col h-full bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
        
        {/* Topo do Chat */}
        <div className="bg-purple-600 p-4 font-bold text-center shadow-md">
          Vivido Social ⚡
        </div>

        {/* Área das Mensagens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {historico.map((m, i) => (
            <div key={i} className={`flex ${m.usuario === meuNome ? "justify-end" : "justify-start"}`}>
              <div className={`p-3 rounded-2xl max-w-[80%] ${m.usuario === meuNome ? "bg-purple-500" : "bg-slate-700"}`}>
                <p className="text-[10px] opacity-50">{m.usuario}</p>
                <p className="text-sm">{m.texto}</p>
                <p className="text-[9px] text-right opacity-40">{m.hora}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Barra de Digitação */}
        <div className="p-4 bg-slate-700 flex gap-2">
          <input 
            type="text"
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && mandarMensagem()}
            placeholder="Escreva uma mensagem..."
            className="flex-1 bg-slate-900 border-none rounded-full px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
          />
          <button 
            onClick={mandarMensagem}
            className="bg-purple-600 hover:bg-purple-500 p-2 rounded-full transition-colors"
          >
            🚀
          </button>
        </div>
      </div>
    </div>
  );
}