"use client"; // Para garantir que roda no cliente

import { useState } from "react";

export default function DownloadExcelButton() {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);

    try {
      const eventId = "event_y04ltgjgq0tw9itz6u7n5h2d"; // 🔴 Alterar para o ID dinâmico conforme necessário
      const response = await fetch(`https://api.volunt.me/social-events/${eventId}`);

      if (!response.ok) {
        throw new Error("Erro ao baixar planilha");
      }

      // Cria um Blob com os dados recebidos
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Cria um link para baixar
      const a = document.createElement("a");
      a.href = url;
      a.download = "dados.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao baixar planilha.");
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handleDownload}
      className="px-4 py-2 bg-blue-500 text-white rounded"
      disabled={loading}
    >
      {loading ? "Baixando..." : "Baixar Planilha"}
    </button>
  );
}
