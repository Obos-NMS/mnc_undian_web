import React, { useState, useEffect } from "react";
import MyColumn from "./MyColumn";
import MyDataTable from "./MyDataTable";

const ParticipantList = (winners) => {
  const [params, setParams] = useState({ page: 1 });
  const [columns, setColumns] = useState([]);
  console.log(winners);

  useEffect(() => {
    // Get unique columns from the first participant's field values
    if (winners?.participants?.[0]?.participant_field_values) {
      const sortedFields = winners.participants[0].participant_field_values
        .sort(
          (a, b) =>
            a.participant_field_name.index - b.participant_field_name.index
        )
        .map((field) => ({
          id: field.participant_field_name.id,
          name: field.participant_field_name.name,
          index: field.participant_field_name.index,
        }));
      setColumns(sortedFields);
    }
  }, [winners]);

  return (
    <MyDataTable
      values={{
        data: winners?.participants || [],
        meta: {
          total: winners?.participants?.length || 0,
          currentPage: params.page,
          perPage: 5,
        },
      }}
      paginator
      onChangePagination={(page) => {
        setParams((value) => ({ ...value, page: page }));
      }}>
      <MyColumn
        field="identifier_code"
        header="Kode unik undian"
        body={(value) => (
          <p className="text-gray-light/900 text-3xl">
            {value?.identifier_code}
          </p>
        )}
      />

      {columns.filter(column => column.name !== 'No. Urut').map((column) => (
        <MyColumn
          key={column.id}
          header={column.name}
          body={(value) => {
            const fieldValue = value?.participant_field_values?.find(
              (field) => field.participant_field_name.id === column.id
            );
            return (
              <p className="text-gray-light/900 text-3xl truncate">
                {fieldValue?.value ?? ""}
              </p>
            );
          }}
        />
      ))}
    </MyDataTable>
  );
};

export default ParticipantList;
