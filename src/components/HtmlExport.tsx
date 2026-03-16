import { Button } from "@/components/ui/button";
import { Contract } from "@/types/contract";
import { Code, Copy } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

interface HtmlExportProps {
  contracts: Contract[];
  exercicio: string;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  if (dateStr.includes("/")) return dateStr;
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getExerciseSuffix(exercicio: string) {
  const digits = exercicio.replace(/\D/g, "");
  if (!digits) return "00";
  return digits.slice(-2).padStart(2, "0");
}

function getPdfFileName(contractNumber: string, exercicio: string) {
  return `Contrato ${contractNumber.trim()}.${getExerciseSuffix(exercicio)}.pdf`;
}

function generateHtml(contracts: Contract[], exercicio: string): string {
  const rows = contracts
    .map((contract) => {
      const pdfFileName = getPdfFileName(contract.contrato, exercicio);

      return `      <tr>
        <td>${escapeHtml(contract.contrato || "—")}</td>
        <td>${escapeHtml(formatDate(contract.dataAssinatura))}</td>
        <td>${escapeHtml(contract.empresa || "—")}</td>
        <td>${escapeHtml(contract.objeto || "—")}</td>
        <td>${escapeHtml(contract.fundamento || "—")}</td>
        <td>${escapeHtml(contract.vigencia || "—")}</td>
        <td>${escapeHtml(contract.valorInicial || "—")}</td>
        <td>${escapeHtml(contract.processo || "—")}</td>
        <td><a href="${escapeHtml(pdfFileName)}" download="${escapeHtml(pdfFileName)}" class="btn-pdf">📄 PDF</a></td>
      </tr>`;
    })
    .join("\n");

  const titulo = `CONTRATOS DA PREFEITURA MUNICIPAL EXERCÍCIO ${exercicio || "____"}`;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(titulo)}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; color: #1e293b; }
    h1 { color: #1e3a5f; border-bottom: 3px solid #2d8659; padding-bottom: 10px; text-transform: uppercase; }
    .subtitle { font-size: 12px; color: #64748b; font-style: italic; margin-top: -5px; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { background-color: #1e3a5f; color: #fff; padding: 12px 10px; text-align: left; font-size: 14px; }
    td { padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
    tr:hover { background-color: #f0fdf4; }
    .btn-pdf {
      display: inline-block;
      background-color: #dc2626;
      color: #fff;
      padding: 4px 10px;
      border-radius: 4px;
      text-decoration: none;
      font-size: 12px;
      font-weight: 600;
    }
    .btn-pdf:hover { background-color: #b91c1c; }
    .footer { margin-top: 30px; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <h1>${escapeHtml(titulo)}</h1>
  <p class="subtitle">* Excluídos contratos celebrados pela Administração Indireta</p>
  <table>
    <thead>
      <tr>
        <th>Contrato</th>
        <th>Data de Assinatura</th>
        <th>Empresa</th>
        <th>Objeto</th>
        <th>Fundamento (Licitação)</th>
        <th>Vigência</th>
        <th>Valor Inicial (R$)</th>
        <th>Processo</th>
        <th>Download</th>
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

export function HtmlExport({ contracts, exercicio }: HtmlExportProps) {
  const [open, setOpen] = useState(false);
  const html = generateHtml(contracts, exercicio);

  const handleCopy = () => {
    navigator.clipboard.writeText(html);
    toast.success("HTML copiado para a área de transferência!");
  };

  const handleDownload = () => {
    const blob = new Blob(["\uFEFF", html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contratos-exercicio-${exercicio || "geral"}.html`;
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
