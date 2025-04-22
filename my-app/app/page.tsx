"use client";

import { useState } from "react";
import * as XLSX from "xlsx";

interface Participant {
  name: string;
  email: string;
  nickname: string;
  phone: string;
  gender: string;
  secondaryEmail: string;
  ageRange: string;
  howDoYouKnow: string;
}

interface ApiResponse {
  event?: {
    sessions?: {
      sessionListeners?: {
        participant: Participant;
        status: string;
      }[];
    }[];
  };
}

// Função para traduzir os status
const translateStatus = (status: string): string => {
  switch (status) {
    case "WAITING_EVENT":
      return "Aguardando Evento";
    case "CONFIRMED":
      return "Confirmado";
    case "CANCELLED":
      return "Cancelado";
    case "ATTENDED":
      return "Compareceu";
    default:
      return "Status Desconhecido";
  }
};

export default function Home() {
  const [eventId, setEventId] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleDownload = async (): Promise<void> => {
    if (!eventId || !token) {
      alert("Por favor, informe o Token e o ID do Evento.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`https://api.volunt.me/social-events/${eventId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar dados do evento");
      }

      const data: ApiResponse = await response.json();

      if (!data?.event?.sessions?.[0]?.sessionListeners) {
        throw new Error("Nenhum participante encontrado para esse evento.");
      }

      const participantes = data.event.sessions[0].sessionListeners.map((b) => {
        return {
          ...b.participant,
          status: translateStatus(b.status), // Adicionando o status traduzido
        };
      });

      // Mapeando os dados para incluir os headers personalizados
      const participantesComHeaders = participantes.map((p) => ({
        "Status": p.status, // Adicionando status traduzido
        "Nome do Participante": p.name,
        "Email Principal": p.email,
        "Apelido": p.nickname,
        "Telefone": p.phone,
        "Gênero": p.gender,
        "Email Secundário": p.secondaryEmail,
        "Faixa Etária": p.ageRange,
        "Como Conheceu": p.howDoYouKnow,
      }));

      // Criando a planilha
      const ws = XLSX.utils.json_to_sheet(participantesComHeaders, { header: [
        "Status",
        "Nome do Participante",
        "Email Principal",
        "Apelido",
        "Telefone",
        "Gênero",
        "Email Secundário",
        "Faixa Etária",
        "Como Conheceu",
      ] });

      // Estilizando o cabeçalho
      const headerRange = ws["!ref"]?.split(":")[0]; // Pega a primeira célula do cabeçalho (ex: A1)
      const headerStyle = {
        font: { bold: true, color: { rgb: "FFFFFF" } },  // Letra branca e negrito
        fill: { fgColor: { rgb: "4F81BD" } },  // Cor de fundo azul
      };
      if (headerRange) {
        const colCount = Object.keys(ws).filter(key => key.startsWith(headerRange[0])).length;
        for (let i = 0; i < colCount; i++) {
          const cellAddress = XLSX.utils.encode_cell({ r: 0, c: i }); // Cada célula do cabeçalho
          if (ws[cellAddress]) {
            ws[cellAddress].s = headerStyle;
          }
        }
      }

      // Ajustando a largura das colunas automaticamente
      const colWidths = participantesComHeaders[0]
        ? Object.keys(participantesComHeaders[0]).map((key) => ({
            wch: Math.max(...participantesComHeaders.map((row: any) => row[key]?.length || 0), key.length),
          }))
        : [];

      ws["!cols"] = colWidths;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Participantes");

      // Gerando o arquivo Excel
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Criando um link para download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "dados.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro:", error);
      alert((error as Error).message);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-600 p-4">
      <h1 className="text-2xl font-bold mb-6">Baixar Planilha do Evento</h1>

      <input
        type="text"
        placeholder="ID do Evento"
        value={eventId}
        onChange={(e) => setEventId(e.target.value)}
        className="border p-2 rounded w-72 mb-3 text-zinc-800"
      />

      <input
        type="text"
        placeholder="Token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        className="border p-2 rounded w-72 mb-3 text-zinc-800"
      />

      <button
        onClick={handleDownload}
        className="px-4 py-2 bg-blue-500 text-white rounded"
        disabled={loading}
      >
        {loading ? "Baixando..." : "Baixar Planilha"}
      </button>
    </div>
  );
}
