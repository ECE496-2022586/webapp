import React from "react";
import { useTable } from "react-table";

export default function Table({ columns, data, actionOnClick }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({ columns, data, initialState: {hiddenColumns: ["hash","link"]}});

  return (
    <table {...getTableProps()} className="myTable2">
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}  class="myTable">{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} className="tableRow">
              {row.cells.map(cell => {
                return <td onClick={() => actionOnClick(cell?.row?.original)} {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
