import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Contract } from "@/types/contract";
import { Plus } from "lucide-react";

interface ContractFormProps {
  onAdd: (contract: Contract) => void;
}

const emptyForm = {
  numero: "",
  fornecedor: "",
  objeto: "",
  valor: "",
  dataInicio: "",
  dataFim: "",
  linkPDF: "",
};

export function ContractForm({ onAdd }: ContractFormProps) {
  const [form, setForm] = useState(emptyForm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: crypto.randomUUID(),
      ...form,
    });
    setForm(emptyForm);
  };

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Plus className="h-5 w-5 text-accent" />
          Adicionar Contrato
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="numero">Nº do Contrato *</Label>
            <Input id="numero" value={form.numero} onChange={(e) => update("numero", e.target.value)} required placeholder="Ex: 001/2025" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="fornecedor">Fornecedor *</Label>
            <Input id="fornecedor" value={form.fornecedor} onChange={(e) => update("fornecedor", e.target.value)} required placeholder="Nome do fornecedor" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="objeto">Objeto *</Label>
            <Input id="objeto" value={form.objeto} onChange={(e) => update("objeto", e.target.value)} required placeholder="Descrição do objeto" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="valor">Valor (R$)</Label>
            <Input id="valor" value={form.valor} onChange={(e) => update("valor", e.target.value)} placeholder="Ex: 150.000,00" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dataInicio">Data Início</Label>
            <Input id="dataInicio" type="date" value={form.dataInicio} onChange={(e) => update("dataInicio", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dataFim">Data Fim</Label>
            <Input id="dataFim" type="date" value={form.dataFim} onChange={(e) => update("dataFim", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="linkPDF">Link do PDF</Label>
            <Input id="linkPDF" type="url" value={form.linkPDF} onChange={(e) => update("linkPDF", e.target.value)} placeholder="https://..." />
          </div>
          <div className="lg:col-span-4 flex justify-end pt-2">
            <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8">
              <Plus className="h-4 w-4 mr-2" /> Adicionar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
