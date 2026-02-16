import Pusher from "pusher";
import { NextResponse } from "next/server";

const pusher = new Pusher({
  appId: "2116201",
  key: "2c02992e337b650b4202",
  secret: "df9ed9e20b6ba7923479",
  cluster: "sa1",
  useTLS: true,
});

export async function POST(req: Request) {
  try {
    const { texto, usuario, para } = await req.json();

    // Isso aqui envia a mensagem para o mundo real
    await pusher.trigger(para, "nova-mensagem", {
      texto,
      usuario,
      hora: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    });

    return NextResponse.json({ enviado: true });
  } catch (error) {
    return NextResponse.json({ enviado: false }, { status: 500 });
  }
}