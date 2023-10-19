const Filter = ({ tags, setFilter, isLoading }) => {
  const onClick = (e) => {
    setFilter(e.target.innerHTML);
  };

  return (
    <>
      <hr />
      <div className="d-flex flex-row">
        {isLoading ? (
          <>
            <span className="badge rounded-pill bg-secondary m-2">#####</span>
            <span className="badge rounded-pill bg-secondary m-2">#####</span>
            <span className="badge rounded-pill bg-secondary m-2">#####</span>
          </>
        ) : (
          <>
            {tags?.map((tag) => {
              return (
                <>
                  <a href="#" onClick={onClick}>
                    <span className="badge rounded-pill bg-secondary m-2">
                      {tag.abbv || tag.name}
                    </span>
                  </a>
                </>
              );
            })}
          </>
        )}
      </div>
      <hr />
    </>
  );
};

export default Filter;
