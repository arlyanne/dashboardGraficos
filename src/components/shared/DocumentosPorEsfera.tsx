import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, CartesianGrid, LabelList, Cell } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { useSelection } from "@/context/SelectionContext";

interface DataItem {
  name: string;
  value: number;
  color?: string;
}

interface Props {
  getData: (status: string, esfera: string, cnpj: string) => any;
}

export default function DocumentosPorEsfera({ getData }: Props) {
  const [data, setData] = useState<DataItem[]>([]);
  const { dataItemFilter, setDataItemFilter } = useSelection();
  const [selectedItem, setSelectedItem] = useState<string>("");

  // Mapeamento persistente de cores
  const colorMap = useRef<Map<string, string>>(new Map());

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

  async function consultaEsfera(esfera: string = "") {
    try {
      const response = await getData("", esfera, "");
      setDataItemFilter(response);
    } catch (error) {
      console.error("Erro ao buscar dados", error);
    }
  }

  function processarDados(filter: any) {
    const contagem = filter.reduce(
      (acc: Record<string, number>, { NOME_COMPLETO }: any) => {
        acc[NOME_COMPLETO] = (acc[NOME_COMPLETO] || 0) + 1;
        return acc;
      },
      {}
    );

    const lista: DataItem[] = Object.entries(contagem).map(
      ([name, value], index) => {
        // Se o item já tem cor, reutiliza
        if (!colorMap.current.has(name)) {
          colorMap.current.set(name, colors[index % colors.length]);
        }
        return {
          name,
          value: value as number,
          color: colorMap.current.get(name), // Atribui a cor já armazenada
        };
      }
    );

    setData(lista);
  }

  useEffect(() => {
    consultaEsfera();
  }, []);

  useEffect(() => {
    // console.log(data)
  }, [data]);

  useEffect(() => {
    if (dataItemFilter && dataItemFilter.length > 0) {
      processarDados(dataItemFilter);
    }
  }, [dataItemFilter]);

  async function handleClick(entry: DataItem) {
    const novoItem = selectedItem === entry.name ? "" : entry.name;
    setSelectedItem(novoItem);
    await consultaEsfera(novoItem);
  }

  const filteredData = selectedItem
    ? data.filter((item) => item.name === selectedItem)
    : data;

  const chartConfig = {
    QUANTIDADE: {
      label: "NOME_COMPLETO",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-2xl font-semibold text-gray-600 my-2">
          Documentos por Esfera
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[385px] w-full"
        >
          <BarChart data={filteredData} margin={{ top: 20 }}>
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
              cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const { name, value, color } = payload[0].payload; // Obtém a cor do item
                  return (
                    <div className="p-2 border rounded shadow-md text-xs text-foreground flex items-center gap-2 bg-white">
                      {/* Quadrado colorido */}
                      <span
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: color }}
                      ></span>

                      <div>
                        <p>
                          <strong>Orgão: </strong>
                          {name}
                        </p>
                        <p>
                          <strong>Qtd.: </strong>
                          {value}
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" onClick={handleClick}>
              {filteredData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
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
