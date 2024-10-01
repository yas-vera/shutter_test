import pdfMake from 'pdfmake/build/pdfmake';
export const exportToPdf = async (tableData: string[][],headers:string[],name: string,widths?:string[]) => {
    pdfMake.fonts = {
      Roboto: {
        normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
        bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
        italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
      }
   }
    const documentDefinition = {
        content: [
          {
            text: `${name}`,
            style: "header"
          },
          {
            table: {
              widths: widths,
              body: [
                headers,
                ...tableData]
            },
            style:"table"
          }
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 5, 0, 5]
          },
          table: {
            margin: [0, 5, 0, 5],
            fontSize: 9
          }
        }
      };
      const pdf = pdfMake.createPdf(documentDefinition);
      pdf.download(`export_${name}.pdf`);
}