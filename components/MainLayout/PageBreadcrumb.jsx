const PageBreadcrumb = ({title, description}) => {
    return (
        <div className={`page-breadcrumb`}>
            <div className={`row align-items-center`}>
                <div className={`col-6`}>
                    <h1 className={`mb-0 fw-bold`}>{title}</h1>
                </div>
                <small className={`text-muted`}>{description}</small>
            </div>
        </div>
    );
}

export default PageBreadcrumb;