import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSelection } from "@/context/SelectionContext";
import { useEffect, useState } from "react";

interface Props {
  getData: (status: string, esfera: string, cnpj: string) => any;
}

interface DataItem {
  CNPJ: string;
  DOC: string;
  ORG: string;
  NOME_COMPLETO: string;
  DTEMI: string;
  DTVENC: string;
  OPCAO: string;
  OBS: string;
}

export default function DocumentosTabela({ getData }: Props) {
  const [data, setData] = useState<DataItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { dataItemFilter, setDataItemFilter } = useSelection();

  async function DadosPlanilhaCompletos() {
    if (isLoading) return; // Evita chamadas simultâneas
    setIsLoading(true); // Inicia o carregamento
    try {
      const response = await getData("", "", "");
      if (response) {
        setDataItemFilter(response);
      } else {
        console.error("A resposta da API foi indefinida");
      }
    } catch (error) {
      console.error("Erro ao buscar os dados:", error);
    } finally {
      setIsLoading(false); // Finaliza o carregamento
    }
  }

  useEffect(() => {
    DadosPlanilhaCompletos();
  }, []);

  useEffect(() => {
    if (dataItemFilter && dataItemFilter.length > 0) {
      const formattedData = dataItemFilter.map((item: any) => ({
        CNPJ: item.CNPJ,
        DOC: item.DOC,
        ORG: item.ORG,
        NOME_COMPLETO: item.NOME_COMPLETO,
        DTEMI: formatarData(item.DTEMI),
        DTVENC: formatarData(item.DTVENC),
        OPCAO: item.OPCAO,
        OBS: item.OBS,
      }));
      setData(formattedData);
    }
  }, [dataItemFilter]); // Quando dataItemFilter mudar, atualizar os dados

  function formatarData(dataString: string): string {
    if (!dataString) return "";
    const dia = dataString.slice(0, 2);
    const mes = dataString.slice(2, 4);
    const ano = dataString.slice(4, 8);
    const hora = dataString.slice(9, 11);
    const minuto = dataString.slice(12, 14);
    const segundo = dataString.slice(15, 17);
    return `${dia}/${mes}/${ano} ${hora}:${minuto}:${segundo}`;
  }

  return (
    <Table className="table-auto w-full border-collapse">
      <TableHeader>
        <TableRow className="bg-[#10274C] text-lg">
          <TableHead className="text-center font-semibold text-white px-4 py-3">
            Planta
          </TableHead>
          <TableHead className="text-center font-semibold text-white px-4 py-3">
            Documento
          </TableHead>
          <TableHead className="text-center font-semibold text-white px-4 py-3">
            Org. Responsável
          </TableHead>
          <TableHead className="text-center font-semibold text-white px-4 py-3">
            Esfera Governamental
          </TableHead>
          <TableHead className="text-center font-semibold text-white px-4 py-3">
            Data Emissão
          </TableHead>
          <TableHead className="text-center font-semibold text-white px-4 py-3">
            Data Vencimento
          </TableHead>
          <TableHead className="text-center font-semibold text-white px-4 py-3">
            Status Real
          </TableHead>
          <TableHead className="text-center font-semibold text-white px-4 py-3">
            Observação
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow
            key={index}
            className={`text-center ${
              index % 2 === 0 ? "bg-gray-60" : "bg-white"
            } hover:bg-gray-100 transition-all`}
          >
            <TableCell className="px-4 py-3">{item.CNPJ}</TableCell>
            <TableCell className="px-4 py-3">{item.DOC}</TableCell>
            <TableCell className="px-4 py-3">{item.ORG}</TableCell>
            <TableCell className="px-4 py-3">{item.NOME_COMPLETO}</TableCell>
            <TableCell className="px-4 py-3">{item.DTEMI}</TableCell>
            <TableCell className="px-4 py-3">{item.DTVENC}</TableCell>
            <TableCell className="px-4 py-3">{item.OPCAO}</TableCell>
            <TableCell className="px-4 py-3">{item.OBS}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
