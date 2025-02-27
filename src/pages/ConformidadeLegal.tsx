import DocumentosPorStatus from "../components/shared/DocumentosPorStatus";
import DocumentosPorCnpj from "../components/shared/DocumentosPorCnpj";
import DocumentosPorEsfera from "../components/shared/DocumentosPorEsfera";
import DocumentosTabela from "../components/shared/DocumentosTabelas";
import logo from "../assets/logo.png";
// import { fetchQuery } from "@/lib/query";
import { dadosMocados } from "@/assets/mock";

export default function ConformidadeLegal() {
  async function getData(status: string, esfera: string, cnpj: string) {
//     let consulta = `
//             SELECT 
//     COALESCE(CNPJ, '') AS CNPJ, 
//     COALESCE(DOC, '') AS DOC, 
//     COALESCE(ORG, '') AS ORG, 
//     COALESCE(SANKHYA.OPTION_LABEL('AD_TGFASSUNTOREG', 'ESFERA', ESFERA), '') AS NOME_COMPLETO, 
//     COALESCE(DTEMI, '') AS DTEMI, 
//     COALESCE(DTVENC, '') AS DTVENC, 
//     COALESCE(SANKHYA.OPTION_LABEL('AD_TGFASSUNTOREG', 'STATUS', STATUS), '') AS OPCAO, 
//     COALESCE(OBS, '') AS OBS  
// FROM 
//     AD_TGFASSUNTOREG 
// WHERE 
//     (${
//       status
//         ? "SANKHYA.OPTION_LABEL('AD_TGFASSUNTOREG', 'STATUS', STATUS) = '" +
//           status +
//           "'"
//         : "1=1"
//     }) 
//     AND (${
//       esfera
//         ? "SANKHYA.OPTION_LABEL('AD_TGFASSUNTOREG', 'ESFERA', ESFERA) = '" +
//           esfera +
//           "'"
//         : "1=1"
//     }) 
//     AND (${cnpj ? "CNPJ = '" + cnpj + "'" : "1=1"})


//         `;
    try {
      //const response = await fetchQuery(dadosMocados);
      // console.log("Dados recebidos:", consulta);
      //return response;
      return dadosMocados(status, esfera, cnpj);
    } catch (error) {
      console.error("Erro ao buscar os dados", error);
    }
  }

  return (
    <div className="w-full h-full min-h-screen flex flex-col bg-[#10274C]">
      <img src={logo} alt="Logo" className="mx-auto my-2 w-40 h-auto" />
      <div className="mx-auto p-4 bg-gray-200 flex-grow w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
          <div className="col-span-12 md:col-span-4 h-full bg-white p-4 shadow rounded">
            <DocumentosPorStatus getData={getData} />
          </div>
          <div className="col-span-12 md:col-span-4 h-full bg-white p-4 shadow rounded">
            <DocumentosPorCnpj getData={getData} />
          </div>
          <div className="col-span-12 md:col-span-4 h-full bg-white p-4 shadow rounded">
            <DocumentosPorEsfera getData={getData} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 flex-grow">
          <div className="flex-1 h-full bg-white p-4 shadow rounded">
            <DocumentosTabela getData={getData} />
          </div>
        </div>
      </div>
    </div>
  );
}
