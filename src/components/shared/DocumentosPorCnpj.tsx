import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList, Cell } from 'recharts';
import { fetchQuery } from '@/lib/query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useSelection } from '@/context/SelectionContext';

interface DataItem {
  CNPJ: string;
  QUANTIDADE: number;
}

export default function ConsultaPorCNPJ() {
  const [data, setData] = useState<DataItem[]>([]);
  const { selectedItem, setSelectedItem } = useSelection();

  async function consultaCNPJ() {
    let consulta = `
        SELECT CNPJ, COUNT(*) AS QUANTIDADE
        FROM AD_TGFASSUNTOREG
        GROUP BY CNPJ
        ORDER BY QUANTIDADE DESC;
    `;
    try {
      const response = await fetchQuery(consulta);
      if (response && response.length > 0) {
        const chartData = response.map((item: DataItem) => ({
          CNPJ: item.CNPJ,
          QUANTIDADE: item.QUANTIDADE,
        }));

        // Atualiza o estado com os dados do gráfico
        setData(chartData);
      }
    } catch (error) {
      console.error('Erro ao buscar os dados', error);
    }
  }

  const chartConfig = {
    CNPJ: {
      label: 'CNPJ',
      color: 'hsl(var(--chart-1))',
    },
    QUANTIDADE: {
      label: 'QUANTIDADE',
      color: 'hsl(var(--chart-2))',
    },
    label: {
      color: 'hsl(var(--background))',
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

  useEffect(() => {
    consultaCNPJ();
  }, []);

  const handleClick = (data: any) => {
    if (selectedItem === data.CNPJ) {
      setSelectedItem(undefined);
    } else {
      setSelectedItem(data.CNPJ);
    }
  };

  const filteredData = selectedItem ? data.filter(item => item.CNPJ === selectedItem) : data;
  const selectedColor = selectedItem ? colors[data.findIndex(item => item.CNPJ === selectedItem) % colors.length] : colors[0];



  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Documentos por CNPJ</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full" style={{ width: '100%', maxWidth: '600px' }}>
          <BarChart accessibilityLayer data={filteredData} layout="vertical" margin={{ right: 16, left: 16 }}>
            <CartesianGrid horizontal={false} />
            <YAxis dataKey="CNPJ" type="category" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} hide />
            <XAxis dataKey="QUANTIDADE" type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Bar dataKey="QUANTIDADE" layout="vertical" fill="var(--color-QUANTIDADE)" radius={4} onClick={(entry) => handleClick(entry)}>
              {filteredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={selectedItem === entry.CNPJ ? selectedColor ?? colors[index % colors.length] : colors[index % colors.length]} />
              ))}
              <LabelList dataKey="CNPJ" position="insideLeft" offset={8} className="fill-[--color-label]" fontSize={10} />
              <LabelList dataKey="QUANTIDADE" position="right" offset={8} className="fill-foreground" fontSize={10} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
