import dayjs from 'dayjs';
import { utils, writeFile } from 'xlsx';

type ColumnHeaderMapping = Record<string, string>;

const camelCaseToTitleCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
};

export function handleExportExcel(
  data: readonly object[] | undefined,
  fileName: string,
  userDateFormat: string,
  excludeColumns?: string[],
  preserveOriginalCase?: string[],
  columnHeaderMapping?: ColumnHeaderMapping,
) {
  if (!Array.isArray(data) || data.length === 0) {
    return;
  }

  const firstItem = data[0];
  const formattedHeaders: string[] = [];
  const excludedColumnIndexes: number[] = [];

  Object.keys(firstItem).forEach((columnKey, index) => {
    const headerText = columnHeaderMapping && Object.hasOwn(columnHeaderMapping, columnKey)
      ? columnHeaderMapping[columnKey]
      : columnKey;

    if (excludeColumns?.includes(columnKey)) {
      excludedColumnIndexes.push(index);
      return;
    }

    if (preserveOriginalCase?.length) {
      const matchingColumn = preserveOriginalCase.find((value) =>
        value.replace(/\s/g, '').toLowerCase().includes(headerText.replace(/\s/g, '').toLowerCase()),
      );

      formattedHeaders.push(matchingColumn ?? camelCaseToTitleCase(headerText));
      return;
    }

    formattedHeaders.push(camelCaseToTitleCase(headerText));
  });

  const tableData = [
    formattedHeaders,
    ...data.map((item) => Object.values(item).filter((_, index) => !excludedColumnIndexes.includes(index))),
  ];

  const worksheet = utils.aoa_to_sheet(tableData);

  if (worksheet['!ref']) {
    const headerRange = utils.decode_range(worksheet['!ref']);

    for (let col = headerRange.s.c; col <= headerRange.e.c; col += 1) {
      const headerCell = utils.encode_cell({ r: 0, c: col });

      if (!worksheet[headerCell].s) {
        worksheet[headerCell].s = {};
      }

      worksheet[headerCell].s.font = { ...worksheet[headerCell].s.font, bold: true };
    }
  }

  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'Data');
  const excelFileName = `${fileName}_${dayjs().format(`${userDateFormat}_HH-mm`)}.xlsx`;

  writeFile(workbook, excelFileName);
}
