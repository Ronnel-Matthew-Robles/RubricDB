const activities = [
  {
    _id: "6221bded5eabd8765bbd72d2",
    name: "Analytic Essay",
    __v: 6,
    criterias: [
      {
        _id: "622417ef17f70866f9f382b2",
        title: "Comprehension of Text",
      },
      {
        _id: "6224181c17f70866f9f382c5",
        title: "Textual Evidence",
      },
      {
        _id: "6224184717f70866f9f382d7",
        title: "Organization",
      },
      {
        _id: "6224186517f70866f9f382e9",
        title: "Formal Voice",
      },
      {
        _id: "6224189317f70866f9f382fb",
        title: "Sentence Fluency & Grammar",
      },
      {
        _id: "622418b517f70866f9f3830d",
        title: "Format",
      },
    ],
    rubrics: [],
  },
  {
    _id: "62241aefaee23525c4cf7316",
    name: "Oral Presentation",
    criterias: [
      {
        _id: "62241aefaee23525c4cf7315",
        title: "Organization",
      },
      {
        _id: "62241b15aee23525c4cf7329",
        title: "Content",
      },
      {
        _id: "62241b35aee23525c4cf733b",
        title: "Delivery",
      },
      {
        _id: "62241b5eaee23525c4cf734d",
        title: "Creativity",
      },
      {
        _id: "62241c35aee23525c4cf7385",
        title: "Length of Presentation",
      },
    ],
    rubrics: [],
    __v: 5,
  },
];

const activitySelect = document.getElementById("activity");
activitySelect.onchange = () => {
  const activity = activitySelect.options[activitySelect.selectedIndex].value;
  updateAllCriteriaAndClearDescriptions(activity);
};

const updateAllCriteriaAndClearDescriptions = (activity) => {
  updateAllSelectCriteria(activity);
  clearDescriptions();
};

const updateAllSelectCriteria = (activity) => {
  for (let a of activityList) {
    if (a._id.toString() === activity) {
      criterias = a.criterias;
    }
  }

  for (let select of selectGroup) {
    let html = '<option value="">None</option>';
    for (let i = 0; i < criterias.length; i++) {
      html += `<option value="${criterias[i]._id.toString()}">${
        criterias[i].title
      }</option>`;

      // CODE TO ADD EVENT HANDLERS
      const index = selectGroup.indexOf(select) + 1;
      const criteriaTitleInput = document.getElementsByName(
        `criteria_title_${index}`
      )[0];
      const criteriaIdInput = document.getElementsByName(
        `criteria_id_${index}`
      )[0];
      select.onchange = () => {
        const selectedCriteriaId = select.options[select.selectedIndex].value;
        for (let criteria of criterias) {
          if (criteria._id.toString() == selectedCriteriaId) {
            const excellent = descriptionGroup[4 * (index - 1) + 0];
            const good = descriptionGroup[4 * (index - 1) + 1];
            const satisfiying = descriptionGroup[4 * (index - 1) + 2];
            const needsImprovement = descriptionGroup[4 * (index - 1) + 3];

            excellent.innerHTML = `<p>${criteria.c4}</p>`;
            good.innerHTML = `<p>${criteria.c3}</p>`;
            satisfiying.innerHTML = `<p>${criteria.c2}</p>`;
            needsImprovement.innerHTML = `<p>${criteria.c1}</p>`;

            criteriaTitleInput.value = criteria.title;
            criteriaIdInput.value = criteria._id.toString();
          }
        }
      };
    }
    select.innerHTML = html;
  }
};

const clearDescriptions = () => {
  for (let description of descriptionGroup) {
    description.innerHTML = `
      <span class="placeholder col-7"></span>
      <span class="placeholder col-4"></span>
      <span class="placeholder col-4"></span>
      <span class="placeholder col-6"></span>
      <span class="placeholder col-8"></span>`;
  }
};
