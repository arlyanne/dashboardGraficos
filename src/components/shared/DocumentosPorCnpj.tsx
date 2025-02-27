import { useState, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function ConsultaPorCNPJ({ getData }: Props) {
  const [data, setData] = useState<DataItem[]>([]);
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

  async function consultaCNPJ() {
    try {
      const response = await getData("", "", "");
      setDataItemFilter(response);
    } catch (error) {
      console.error("Erro ao buscar os dados", error);
    }
  }

  function montarGrafico(filter: any) {
    const contagem = filter.reduce((acc: any, { CNPJ }: any) => {
      acc[CNPJ] = (acc[CNPJ] || 0) + 1;
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

    setData(lista);
  }

  useEffect(() => {
    consultaCNPJ();
  }, []);

  useEffect(() => {
    if (dataItemFilter && dataItemFilter.length > 0) {
      montarGrafico(dataItemFilter);
      setSelectedItem("")
    }
  }, [dataItemFilter, selectedItem]);

  async function handleClick(data: any) {
    const nome = data.name;
    let resp;

    if (selectedItem === nome) {
      resp = await getData("", "", "");
      setSelectedItem("");
    } else {
      resp = await getData("", "", nome);
      setSelectedItem(nome);
    }

    setDataItemFilter(resp); // Atualiza a variavel global
  }

  useEffect(() => {
    // console.log(data)
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
      <CardHeader className="items-center pb-4">
        <CardTitle className="text-2xl font-semibold text-gray-600 my-2">
          Documentos por CNPJ
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[375px] w-full"
          style={{ width: "100%", maxWidth: "600px" }}
        >
          <BarChart
            accessibilityLayer
            data={filteredData}
            layout="vertical"
            margin={{ right: 16, left: 16 }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="value" type="number" hide />
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
                          <strong>Filial: </strong>
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

            <Bar
              dataKey="value"
              layout="vertical"
              // fill="var(--color-QUANTIDADE)"
              radius={4}
              onClick={(entry) => handleClick(entry)}
            >
              {filteredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <LabelList
                dataKey="name"
                position="insideLeft"
                offset={8}
                className="fill-[--color-CNPJ]"
                fontSize={10}
              />
              <LabelList
                dataKey="value"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={10}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
