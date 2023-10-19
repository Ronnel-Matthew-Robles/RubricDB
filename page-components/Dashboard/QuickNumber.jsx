import styles from './QuickNumber.module.css';

export const QuickNumber = ({
  quickStatA,
  quickStatB,
  iconName,
  action,
  loading,
}) => {
  if (loading) {
    return (
      <>
        <p className="placeholder-glow">
          <span className="placeholder col-8"></span>
        </p>
      </>
    );
  }

  return (
    <div className="d-flex">
      <i className={`mdi ${iconName} me-3`}></i>
      {quickStatA.length == quickStatB.length ? (
        <p className={styles.quickNumberText}>
          There {quickStatA.length == 1 ? "was" : "were"}{" "}
          <strong>{quickStatA.length}</strong>{" "}
          {quickStatA.length == 1 ? "rubric" : "rubrics"} {action} in the past
          24 hours
        </p>
      ) : (
        <p className={styles.quickNumberText}>
          There {quickStatA.length == 1 ? "was" : "were"}{" "}
          <strong>{quickStatA.length}</strong>{" "}
          {quickStatA.length == 1 ? "rubric" : "rubrics"} {action} in the past
          24 hours and <strong>{quickStatB.length}</strong> in the last 7 days.
        </p>
      )}
    </div>
  );
};
