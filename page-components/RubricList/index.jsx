import { Spacer } from "@/components/Layout";
import { LoadingDots } from "@/components/LoadingDots";
import { TextLink } from "@/components/Text";

import { useCurrentUser } from "@/lib/user";

import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { fetcher } from "@/lib/fetch";

import { generatePDF } from "@/lib/rubric";

import toast from "react-hot-toast";

const Rubric = ({ rubric, loading, user }) => {
  const router = useRouter();

  const onView = (e) => {
    try {
      e.preventDefault();
      if (rubric?.creator?._id !== user.user._id) {
        const response = fetch("/api/rubriclog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            actionName: "View",
            rubricId: rubric._id,
          }),
        })
          .then((res) => res.json())
          .then((data) => {});
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      router.replace(`/rubrics/${rubric._id}`);
    }
  };

  const onDownload = (e) => {
    try {
      e.preventDefault();
      if (rubric?.creator?._id !== user.user._id) {
        const response = fetch("/api/rubriclog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            actionName: "Download",
            rubricId: rubric._id,
          }),
        })
          .then((res) => res.json())
          .then((data) => {});
      }

      generatePDF(rubric, user.user);
      toast.success("Your rubric is ready for download.");
    } catch (e) {
      toast.error(e.message);
    }
  };

  const onDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await fetcher(`/api/rubric`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rubricId: rubric._id,
        }),
      });

      toast.success(response.message);
      window.location.reload();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <>
      <div className="col">
        <div className="card h-100">
          <div className="card-body">
            <h5 className="card-title">
              {loading ? (
                <>
                  <p class="card-text placeholder-glow">
                    <span class="placeholder col-12"></span>
                  </p>
                </>
              ) : (
                rubric?.title + " "
              )}

              {loading ? (
                <>
                  <p class="card-text placeholder-glow">
                    <span class="placeholder col-7"></span>
                  </p>
                </>
              ) : (
                <>
                  <span className="badge bg-info text-dark">
                    {rubric?.activity?.name}
                  </span>
                </>
              )}
            </h5>
            <h6 className="card-subtitle mb-2 text-muted">
              {loading ? (
                <>
                  <p class="card-text placeholder-glow">
                    By <span class="placeholder col-3"></span>
                  </p>
                </>
              ) : (
                <>
                  By {rubric?.creator?.name + " "}{" "}
                  {rubric?.status?.name == "Unpublished" ? (
                    <span className="badge bg-warning">Unpublished</span>
                  ) : rubric?.status?.name === "Published" ? (
                    <span className="badge bg-success">Published</span>
                  ) : undefined}
                </>
              )}
            </h6>
            {rubric?.criteria.map((criterion) => {
              return (
                <>
                  {criterion.new_name || criterion.new_name == "" ? (
                    <span className="badge bg-secondary me-1 mb-1">
                      {criterion.criteria.title}
                    </span>
                  ) : undefined}
                </>
              );
            })}
            <hr />
            <div className="d-flex flex-column justify-content-between">
              <div className="d-flex flex-row">
                <div className="me-1">
                  {loading ? (
                    <>
                      <button
                        onClick={onView}
                        className="btn btn-primary disabled"
                      >
                        View
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={onView} className="btn btn-primary">
                        View
                      </button>
                    </>
                  )}
                </div>
                <div className="me-1">
                  {loading ? (
                    <>
                      <button
                        className="btn btn-dark disabled"
                        onClick={onDownload}
                      >
                        Download
                      </button>
                    </>
                  ) : rubric?.status?.name != "Pending" &&
                    rubric?.status?.name != "Rejected" ? (
                    <>
                      <button className="btn btn-dark" onClick={onDownload}>
                        Download
                      </button>
                    </>
                  ) : undefined}
                </div>
                <div className="me-1">
                  {loading ? (
                    <>
                      <button
                        className="btn btn-danger disabled"
                        onClick={onDelete}
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-danger" onClick={onDelete}>
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="">
                <p className="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-eye"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                  </svg>{" "}
                  :{" "}
                  {loading ? (
                    <>
                      <LoadingDots />
                    </>
                  ) : (
                    rubric?.views
                  )}{" "}
                  |{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-arrow-down-circle"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"
                    />
                  </svg>{" "}
                  :{" "}
                  {loading ? (
                    <>
                      <LoadingDots />
                    </>
                  ) : (
                    rubric?.downloads
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <small className="text-muted">
              {loading ? (
                <>
                  <LoadingDots />
                </>
              ) : (
                <>Created {rubric?.timeAgoText}</>
              )}
            </small>
          </div>
        </div>
      </div>
    </>
  );
};

export const RubricList = ({ rubrics, loading }) => {
  const { data, error, mutate } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!data && !error) return;
    if (!data.user) {
      router.replace("/login");
    }
  }, [router, data, error]);

  var perPage = 6;
  var page = 1;

  const [pageNumber, setPageNumber] = useState(page);
  const [items, setItems] = useState([]);

  let pagesHTML = [];

  if (rubrics) {
    var result = rubrics.reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / perPage);

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = []; // start a new chunk
      }

      resultArray[chunkIndex].push(item);

      return resultArray;
    }, []);

    for (let i = 1; i < result.length + 1; i++) {
      pagesHTML.push(i);
    }
  }

  useEffect(() => {
    setItems((result && result[pageNumber - 1]) || rubrics);
  }, [rubrics, pageNumber]);

  const onPrevious = () => {
    setPageNumber(pageNumber - 1);
  };

  const onNext = () => {
    setPageNumber(pageNumber + 1);
  };

  const onChangePage = (specificPageNumber) => {
    setPageNumber(specificPageNumber);
  };

  const onRedirectToCreateRubirc = () => {
    router.replace("/create-rubric");
  };

  return (
    <>
      {loading ? (
        <>
          <Rubric loading={loading} />
          <Rubric loading={loading} />
        </>
      ) : rubrics?.length == 0 ? (
        <>
          <h1>No rubrics found.</h1>
          <p>
            Create a rubric{" "}
            <TextLink onClick={onRedirectToCreateRubirc}>here.</TextLink>
          </p>
        </>
      ) : rubrics ? (
        <>
          <div id="list" className="row row-cols-1 row-cols-md-3 g-4 mb-5">
            {items?.map((rubric) => {
              return <Rubric rubric={rubric} user={data} />;
            })}
          </div>
          <div>
            <nav aria-label="My Rubric Pagination">
              <ul className="pagination justify-content-center">
                {pageNumber == 1 ? (
                  <>
                    <li className="page-item previous disabled">
                      <a
                        className={`page-link`}
                        onClick={onPrevious}
                        href={undefined}
                      >
                        Previous
                      </a>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="page-item previous">
                      <a
                        className={`page-link`}
                        onClick={onPrevious}
                        href={undefined}
                      >
                        Previous
                      </a>
                    </li>
                  </>
                )}
                {pagesHTML.map((i) => {
                  return (
                    <>
                      {pageNumber == i ? (
                        <>
                          <li
                            className={"page-item page-number active"}
                            onClick={() => onChangePage(i)}
                          >
                            <span className={"page-link"}>{i}</span>
                          </li>
                        </>
                      ) : (
                        <>
                          <li
                            className={"page-item page-number"}
                            onClick={() => onChangePage(i)}
                          >
                            <span className={"page-link"}>{i}</span>
                          </li>
                        </>
                      )}
                    </>
                  );
                })}
                {pageNumber == pagesHTML.length ? (
                  <>
                    <li className="page-item next disabled">
                      <a
                        className={`page-link`}
                        onClick={onNext}
                        href={undefined}
                      >
                        Next
                      </a>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="page-item next">
                      <a
                        className={`page-link`}
                        onClick={onNext}
                        href={undefined}
                      >
                        Next
                      </a>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </>
      ) : (
        <h1>No Rubrics</h1>
      )}
    </>
  );
};
