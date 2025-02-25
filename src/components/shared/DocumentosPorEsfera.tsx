import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, CartesianGrid, LabelList, Cell } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useSelection } from "@/context/SelectionContext";

interface DataItem {
  name: string;
  value: number;
}

interface Props {
  getData: (status: string, esfera: string, cnpj: string) => any;
}

export default function DocumentosPorEsfera({ getData }: Props) {
  const [data, setData] = useState<DataItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const { dataItemFilter, setDataItemFilter } = useSelection();

  async function consultaEsfera() {
    try {
      const response = await getData("", "", "");
      setDataItemFilter(response);
    } catch (error) {
      console.error("Erro ao buscar dados", error);
    }
  }

  function mostrarGrafico(filter: any) {
    const contagem = filter.reduce((acc: any, { NOME_COMPLETO }: any) => {
      acc[NOME_COMPLETO] = (acc[NOME_COMPLETO] || 0) + 1;
      return acc;
    }, {});

    const lista: DataItem[] = Object.entries(contagem).map(([name, value]) => ({
      name,
      value: value as number,
    }));

    setData(lista);
  }

  useEffect(() => {
    consultaEsfera();
  }, []);

  useEffect(() => {
    if (dataItemFilter && dataItemFilter.length > 0) {
      mostrarGrafico(dataItemFilter);
    }
  }, [dataItemFilter, selectedItem]);

  async function handleClick(data: any) {
    const nome = data.name;
    let resp;
    if (selectedItem === nome) {
      resp = await getData("", "", "");
      setSelectedItem("");
    } else {
      resp = await getData("", nome, "");
      setSelectedItem(nome);
    }

    setDataItemFilter(resp); // Atualiza a variável global do contexto
  }

  const chartConfig = {
    QUANTIDADE: {
      label: "NOME_COMPLETO",
    },
  } satisfies ChartConfig;

  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#8dd1e1",
    "#a4de6c",
    "#d0ed57",
    "#f4e1d2",
  ];

  const filteredData = selectedItem
    ? data.filter((item) => item.name === selectedItem)
    : data;
  const selectedColor = selectedItem
    ? colors[
        data.findIndex((item) => item.name === selectedItem) % colors.length
      ]
    : colors[0];

  return (
    <Card>
      <CardHeader className="items-center pb-0">
        <CardTitle>Documentos por Esfera</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart accessibilityLayer data={filteredData} margin={{ top: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                value.length > 10 ? `${value.slice(0, 10)}...` : value
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <Bar dataKey="value" onClick={(entry) => handleClick(entry)}>
              {filteredData.map((entry: any, index: any) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    selectedItem === entry.name
                      ? selectedColor ?? colors[index % colors.length]
                      : colors[index % colors.length]
                  }
                />
              ))}
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
