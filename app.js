import { data } from "./data.js";

(function init() {
  renderTableRows(data);
  addEventListeners();
})();

function addEventListeners() {
  const pagination = document.querySelector(".pagination");
  const paginationButtons = pagination.querySelectorAll("button");

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
          <button class="update" name="person-update-${item.id} id="personUpdate${item.id}">
            <img src="./images/update.svg" alt="Update" class="update" />
          </button>
          <button class="edit" name="person-edit-${item.id}" id="personEdit${item.id}">
            <img src="./images/edit.svg" alt="Edit" class="edit" />
          </button>
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

function sortTableByColumn(columnName, order = "asc") {
  const sortedData = data.sort((a, b) => {
    if (order === "asc") {
      return a[columnName] > b[columnName] ? 1 : -1;
    } else {
      return a[columnName] < b[columnName] ? 1 : -1;
    }
  });

  renderTableRows();
}
