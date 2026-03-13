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
  contrato: "",
  dataAssinatura: "",
  empresa: "",
  objeto: "",
  fundamento: "",
  vigencia: "",
  valorInicial: "",
  processo: "",
  linkPdf: "",
};

export function ContractForm({ onAdd }: ContractFormProps) {
  const [form, setForm] = useState(emptyForm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ id: crypto.randomUUID(), ...form });
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
            <Label htmlFor="contrato">Contrato *</Label>
            <Input id="contrato" value={form.contrato} onChange={(e) => update("contrato", e.target.value)} required placeholder="Ex: 001/2025" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dataAssinatura">Data de Assinatura</Label>
            <Input id="dataAssinatura" type="date" value={form.dataAssinatura} onChange={(e) => update("dataAssinatura", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="empresa">Empresa *</Label>
            <Input id="empresa" value={form.empresa} onChange={(e) => update("empresa", e.target.value)} required placeholder="Nome da empresa" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="objeto">Objeto *</Label>
            <Input id="objeto" value={form.objeto} onChange={(e) => update("objeto", e.target.value)} required placeholder="Descrição do objeto" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="fundamento">Fundamento (Licitação)</Label>
            <Input id="fundamento" value={form.fundamento} onChange={(e) => update("fundamento", e.target.value)} placeholder="Ex: Pregão 010/2025" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="vigencia">Vigência</Label>
            <Input id="vigencia" value={form.vigencia} onChange={(e) => update("vigencia", e.target.value)} placeholder="Ex: 12 meses" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="valorInicial">Valor Inicial (R$)</Label>
            <Input id="valorInicial" value={form.valorInicial} onChange={(e) => update("valorInicial", e.target.value)} placeholder="Ex: 150.000,00" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="processo">Processo</Label>
            <Input id="processo" value={form.processo} onChange={(e) => update("processo", e.target.value)} placeholder="Ex: 2025/001234" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="linkPdf">Link do Contrato (PDF)</Label>
            <Input id="linkPdf" value={form.linkPdf} onChange={(e) => update("linkPdf", e.target.value)} placeholder="https://exemplo.com/contrato.pdf" />
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
