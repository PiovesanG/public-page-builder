import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Contract } from "@/types/contract";
import { Upload } from "lucide-react";
import Papa from "papaparse";
import { toast } from "sonner";

interface CsvImportProps {
  onImport: (contracts: Contract[]) => void;
}

const FIELD_MAP: Record<string, keyof Omit<Contract, "id">> = {
  contrato: "contrato",
  "nº contrato": "contrato",
  "nº do contrato": "contrato",
  "n contrato": "contrato",
  "n do contrato": "contrato",
  numero: "contrato",
  "data de assinatura": "dataAssinatura",
  "data assinatura": "dataAssinatura",
  dataassinatura: "dataAssinatura",
  assinatura: "dataAssinatura",
  empresa: "empresa",
  fornecedor: "empresa",
  objeto: "objeto",
  descricao: "objeto",
  "fundamento (licitacao)": "fundamento",
  "fundamento(licitacao)": "fundamento",
  fundamento: "fundamento",
  licitacao: "fundamento",
  vigencia: "vigencia",
  "valor inicial": "valorInicial",
  valorinicial: "valorInicial",
  valor: "valorInicial",
  "valor (r$)": "valorInicial",
  "valor inicial (r$)": "valorInicial",
  processo: "processo",
  link: "linkPdf",
  "link pdf": "linkPdf",
  linkpdf: "linkPdf",
  "link do contrato": "linkPdf",
  "link contrato": "linkPdf",
  url: "linkPdf",
  download: "linkPdf",
  arquivo: "linkPdf",
};

function normalize(str: string) {
  return str
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function hasGarbledChars(text: string): boolean {
  // Common garbled patterns from reading Windows-1252 as UTF-8
  return /ï¿½|Ã§|Ã£|Ã©|Ã¡|Ã³|Ãº|Ã­|Ã¢|Ãª|Ã´|Ã|â€/.test(text);
}

function parseContracts(text: string, onImport: (contracts: Contract[]) => void) {
  Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      const headers = results.meta.fields || [];
      const mapping: Record<string, keyof Omit<Contract, "id">> = {};

      headers.forEach((h) => {
        const key = normalize(h);
        // Try exact match first, then partial
        if (FIELD_MAP[key]) {
          mapping[h] = FIELD_MAP[key];
        } else {
          // Try matching against all keys
          for (const [mapKey, mapVal] of Object.entries(FIELD_MAP)) {
            if (key.includes(mapKey) || mapKey.includes(key)) {
              mapping[h] = mapVal;
              break;
            }
          }
        }
      });

      const contracts: Contract[] = (results.data as Record<string, string>[])
        .filter((row) => {
          const num = Object.entries(mapping).find(([, v]) => v === "contrato");
          return num && row[num[0]]?.trim();
        })
        .map((row) => {
          const c: any = { id: crypto.randomUUID() };
          Object.entries(mapping).forEach(([csvCol, field]) => {
            c[field] = row[csvCol]?.trim() || "";
          });
          const fields: (keyof Omit<Contract, "id">)[] = [
            "contrato", "dataAssinatura", "empresa", "objeto",
            "fundamento", "vigencia", "valorInicial", "processo", "linkPdf"
          ];
          fields.forEach(f => { if (!c[f]) c[f] = ""; });
          return c as Contract;
        });

      if (contracts.length === 0) {
        toast.error("Nenhum contrato encontrado no CSV. Verifique as colunas.");
      } else {
        onImport(contracts);
        toast.success(`${contracts.length} contrato(s) importado(s) com sucesso!`);
      }
    },
    error: () => {
      toast.error("Erro ao ler o arquivo CSV.");
    },
  });
}

export function CsvImport({ onImport }: CsvImportProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Try UTF-8 first, if garbled try Windows-1252
    const readerUtf8 = new FileReader();
    readerUtf8.onload = (event) => {
      const text = event.target?.result as string;

      if (hasGarbledChars(text)) {
        // Re-read with Windows-1252 (ISO-8859-1)
        const readerLatin = new FileReader();
        readerLatin.onload = (ev) => {
          const textLatin = ev.target?.result as string;
          parseContracts(textLatin, onImport);
        };
        readerLatin.readAsText(file, "windows-1252");
      } else {
        parseContracts(text, onImport);
      }
    };

    readerUtf8.readAsText(file, "UTF-8");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <>
      <input ref={inputRef} type="file" accept=".csv" onChange={handleFile} className="hidden" />
      <Button variant="outline" onClick={() => inputRef.current?.click()} className="gap-2">
        <Upload className="h-4 w-4" /> Importar CSV
      </Button>
    </>
  );
}
