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
    let criteriaHTML = "";
    for (let criteria of item.criterias) {
      if (criteria.new_name || criteria.new_name === "") {
        criteriaHTML += `<span class="badge bg-secondary">${criteria.criteria.title}</span> `;
      }
    }
    <RubricCard key="1" title=""/>
    listHtml += `<div class="col">
    <div class="card h-100">
      <div class="card-body">
        <h5 class="card-title">${item.title} <span class="badge bg-info text-dark">${item.activity.name}</span></h5>
        <h6 class="card-subtitle mb-2 text-muted">By ${item.userId.firstname} ${item.userId.lastname} </h6>
        ${criteriaHTML}
        <hr>
        <div class="d-flex flex-row justify-content-between">
          <div class="d-flex flex-row">
            <div class="me-1">
              <a href="/rubric/${item._id.toString()}" class="btn btn-primary">View</a>
            </div>
            <div class="me-1">
              <form action="/download-rubric/${item._id.toString()}">
                <input type="hidden" value="${csrf}" name="_csrf">
                <button class="btn btn-dark">Download</button>
              </form>
            </div>
          </div>
          <div class="">
            <p class=""><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
<path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
<path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
</svg> : ${item.views} | <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-circle" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>
</svg> : ${item.downloads}</p>
          </div>
        </div>
      </div>
      <div class="card-footer">
        <small class="text-muted">Created ${item.timeAgoText}</small>
      </div>
    </div>
  </div>`;
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