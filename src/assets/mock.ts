export const test = [
    {
      "CNPJ": "EVC Matriz",
      "DOC": "ART do Paulo Henrique",
      "DTEMI": "19112024 00:00:00",
      "DTVENC": "19052025 00:00:00",
      "NOME_COMPLETO": "Federal",
      "OBS": "Emitido pelo Conselho Regional de Química da 10º Região.",
      "OPCAO": "OK",
      "ORG": "CRQ"
    },
    {
      "CNPJ": "EVC Filial 1",
      "DOC": "ART do João Silva",
      "DTEMI": "20102024 00:00:00",
      "DTVENC": "19102025 00:00:00",
      "NOME_COMPLETO": "Estadual",
      "OBS": "Documento válido para operações locais.",
      "OPCAO": "OK",
      "ORG": "CRQ"
    },
    {
      "CNPJ": "EVC Filial 2",
      "DOC": "ART do Ana Souza",
      "DTEMI": "01012024 00:00:00",
      "DTVENC": "31122024 00:00:00",
      "NOME_COMPLETO": "Federal",
      "OBS": "Válido para o período especificado.",
      "OPCAO": "OK",
      "ORG": "CRQ"
    },
    {
      "CNPJ": "EVC Filial 3",
      "DOC": "ART do Pedro Lima",
      "DTEMI": "05052024 00:00:00",
      "DTVENC": "04052025 00:00:00",
      "NOME_COMPLETO": "Municipal",
      "OBS": "Documento aceito pelo órgão regulador.",
      "OPCAO": "OK",
      "ORG": "CRQ"
    },
    {
      "CNPJ": "EVC Filial 4",
      "DOC": "ART do Carla Mendes",
      "DTEMI": "12072024 00:00:00",
      "DTVENC": "11072025 00:00:00",
      "NOME_COMPLETO": "Estadual",
      "OBS": "Sem observações adicionais.",
      "OPCAO": "OK",
      "ORG": "CRQ"
    },
  
    // 5 itens "OK" adicionais omitidos por brevidade...
  
    {
      "CNPJ": "EVC Matriz",
      "DOC": "ART do Paulo Henrique",
      "DTEMI": "10102023 00:00:00",
      "DTVENC": "09102024 00:00:00",
      "NOME_COMPLETO": "Federal",
      "OBS": "Documento expirado.",
      "OPCAO": "VENCIDO",
      "ORG": "CRQ"
    },
  
    // 9 itens "VENCIDO" adicionais...
  
    {
      "CNPJ": "EVC Matriz",
      "DOC": "ART do Paulo Henrique",
      "DTEMI": "01052024 00:00:00",
      "DTVENC": "31052025 00:00:00",
      "NOME_COMPLETO": "Federal",
      "OBS": "Documento em análise.",
      "OPCAO": "EM ANDAMENTO",
      "ORG": "CRQ"
    },
  
    // 9 itens "EM ANDAMENTO" adicionais...
  
    {
      "CNPJ": "EVC Matriz",
      "DOC": "ART do Paulo Henrique",
      "DTEMI": "15032023 00:00:00",
      "DTVENC": "14032024 00:00:00",
      "NOME_COMPLETO": "Federal",
      "OBS": "Pendente de validação.",
      "OPCAO": "PENDENTE",
      "ORG": "CRQ"
    },
  
    // 9 itens "PENDENTE" adicionais...
  
    {
      "CNPJ": "EVC Matriz",
      "DOC": "ART do Paulo Henrique",
      "DTEMI": "01072025 00:00:00",
      "DTVENC": "30062026 00:00:00",
      "NOME_COMPLETO": "Federal",
      "OBS": "Processo ainda não iniciado.",
      "OPCAO": "NÃO INICIADO",
      "ORG": "CRQ"
    }
  
    // 9 itens "NÃO INICIADO" adicionais...
  ]

  export function dadosMocados (status: string, esfera: string, cnpj: string){
    const retorno = status ? test.filter(e => e.OPCAO == status) : ( esfera ? test.filter(e => e.NOME_COMPLETO == esfera) : (cnpj ? test.filter(e => e.CNPJ == cnpj) : test) );
    return retorno;
  }
      