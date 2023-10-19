const PageWrapper = ({ children, className }) => {
    return (
      <div
        className={`page-wrapper`}
      >
        {children}
      </div>
    );
  };
  
  export default PageWrapper;
  