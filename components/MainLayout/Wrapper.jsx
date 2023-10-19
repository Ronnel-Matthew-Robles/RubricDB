const Wrapper = ({ children, className }) => {
  return (
    <div
      id={`main-wrapper`}
      data-layout="vertical"
      data-navbarbg="skin5"
      data-sidebartype="full"
      data-sidebar-position="absolute"
      data-header-position="absolute"
      data-boxed-layout="full"
    >
      {children}
    </div>
  );
};

export default Wrapper;
