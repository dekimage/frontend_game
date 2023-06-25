import React, { useState } from "react";
import { GET_CONTENT } from "@/GQL/query";
import { withUser } from "@/Hoc/withUser";
import styles from "@/styles/ContentStats.module.scss";

const getBackgroundColor = (progress) => {
  if (progress >= 100) {
    return "green";
  } else if (progress >= 76) {
    return "lightgreen";
  } else if (progress >= 51) {
    return "yellow";
  } else if (progress >= 26) {
    return "orange";
  } else {
    return "red";
  }
}; // @CALC
export const maxProgressPerContentType = {
  ideas: 3,
  exercises: 5,
  stories: 1,
  faqs: 2,
  casestudies: 1,
  tips: 3,
  metaphores: 3,
  experiments: 2,
  expertopinions: 3,
  quotes: 5,
  questions: 3,
  actions: 3,
};

const CardTable = ({ cards, selectedProperty }) => {
  // Filter cards based on the selected property
  const filteredCards = cards.filter((card) => card[selectedProperty]);

  // Generate the table data
  const tableData = filteredCards.map((card) => {
    const totalCount = Array.isArray(card[selectedProperty])
      ? card[selectedProperty].length
      : 0;
    const maxEntries =
      maxProgressPerContentType[selectedProperty.toLowerCase()];
    const progress = totalCount === 0 ? 0 : (totalCount / maxEntries) * 100;
    const backgroundColor = getBackgroundColor(progress);
    return [
      card.name,
      totalCount,
      maxEntries,
      `${progress.toFixed(0)}%`,
      <span style={{ backgroundColor }}>
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
      </span>,
    ];
  });

  return (
    <div>
      <div className="flex_center">
        <h3>{selectedProperty}</h3>
      </div>
      <table className={styles.table}>
        <tbody>
          <tr>
            <th>Card Name</th>
            <th>Total Count</th>
            <th>Max Entries</th>
            <th>Progress</th>
            <th>Alert</th>
          </tr>
          {tableData.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

function TableComponent({ data, handleClick }) {
  return (
    <table className={styles.table}>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td onClick={() => handleClick(row[cellIndex])} key={cellIndex}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const ContentStats = ({ data }) => {
  const [selectedProperty, setSelectedProperty] = useState("ideas");

  const handleClick = (property) => {
    setSelectedProperty(property.toLowerCase());
    // Perform any other actions based on the selected property
  };
  console.log(data);
  const { cards } = data;
  const tableData = [];
  const ignoredAttributes = ["id", "name", "__typename", "expansion"];

  // Helper function to calculate the count for a property
  const calculateCount = (cards, property) => {
    return cards.reduce((count, card) => {
      if (!ignoredAttributes.includes(property) && card[property]) {
        if (Array.isArray(card[property])) {
          return count + card[property].length;
        } else if (typeof card[property] === "object") {
          return count + Object.keys(card[property]).length;
        }
      }
      return count;
    }, 0);
  };

  // Generate the header row
  const headerRow = Object.keys(cards[0])
    .filter((property) => !ignoredAttributes.includes(property))
    .map((property) => property.toUpperCase());
  tableData.push(headerRow);

  // Generate the count row
  const countRow = Object.keys(cards[0])
    .filter((property) => !ignoredAttributes.includes(property))
    .map((property) => calculateCount(cards, property));
  tableData.push(countRow);

  // Generate the maximum entries row
  const maxEntriesRow = headerRow.map((property) => {
    const maxEntries = maxProgressPerContentType[property.toLowerCase()];
    const totalCards = cards.length;
    return maxEntries * totalCards;
  });
  tableData.push(maxEntriesRow);

  // Generate the progress row
  const progressRow = countRow.map((count, index) => {
    const maxEntries = maxEntriesRow[index];
    const progress = count === 0 ? 0 : (count / maxEntries) * 100;
    return `${progress.toFixed(0)}%`;
  });
  tableData.push(progressRow);

  console.log(tableData);

  // Output:
  // [
  //   ['ACTIONS', 'CASESTUDIES', 'EXERCISES', 'EXPANSION', ...],
  //   [totalActions, totalCaseStudies, totalExercises, totalExpansion, ...]
  // ]

  return (
    <div>
      <TableComponent data={tableData} handleClick={handleClick} />
      <CardTable cards={cards} selectedProperty={selectedProperty} />
    </div>
  );
};

export default withUser(ContentStats, GET_CONTENT);
