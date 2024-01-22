import { employees } from "./data.js";

const employees_ = convertToLastFirst(employees);

(function init() {
  renderTableRows(employees_);
  addEventListeners();
})();

function addEventListeners() {
  const pagination = document.querySelector(".pagination");
  const paginationButtons = pagination.querySelectorAll("button");
  const tableHeaders = document.querySelectorAll("thead tr th");
  const pageNumberInput = document.querySelector("#currentPage");

  pageNumberInput.addEventListener("change", (event) => {
    const validPageNumbers = Array.from({ length: Math.ceil(employees.length / 10) }, (_, index) => index + 1);
    // console.log(validPageNumbers);

    if (
      event.target.value === "" || // Empty string
      isNaN(Number(event.target.value)) || // Not a number
      !Number.isInteger(Number(event.target.value)) || // Not an integer
      Number(event.target.value) < 1 || // Less than 1
      Number(event.target.value) > validPageNumbers.length // Greater than the number of pages
      // event.target.value.test(/[^0-9]/g) // Contains non-numeric characters
    ) {
      console.log("Invalid page number");
      return;
    }

    if (validPageNumbers.includes(Number(event.target.value))) {
      handlePageInputChange(event);
    }
  });

  paginationButtons.forEach((button) => {
    button.addEventListener("click", handleArrowKeys);
  });

  document.addEventListener("keyup", (event) => {
    if (event.ctrlKey && event.key === "ArrowLeft") {
      handleArrowKeys({ target: { parentElement: { id: "previous" } } });
    }

    if (event.ctrlKey && event.key === "ArrowRight") {
      handleArrowKeys({ target: { parentElement: { id: "next" } } });
    }
  });

  tableHeaders.forEach((header) => {
    header.addEventListener("click", handleSorting);
  });
}

function renderTableRows(data, start = 0, end = 10) {
  const tableBody = document.querySelector("tbody");
  tableBody.innerHTML = ""; // Clear the table body
  const employees = data;

  employees.slice(start, end).forEach((employee, i) => {
    const row = document.createElement("tr");
    row.classList.add("employee");
    row.innerHTML = `
        <td class="id">${employee.id}</td>
        <td class="name">
          <input type="text" disabled name="person-name-${employee.id}" value="${employee.name}" />
        </td>
        <td class="email">
          <input type="email" disabled name="person-email-${employee.id}" value="${employee.email}" />
        </td>
        <td class="title">
          <input type="text" disabled name="person-title-${employee.id}" value="${employee.title}" />
        </td>
        <td class="actions">
          
        </td>
    `;
    tableBody.appendChild(row);
  });
}

function handlePageInputChange(event) {
  const pageNumber = Number(event.target.value);
  const maxPageNumber = Math.ceil(employees.length / 10);
  const start = (pageNumber - 1) * 10;
  const end = pageNumber * 10;

  if (pageNumber > maxPageNumber) {
    event.target.value = maxPageNumber;
    renderTableRows(employees_, (maxPageNumber - 1) * 10, maxPageNumber * 10);
    return;
  }

  if (pageNumber < 1) {
    event.target.value = 1;
    renderTableRows(employees_, 0, 10);
    return;
  }

  renderTableRows(employees_, start, end);
}

function handleSorting(event) {
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
}

function handleArrowKeys(event) {
  const pageNumberInput = document.querySelector("#currentPage");
  const totalPages = document.querySelector("#totalPages");
  const pageNumber = Number(pageNumberInput.value);
  const maxPageNumber = Math.ceil(employees.length / 10);

  totalPages.textContent = maxPageNumber;

  if (event.target.parentElement.id === "next") {
    if (pageNumber < maxPageNumber) {
      pageNumberInput.value = pageNumber + 1;
      renderTableRows(employees_, pageNumber * 10, (pageNumber + 1) * 10);
    } else {
      pageNumberInput.value = 1; // Go to the first page
      renderTableRows(employees_, 0, 10);
    }
  }

  if (event.target.parentElement.id === "previous") {
    if (pageNumber > 1) {
      pageNumberInput.value = pageNumber - 1;
      renderTableRows(employees_, (pageNumber - 2) * 10, (pageNumber - 1) * 10);
    } else {
      pageNumberInput.value = maxPageNumber; // Go to the last page
      renderTableRows(employees_, (maxPageNumber - 1) * 10, maxPageNumber * 10);
    }
  }
}

function sortTableByColumn(columnName, order = "ascending") {
  const sortedData = employees_.sort((a, b) => {
    if (order === "ascending") {
      return a[columnName] > b[columnName] ? 1 : -1;
    }

    if (order === "descending") {
      return a[columnName] < b[columnName] ? 1 : -1;
    }
  });

  renderTableRows(sortedData);
}

function lastFirst(name) {
  const [first, last] = name.split(" ");
  return `${last}, ${first}`;
}

function convertToLastFirst(array) {
  return array.map((employee) => {
    return { ...employee, name: lastFirst(employee.name) };
  });
}
