const pageItems = document.getElementsByClassName("page-item");
const pageNumbers = document.getElementsByClassName("page-number");
const list = document.getElementById("list");

var result = items.reduce((resultArray, item, index) => {
  const chunkIndex = Math.floor(index / perPage);

  if (!resultArray[chunkIndex]) {
    resultArray[chunkIndex] = []; // start a new chunk
  }

  resultArray[chunkIndex].push(item);

  return resultArray;
}, []);

for (let pageNumber of pageNumbers) {
  // let listHtml = "";
  pageNumber.onclick = () => {
    setListHTML(pageNumber);
  };
}

// HELPER FUNCTION TO SET THE HTML OF THE TABLE
const setListHTML = (pageNumber) => {
  list.innerHTML = ``;
  setActivePage(pageNumber.value + 1);
  let listHtml = constructListHTML(pageNumber);
  list.innerHTML = listHtml;
}

// HELPER FUNCTION TO CREATE THE HTML OF TABLE DEPENDING ON PAGE NUMBER
const constructListHTML = (pageNumber) => {
  let listHtml = "";
  const itemsOnPage = result[pageNumber.value];
  for (let item of itemsOnPage) {
    const createdAt = new Date(item.createdAt);
    listHtml += `<li class="list-group-item">
      <div class="card-group">
        <div class="card text-white bg-secondary">
          <div class="card-body">
            <h5 class="card-title text-light">${
              item.title
            } <span class="badge bg-info text-dark">${
      item.activity.name
    }</span></h5>
            <p class="card-text"><small class="text-white">${
              createdAt.getMonth() +
              "/" +
              createdAt.getDate() +
              "/" +
              createdAt.getYear() +
              " " +
              createdAt.getHours() +
              ":" +
              createdAt.getMinutes()
            }</small>
              ${(() => {
                if (item.status.name === "Pending") {
                  return `<span class="badge bg-warning">Pending</span>`;
                } else if (item.status.name === "Approved") {
                  return `<span class="badge bg-success">Approved</span>`;
                } else if (item.status.name === "Rejected") {
                  return `<span class="badge bg-danger">Rejected</span>`;
                }
              })()}
            </p>
            <a class="btn btn-dark" href="/teacher/criteria/${
              item._id
            }">View</a>
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Excellent (4)</h5>
            ${(() => {
              if (item.c4.length > 100) {
                return `<p class="card-text">
                  ${item.c4.substring(0, 50)}...
                </p>`;
              } else {
                return `<p class="card-text">${item.c4}</p>`;
              }
            })()}
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Good (3)</h5>
            ${(() => {
              if (item.c3.length > 100) {
                return `<p class="card-text">
                  ${item.c3.substring(0, 50)}...
                </p>`;
              } else {
                return `<p class="card-text">${item.c3}</p>`;
              }
            })()}
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Satisfactory (2)</h5>
            ${(() => {
              if (item.c2.length > 100) {
                return `<p class="card-text">
                  ${item.c2.substring(0, 50)}...
                </p>`;
              } else {
                return `<p class="card-text">${item.c2}</p>`;
              }
            })()}
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Needs Improvement (1)</h5>
            ${(() => {
              if (item.c1.length > 100) {
                return `<p class="card-text">
                  ${item.c1.substring(0, 50)}...
                </p>`;
              } else {
                return `<p class="card-text">${item.c1}</p>`;
              }
            })()}
          </div>
        </div>
      </div>
    </li>`;
  }
  return listHtml;
}

// ADD HERE THE LOGIC FOR CLICKING THE NEXT AND PREVIOUS BUTTONS

const setActivePage = (page) => {
  const previousButton = pageItems[0];
  const nextButton = pageItems[pageItems.length-1];

  for (let i = 0; i < pageNumbers.length; i++) {
    const pageNumber = pageNumbers[i];
    if (pageNumber.classList.contains("active")) {
      pageNumber.classList.remove("active");
    }

    if (i == page - 1) {
      pageNumber.classList.add("active");
    }
  }

  for (let i = 0; i < pageItems.length; i++) {
    const pageItem = pageItems[i];
    if (page == 1 && pageItem.classList.contains("previous")) {
      previousButton.classList.add("disabled");
      nextButton.classList.remove("disabled");
      nextButton.onclick = () => {
        setListHTML(pageNumbers[1]);
      }
      break;
    } else if (page > 1 && page < pageItems.length - 2) {
      previousButton.classList.remove("disabled");
      nextButton.classList.remove("disabled");
      // Set link of previous and next
      previousButton.onclick = () => {
        setListHTML(pageNumbers[page-2]);
      }
      nextButton.onclick = () => {
        setListHTML(pageNumbers[page]);
      }
      break;
    } else if (
      page == pageItems.length - 2 &&
      pageItem.classList.contains("next")
    ) {
      nextButton.classList.add("disabled");
      previousButton.classList.remove("disabled");
      previousButton.onclick = () => {
        setListHTML(pageNumbers[pageNumbers.length-2]);
      }
      break;
    }
  }
};

setListHTML(pageNumbers[0]);