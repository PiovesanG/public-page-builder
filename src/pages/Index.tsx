import { useState } from "react";
import { Contract } from "@/types/contract";
import { ContractForm } from "@/components/ContractForm";
import { ContractTable } from "@/components/ContractTable";
import { CsvImport } from "@/components/CsvImport";
import { HtmlExport } from "@/components/HtmlExport";
import { FileText } from "lucide-react";

const Index = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);

  const addContract = (contract: Contract) => {
    setContracts((prev) => [...prev, contract]);
  };

  const deleteContract = (id: string) => {
    setContracts((prev) => prev.filter((c) => c.id !== id));
  };

  const importContracts = (imported: Contract[]) => {
    setContracts((prev) => [...prev, ...imported]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-5 flex items-center gap-3">
          <FileText className="h-7 w-7" />
          <div>
            <h1 className="text-xl font-bold tracking-tight">Gerador de Tabela de Contratos</h1>
            <p className="text-sm opacity-80">Prefeitura Municipal — Portal de Transparência</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
        {/* Actions bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-muted-foreground text-sm">
            Cadastre os contratos e gere o HTML pronto para publicação no portal.
          </p>
          <div className="flex gap-2">
            <CsvImport onImport={importContracts} />
            <HtmlExport contracts={contracts} />
          </div>
        </div>

        <ContractForm onAdd={addContract} />
        <ContractTable contracts={contracts} onDelete={deleteContract} />
      </main>
    </div>
  );
};

export default Index;
