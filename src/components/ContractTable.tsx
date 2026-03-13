import { Contract } from "@/types/contract";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, FileText } from "lucide-react";

interface ContractTableProps {
  contracts: Contract[];
  onDelete: (id: string) => void;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  if (dateStr.includes("/")) return dateStr;
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

export function ContractTable({ contracts, onDelete }: ContractTableProps) {
  if (contracts.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">Nenhum contrato cadastrado</p>
          <p className="text-sm mt-1">Adicione contratos pelo formulário acima ou importe um CSV.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Contratos Cadastrados ({contracts.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/5">
                <TableHead className="font-semibold">Contrato</TableHead>
                <TableHead className="font-semibold">Data de Assinatura</TableHead>
                <TableHead className="font-semibold">Empresa</TableHead>
                <TableHead className="font-semibold">Objeto</TableHead>
                <TableHead className="font-semibold">Fundamento (Licitação)</TableHead>
                <TableHead className="font-semibold">Vigência</TableHead>
                <TableHead className="font-semibold">Valor Inicial (R$)</TableHead>
                <TableHead className="font-semibold">Processo</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.contrato}</TableCell>
                  <TableCell>{formatDate(c.dataAssinatura)}</TableCell>
                  <TableCell>{c.empresa}</TableCell>
                  <TableCell className="max-w-[250px] truncate">{c.objeto}</TableCell>
                  <TableCell>{c.fundamento || "—"}</TableCell>
                  <TableCell>{c.vigencia || "—"}</TableCell>
                  <TableCell>{c.valorInicial || "—"}</TableCell>
                  <TableCell>{c.processo || "—"}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(c.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
