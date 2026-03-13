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
  numero: "numero",
  "nº contrato": "numero",
  "nº do contrato": "numero",
  contrato: "numero",
  fornecedor: "fornecedor",
  empresa: "fornecedor",
  objeto: "objeto",
  descricao: "objeto",
  "descrição": "objeto",
  valor: "valor",
  "valor (r$)": "valor",
  "data inicio": "dataInicio",
  "data início": "dataInicio",
  datainicio: "dataInicio",
  inicio: "dataInicio",
  "data fim": "dataFim",
  datafim: "dataFim",
  fim: "dataFim",
  link: "linkPDF",
  "link pdf": "linkPDF",
  linkpdf: "linkPDF",
  pdf: "linkPDF",
  url: "linkPDF",
};

function normalize(str: string) {
  return str.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function CsvImport({ onImport }: CsvImportProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
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
            const num = Object.entries(mapping).find(([, v]) => v === "numero");
            return num && row[num[0]]?.trim();
          })
          .map((row) => {
            const c: any = { id: crypto.randomUUID() };
            Object.entries(mapping).forEach(([csvCol, field]) => {
              c[field] = row[csvCol]?.trim() || "";
            });
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
