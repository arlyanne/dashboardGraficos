import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, CartesianGrid, LabelList, Cell } from 'recharts';
import { fetchQuery } from '@/lib/query';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useSelection } from '@/context/SelectionContext';

interface DataItem {
  NOME_COMPLETO: string;
  QUANTIDADE: number;
}

export default function DocumentoPorEsfera() {
  const [data, setData] = useState<DataItem[]>([]);
  const { selectedItem, setSelectedItem } = useSelection();

  async function consultaEsfera() {
    let consulta = `
        SELECT 
            T.ESFERA, 
            T.NOME_COMPLETO, 
            T.QUANTIDADE 
        FROM  
            ( 
                SELECT  
                    ESFERA,  
                    SANKHYA.OPTION_LABEL('AD_TGFASSUNTOREG', 'ESFERA', ESFERA) AS NOME_COMPLETO,  
                    COUNT(*) AS QUANTIDADE 
                FROM  
                    AD_TGFASSUNTOREG 
                GROUP BY  
                    ESFERA,  
                    SANKHYA.OPTION_LABEL('AD_TGFASSUNTOREG', 'ESFERA', ESFERA) 
            ) T 
        ORDER BY  
            T.QUANTIDADE DESC 
    `;
    try {
      const response = await fetchQuery(consulta);
      if (response && response.length > 0) {
        const chartData = response.map((item: DataItem) => ({
          NOME_COMPLETO: item.NOME_COMPLETO,
          QUANTIDADE: item.QUANTIDADE,
        }));

        setData(chartData);
      }
    } catch (error) {
      console.error('Erro ao buscar dados', error);
    }
  }

  useEffect(() => {
    consultaEsfera();
  }, []);

  const handleClick = (data: any) => {
    if (selectedItem === data.NOME_COMPLETO) {
      setSelectedItem(undefined);
    } else {
      setSelectedItem(data.NOME_COMPLETO);
    }
  };

  const chartConfig = {
    desktop: {
      label: 'QUANTIDADE',
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig;

  const colors = [
    '#8884d8',
    '#82ca9d',
    '#ffc658',
    '#ff8042',
    '#8dd1e1',
    '#a4de6c',
    '#d0ed57',
    '#f4e1d2',
  ];

  const filteredData = selectedItem ? data.filter(item => item.NOME_COMPLETO === selectedItem) : data;
  const selectedColor = selectedItem ? colors[data.findIndex(item => item.NOME_COMPLETO === selectedItem) % colors.length] : colors[0];



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
          <BarChart
            accessibilityLayer
            data={filteredData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="NOME_COMPLETO"
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

            <Bar dataKey="QUANTIDADE" onClick={(entry) => handleClick(entry)}>
              {filteredData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={selectedItem === entry.NOME_COMPLETO ? selectedColor ?? colors[index % colors.length] : colors[index % colors.length]} 
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
