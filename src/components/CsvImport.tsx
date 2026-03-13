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
  numero: "contrato",
  "data de assinatura": "dataAssinatura",
  "data assinatura": "dataAssinatura",
  dataassinatura: "dataAssinatura",
  assinatura: "dataAssinatura",
  empresa: "empresa",
  fornecedor: "empresa",
  objeto: "objeto",
  descricao: "objeto",
  "descrição": "objeto",
  "fundamento (licitação)": "fundamento",
  "fundamento (licitacao)": "fundamento",
  fundamento: "fundamento",
  "licitação": "fundamento",
  licitacao: "fundamento",
  vigencia: "vigencia",
  "vigência": "vigencia",
  "valor inicial": "valorInicial",
  valorinicial: "valorInicial",
  valor: "valorInicial",
  "valor (r$)": "valorInicial",
  processo: "processo",
};

function normalize(str: string) {
  return str.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function CsvImport({ onImport }: CsvImportProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;

      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const headers = results.meta.fields || [];
          const mapping: Record<string, keyof Omit<Contract, "id">> = {};

          headers.forEach((h) => {
            const key = normalize(h);
            if (FIELD_MAP[key]) mapping[h] = FIELD_MAP[key];
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
              // Ensure all fields exist
              const fields: (keyof Omit<Contract, "id">)[] = [
                "contrato", "dataAssinatura", "empresa", "objeto",
                "fundamento", "vigencia", "valorInicial", "processo"
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
    };

    reader.readAsText(file, "UTF-8");
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
