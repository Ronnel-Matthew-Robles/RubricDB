export const FrequentTopic = ({ activity, loading }) => {
  if (loading) {
    return (
      <>
        <div className="py-3 d-flex align-items-center">
          <span className="btn btn-primary btn-circle d-flex align-items-center">
            <i className="mdi mdi-note-text"></i>
          </span>
          <div className="ms-3">
            <h5 className="mb-0 fw-bold">Activity</h5>
            <span className="text-muted fs-6"></span>
          </div>
          <div className="ms-auto">
            <span className="badge bg-light text-muted">
              0
            </span>
          </div>
        </div>
      </>
    );
  }

  return (
    <a href={`/create-rubric/${activity._id}`} id={activity._id}>
      <div className="py-3 d-flex align-items-center">
        <span className="btn btn-primary btn-circle d-flex align-items-center">
          <i className="mdi mdi-note-text"></i>
        </span>
        <div className="ms-3">
          <h5 className="mb-0 fw-bold">{activity.name}</h5>
          <span className="text-muted fs-6"></span>
        </div>
        <div className="ms-auto">
          <span className="badge bg-light text-muted">
            {activity.timesUsed}
          </span>
        </div>
      </div>
    </a>
  );
};
