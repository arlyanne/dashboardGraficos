import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Label, Cell } from "recharts";
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

export default function DocumentosPorStatus({ getData }: Props) {
  const [data, setData] = useState<DataItem[]>([]);
  const [totalDocumentos, setTotalDocumentos] = useState(0);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const { dataItemFilter, setDataItemFilter } = useSelection();

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

  async function dadosStatusTotal() {
    try {
      const response = await getData("", "", "");
      setDataItemFilter(response);
    } catch (error) {
      console.error("Erro ao buscar os dados", error);
    }
  }

  function montarGrafico(filter: any) {
    const contagem = filter.reduce((acc: any, { OPCAO }: any) => {
      acc[OPCAO] = (acc[OPCAO] || 0) + 1;
      return acc;
    }, {});

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

    const totalDocumentos = lista.reduce((acc, item) => acc + item.value, 0);

    setData(lista);
    setTotalDocumentos(totalDocumentos);
  }

  useEffect(() => {
    dadosStatusTotal();
  }, []);

  useEffect(() => {
    if (dataItemFilter && dataItemFilter.length > 0) {
      montarGrafico(dataItemFilter);
      setSelectedItem("")
    }
  }, [dataItemFilter]);

  async function handleClick(data: any) {
    const nome = data.name;
    let resp;

    if (selectedItem === nome) {
      resp = await getData("", "", "");
      setSelectedItem("");
    } else {
      resp = await getData(nome, "", "");
      setSelectedItem(nome);
    }

    setDataItemFilter(resp);
  }

  useEffect(() => {
    if (selectedItem) {
      const selectedData = data.find((item) => item.name === selectedItem);
      setTotalDocumentos(selectedData ? selectedData.value : 0);
    } else {
      setTotalDocumentos(data.reduce((acc, item) => acc + item.value, 0));
    }
  }, [selectedItem, data]);

  useEffect(() => {
    //  console.log(data)
  }, [data]);

  const chartConfig = {
    QUANTIDADE: {
      label: "QUANTIDADE",
    },
  } satisfies ChartConfig;

  const filteredData = selectedItem
    ? data.filter((item) => item.name === selectedItem)
    : data;

  return (
    <Card>
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-2xl font-semibold text-gray-600 my-2">
          Documentos por Status
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-4 pt-4">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[285px] w-full"
        >
          <PieChart>
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
                          <strong>Status: </strong>
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
            <Pie
              data={filteredData}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              strokeWidth={5}
              onClick={(entry) => handleClick(entry)}
            >
              {filteredData.map((e, index) => (
                <Cell key={`cell-${index}`} fill={e.color} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalDocumentos.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Documentos
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="text-sm mt-4 flex flex-wrap justify-center gap-6">
          {filteredData.slice(0, 3).map((entry, index) => (
            <div
              key={`legend-${index}`}
              className="flex items-center space-x-3"
            >
              <div
                className="w-5 h-5 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-xs text-gray-500 font-normal">
                {entry.name}: {entry.value}
              </span>
            </div>
          ))}

          <div className="w-full flex justify-center space-x-8 mt-4">
            {filteredData.slice(3).map((entry, index) => (
              <div
                key={`legend-${index + 3}`}
                className="flex items-center space-x-3"
              >
                <div
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-xs text-gray-500 font-normal">
                  {entry.name}: {entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
