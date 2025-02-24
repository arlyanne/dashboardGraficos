import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Label, Cell } from "recharts";
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
  getData: (status: string, esfera: string, cnpj: string) => any
}

export default function DocumentosPorStatus({getData}: Props) {
  const [data, setData] = useState<DataItem[]>([]);
  const [totalDocumentos, setTotalDocumentos] = useState(0);
  const [ selectedItem, setSelectedItem ] = useState<string>('');
  const { dataItemFilter, setDataItemFilter } = useSelection();

  async function dadosStatusTotal() {
   
    try {
      const response = await getData("", "", "") 
      setDataItemFilter(response)
    } catch (error) {
      console.error("Erro ao buscar os dados", error);
    }
  }

  function montarGrafico(filter: any){
    const contagem = filter.reduce((acc: any, { OPCAO }:any) => {
      acc[OPCAO] = (acc[OPCAO] || 0) + 1;
      return acc;
    }, {});
  
    const lista: DataItem[] = Object.entries(contagem).map(([name, value]) => ({ 
      name, 
      value: value as number 
    }));

    const totalDocumentos = lista.reduce(
      (acc: number, item: DataItem) => acc + item.value,
      0
    );

    setData(lista);
    setTotalDocumentos(totalDocumentos);
  }


  useEffect(() => {
    dadosStatusTotal();
  }, []);

  useEffect(() => {
    if (dataItemFilter && dataItemFilter.length > 0) {
      montarGrafico(dataItemFilter);
    }
  }, [dataItemFilter, selectedItem]);
  
  async function handleClick(data: any) {
    const nome = data.name;
    let resp;
  
    if (selectedItem === nome) {
      resp = await getData('', '', '');
      setSelectedItem('');
    } else {
      resp = await getData(nome, '', '');
      setSelectedItem(nome)
    }
  
    setDataItemFilter(resp); // Atualiza a variável global do contexto
  }

  useEffect(() => {
    if (selectedItem) {
      // Se houver um item selecionado, pega apenas o valor desse item
      const selectedData = data.find((item) => item.name === selectedItem);
      setTotalDocumentos(selectedData ? selectedData.value : 0);
    } else {
      // Se não houver seleção, soma todos os valores
      setTotalDocumentos(data.reduce((acc, item) => acc + item.value, 0));
    }
  }, [selectedItem, data]); // Dependências: atualiza sempre que selectedItem ou data mudar
  

  const chartConfig = {
    QUANTIDADE: {
      label: "QUANTIDADE",
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
        <CardTitle>Documentos por Status</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={filteredData}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              strokeWidth={5}
              onClick={(entry) => handleClick(entry)}
            >
              {filteredData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    selectedItem === entry.name
                      ? selectedColor ?? colors[index % colors.length]
                      : colors[index % colors.length]
                  }
                />
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
        <div className="text-sm mt-2 grid grid-cols-3 gap-1">
          {filteredData.slice(0, 3).map((entry, index) => (
            <div
              key={`legend-${index}`}
              className="flex items-center space-x-2"
            >
              <div
                className="w-4 h-4"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <span>
                {entry.name}: {entry.value}
              </span>
            </div>
          ))}
          <div className="col-span-3 flex justify-center space-x-8 mt-2">
            {filteredData.slice(3).map((entry, index) => (
              <div
                key={`legend-${index + 3}`}
                className="flex items-center space-x-2"
              >
                <div
                  className="w-4 h-4"
                  style={{
                    backgroundColor: colors[(index + 3) % colors.length],
                  }}
                ></div>
                <span>
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
