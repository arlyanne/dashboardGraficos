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
  getData: (status: string, esfera: string, cnpj: string) => any
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

export default function DocumentosTabela({getData}: Props) {
  const [data, setData] = useState<DataItem[]>([]);
  const { dataItemFilter, setDataItemFilter } = useSelection();

  async function DadosPlanilhaCompletos() {
    const response = await getData('', '', '');
    setDataItemFilter(response)
    console.log(dataItemFilter)
    
  }

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
  }, [dataItemFilter]);

  return (
    <Table className="table-auto">
      <TableHeader>
        <TableRow className="bg-[#10274C] text-lg">
          <TableHead className="text-center font-bold text-white">
            Planta
          </TableHead>
          <TableHead className="text-center font-bold text-white">
            Documento
          </TableHead>
          <TableHead className="text-center font-bold text-white">
            Org. Responsável
          </TableHead>
          <TableHead className="text-center font-bold text-white">
            Esfera Governamental
          </TableHead>
          <TableHead className="text-center font-bold text-white">
            Data Emissão
          </TableHead>
          <TableHead className="text-center font-bold text-white">
            Data Vencimento
          </TableHead>
          <TableHead className="text-center font-bold text-white">
            Status Real
          </TableHead>
          <TableHead className="text-center font-bold text-white">
            Observação
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow
            key={item.CNPJ}
            className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
          >
            <TableCell className="text-center">{item.CNPJ}</TableCell>
            <TableCell className="text-center">{item.DOC}</TableCell>
            <TableCell className="text-center">{item.ORG}</TableCell>
            <TableCell className="text-center">{item.NOME_COMPLETO}</TableCell>
            <TableCell className="text-center">{item.DTEMI}</TableCell>
            <TableCell className="text-center">{item.DTVENC}</TableCell>
            <TableCell className="text-center">{item.OPCAO}</TableCell>
            <TableCell>{item.OBS}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
