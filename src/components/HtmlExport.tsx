import { Button } from "@/components/ui/button";
import { Contract } from "@/types/contract";
import { Code, Copy } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

interface HtmlExportProps {
  contracts: Contract[];
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

function generateHtml(contracts: Contract[]): string {
  const rows = contracts
    .map(
      (c) => `      <tr>
        <td>${c.numero}</td>
        <td>${c.fornecedor}</td>
        <td>${c.objeto}</td>
        <td>${c.valor || "—"}</td>
        <td>${formatDate(c.dataInicio)}</td>
        <td>${formatDate(c.dataFim)}</td>
        <td>${c.linkPDF ? `<a href="${c.linkPDF}" target="_blank" rel="noopener noreferrer">📄 Ver Contrato</a>` : "—"}</td>
      </tr>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contratos - Prefeitura Municipal</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; color: #1e293b; }
    h1 { color: #1e3a5f; border-bottom: 3px solid #2d8659; padding-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { background-color: #1e3a5f; color: #fff; padding: 12px 10px; text-align: left; font-size: 14px; }
    td { padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
    tr:hover { background-color: #f0fdf4; }
    a { color: #2d8659; text-decoration: none; font-weight: 600; }
    a:hover { text-decoration: underline; }
    .footer { margin-top: 30px; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <h1>Contratos Administrativos</h1>
  <table>
    <thead>
      <tr>
        <th>Nº Contrato</th>
        <th>Fornecedor</th>
        <th>Objeto</th>
        <th>Valor (R$)</th>
        <th>Início</th>
        <th>Fim</th>
        <th>Documento</th>
      </tr>
    </thead>
    <tbody>
${rows}
    </tbody>
  </table>
  <p class="footer">Gerado automaticamente em ${new Date().toLocaleDateString("pt-BR")} — Portal de Transparência</p>
</body>
</html>`;
}

export function HtmlExport({ contracts }: HtmlExportProps) {
  const [open, setOpen] = useState(false);
  const html = generateHtml(contracts);

  const handleCopy = () => {
    navigator.clipboard.writeText(html);
    toast.success("HTML copiado para a área de transferência!");
  };

  const handleDownload = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contratos.html";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Arquivo HTML baixado!");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={contracts.length === 0} className="gap-2">
          <Code className="h-4 w-4" /> Gerar HTML
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Código HTML Gerado</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 mb-3">
          <Button onClick={handleCopy} variant="outline" size="sm" className="gap-2">
            <Copy className="h-3.5 w-3.5" /> Copiar
          </Button>
          <Button onClick={handleDownload} size="sm" className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
            Baixar .html
          </Button>
        </div>
        <pre className="bg-muted rounded-md p-4 overflow-auto max-h-[50vh] text-xs leading-relaxed font-mono">
          {html}
        </pre>
      </DialogContent>
    </Dialog>
  );
}
