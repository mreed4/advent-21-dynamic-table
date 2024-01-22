import { data } from "./data.js";

(function init() {
  renderTableRows(data);
  addEventListeners();
})();

function addEventListeners() {
  const pagination = document.querySelector(".pagination");
  const paginationButtons = pagination.querySelectorAll("button");
  const tableHeaders = document.querySelectorAll("thead tr th");

  paginationButtons.forEach((button) => {
    button.addEventListener("click", handlePagination);
  });

  document.addEventListener("keyup", (event) => {
    if (event.ctrlKey && event.key === "ArrowLeft") {
      handlePagination({ target: { parentElement: { id: "previous" } } });
    }

    if (event.ctrlKey && event.key === "ArrowRight") {
      handlePagination({ target: { parentElement: { id: "next" } } });
    }
  });

  tableHeaders.forEach((header) => {
    header.addEventListener("click", (event) => {
      const allSortButtons = document.querySelectorAll("button.sort");
      const button = event.currentTarget.children[0];
      const columnName = button.id.replace("sort__", "");

      if (!button.classList.contains("ascending")) {
        allSortButtons.forEach((sortButton) => {
          sortButton.classList.remove("ascending");
          sortButton.classList.remove("descending");
        });
        button.classList.add("ascending");
        sortTableByColumn(columnName, "ascending");
        return;
      }

      if (button.classList.contains("ascending")) {
        button.classList.remove("ascending");
        button.classList.add("descending");
        sortTableByColumn(columnName, "descending");
        return;
      }

      if (button.classList.contains("descending")) {
        button.classList.remove("descending");
        button.classList.add("ascending");
        sortTableByColumn(columnName, "ascending");
        return;
      }

      // sortTableByColumn(columnName, order);
    });
  });
}

function renderTableRows(data, start = 0, end = 10) {
  const tableBody = document.querySelector("tbody");
  tableBody.innerHTML = "";

  data.slice(start, end).forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td class="id">${item.id}</td>
        <td class="name">
          <input type="text" disabled name="person-name-${item.id}" value="${item.name}" />
        </td>
        <td class="email">
          <input type="email" disabled name="person-email-${item.id}" value="${item.email}" />
        </td>
        <td class="title">
          <input type="text" disabled name="person-title-${item.id}" value="${item.title}" />
        </td>
        <td class="actions">
          
        </td>
    `;
    tableBody.appendChild(row);
  });
}

function handlePagination(event) {
  const pageNumberInput = document.querySelector("#currentPage");
  const totalPages = document.querySelector("#totalPages");
  const pageNumber = Number(pageNumberInput.value);
  const maxPageNumber = Math.ceil(data.length / 10);

  totalPages.textContent = maxPageNumber;

  if (event.target.parentElement.id === "next") {
    if (pageNumber < maxPageNumber) {
      pageNumberInput.value = pageNumber + 1;
      renderTableRows(data, pageNumber * 10, (pageNumber + 1) * 10);
    } else {
      pageNumberInput.value = 1; // Go back to the first page
      renderTableRows(data, 0, 10);
    }
  }

  if (event.target.parentElement.id === "previous") {
    if (pageNumber > 1) {
      pageNumberInput.value = pageNumber - 1;
      renderTableRows(data, (pageNumber - 2) * 10, (pageNumber - 1) * 10);
    } else {
      pageNumberInput.value = maxPageNumber; // Go to the last page
      renderTableRows(data, (maxPageNumber - 1) * 10, maxPageNumber * 10);
    }
  }
}

function sortTableByColumn(columnName, order = "ascending") {
  const sortedData = data.sort((a, b) => {
    if (order === "ascending") {
      return a[columnName] > b[columnName] ? 1 : -1;
    }

    if (order === "descending") {
      return a[columnName] < b[columnName] ? 1 : -1;
    }
  });

  renderTableRows(sortedData);
}
