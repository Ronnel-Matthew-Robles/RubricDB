export const RecentRubric = ({ rubric, loading }) => {
    if (loading) {
      return (
        <>
            <div class="card me-3" style={{width: "18rem"}}>
              <div class="card-body">
                <h5 class="card-title placeholder-glow"><span class="placeholder col-6"></span></h5>
                <h6 class="card-subtitle mb-2 text-body-secondary placeholder-glow">by <span class="placeholder col-4"></span></h6>
                <div className="card-footer">
                </div>
                <small class="text-body-secondary"><span class="placeholder col-5"></span></small>
              </div>
            </div>
        </>
      );
    }
    return (
      <>
          <a href={`/rubrics/${rubric._id}`}>
            <div class="card me-3" style={{width: "18rem"}} key={rubric._id}>
              <div class="card-body">
                <h5 class="card-title">{rubric.title}</h5>
                <h6 class="card-subtitle mb-2 text-body-secondary">by {rubric.name}</h6>
              </div>
                <div class="card-footer"><small class="text-body-secondary">Created {rubric.timeAgoText}</small></div>
            </div>
          </a>
      </>
    );
  };
