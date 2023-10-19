import { Spacer } from "@/components/Layout";
import { Input, Select, Textarea } from "@/components/Input";
import { Button } from "@/components/Button";
import { LoadingDots } from "@/components/LoadingDots";
import { Remarks } from "@/components/Remarks";

import { useCurrentUser } from "@/lib/user";

import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { fetcher } from "@/lib/fetch";

import styles from "./Rubric.module.css";

import { generatePDF } from "@/lib/rubric";

import toast from "react-hot-toast";

export const EmptyCell = () => {
  return (
    <>
      <p class="card-text placeholder-glow">
        <span class="placeholder col-12"></span>
        <span class="placeholder col-10"></span>
        <span class="placeholder col-11"></span>
        <span class="placeholder col-12"></span>
        <span class="placeholder col-5"></span>
      </p>
    </>
  );
};

export const Rubric = ({ rubric, loading, updateRubric }) => {
  const userResponse = useCurrentUser();
  const user = userResponse.data;
  const error = userResponse.error;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user && !error) return;
    if (!user.user) {
      router.replace("/login");
    }
  }, [router, user, error]);

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

  const onPublish = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const isRubricLogAdded = await fetcher("/api/rubric/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          statusName: "Published",
          rubricId: rubric._id,
        }),
      });

      const response = await fetcher("/api/rubric/published", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rubricId: rubric._id,
        }),
      });
      if (response.isPublished == 1) {
        toast.success("The rubric has been published.");
        updateRubric();
      } else {
        throw Error("There's a problem publishing rubric.");
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onUnpublish = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const isRubricLogAdded = await fetcher("/api/rubric/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          statusName: "Unpublished",
          rubricId: rubric._id,
        }),
      });

      const response = await fetcher("/api/rubric/unpublished", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rubricId: rubric._id,
        }),
      });
      if (response.isUnpublished == 1) {
        toast.success("The rubric has been unpublished.");
        updateRubric();
      } else {
        throw Error("There's a problem unpublishing rubric.");
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onUse = () => {
    router.replace(`/rubrics/${rubric._id}/use`);
  };

  const onDelete = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true)
      const response = await fetcher(`/api/rubric/${rubric._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rubricId: rubric._id,
        }),
      })

      router.replace(`/user/teacher/rubrics`);
      toast.success(response.message);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between">
        <div className={styles.fillSpace}>
          <h1 className="col-8">
            {loading ? (
              <>
                <p class="placeholder-glow">
                  <span className="placeholder col-12"></span>
                </p>
              </>
            ) : (
              <>
                {rubric.title + " "}
                <span className="badge bg-info text-dark">
                  {rubric.activity.name}
                </span>
              </>
            )}
          </h1>
          <h5>
            {loading ? (
              <>
                <p class="placeholder-glow">
                  By <span class="placeholder col-4"></span>
                </p>
              </>
            ) : (
              <>
                By {rubric.creator.name}{" "}
                {rubric?.status?.name == "Unpublished" ? (
                  <span className="badge bg-warning">Unpublished</span>
                ) : rubric?.status?.name === "Published" ? (
                  <span className="badge bg-success">Published</span>
                ) : undefined}
              </>
            )}
          </h5>
          {loading ? (
            <>
              <p class="placeholder-glow">
                <span class="placeholder col-2"></span>
              </p>
            </>
          ) : (
            <p>Created {rubric.timeAgoText}</p>
          )}
        </div>

        <div>
          <p>
            Views: {loading ? <LoadingDots /> : rubric.views} | Downloads:{" "}
            {loading ? <LoadingDots /> : rubric.downloads}
          </p>
          {loading ? (
            <>
              <button
                className="btn btn-dark btn-lg me-2 disabled"
                onClick={onDownload}
              >
                Download
              </button>
              <button
                className="btn btn-secondary btn-lg disabled"
                onClick={onUse}
              >
                Use
              </button>
            </>
          ) : (
            <div className={styles.buttonContainer}>
              <button
                className="btn btn-dark btn-lg me-2 mb-2"
                onClick={onDownload}
              >
                Download
              </button>
              <button
                className="btn btn-secondary btn-lg me-2 mb-2"
                onClick={onUse}
              >
                Use
              </button>
              {user?.user?.isAdmin ||
              rubric?.creator?._id === user?.user?._id ? (
                <>
                  {rubric.status.name == "Unpublished" ? (
                    <>
                      <Button
                        type="green"
                        className={`me-2 mb-2`}
                        loading={isLoading}
                        size="large"
                        onClick={onPublish}
                      >
                        Publish
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        type="error"
                        className={`me-2 mb-2`}
                        loading={isLoading}
                        size="large"
                        onClick={onUnpublish}
                      >
                        Unpublish
                      </Button>
                    </>
                  )}
                </>
              ) : undefined}
              <Button
                type={"error"}
                className="btn btn-danger btn-lg me-2 mb-2"
                onClick={onDelete}
                loading={isLoading}
                size={"large"}
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>
      <hr />
      {loading ? undefined : rubric.instructions !== undefined &&
        rubric.instructions !== "" ? (
        <>
          <h3>Instructions</h3>
          <span className={styles.instructions}>{rubric.instructions}</span>
        </>
      ) : undefined}
      <hr />
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">Category</th>
              <th scope="col">
                {rubric?.category_names[3] !== "4"
                  ? rubric?.category_names[3] + " "
                  : "Excellent"}
                (4)
              </th>
              <th scope="col">
                {rubric?.category_names[2] !== "3"
                  ? rubric?.category_names[2] + " "
                  : "Good"}
                (3)
              </th>
              <th scope="col">
                {rubric?.category_names[1] !== "2"
                  ? rubric?.category_names[1] + " "
                  : "Satisfying"}
                (2)
              </th>
              <th scope="col">
                {rubric?.category_names[0] !== "1"
                  ? rubric?.category_names[0] + " "
                  : "Needs Improvement"}
                (1)
              </th>
              <th scope="col">Score</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <>
                {(() => {
                  const emptyCriteria = [];
                  for (let i = 1; i < 6; i++) {
                    emptyCriteria.push(
                      <>
                        <tr>
                          <th scope="row">Criterion Title {i}</th>
                          <td>
                            <EmptyCell />
                          </td>
                          <td>
                            <EmptyCell />
                          </td>
                          <td>
                            <EmptyCell />
                          </td>
                          <td>
                            <EmptyCell />
                          </td>
                          <td> </td>
                        </tr>
                      </>
                    );
                  }
                  return emptyCriteria;
                })()}
              </>
            ) : (
              rubric.criteria.map((criterion) => {
                return (
                  <>
                    {criterion.criteria ? (
                      <>
                        <tr>
                          <th scope="row">
                            {criterion.new_name !== ""
                              ? criterion.new_name
                              : criterion.criteria.title}
                            {criterion.weight ? ` (${criterion.weight}%)` : ""}
                          </th>
                          <td>{criterion.criteria.c4}</td>
                          <td>{criterion.criteria.c3}</td>
                          <td>{criterion.criteria.c2}</td>
                          <td>{criterion.criteria.c1}</td>
                          <td> </td>
                        </tr>
                      </>
                    ) : undefined}
                  </>
                );
              })
            )}
            <tr>
              <th scope="row">
                <strong>TOTAL</strong>
              </th>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <Remarks
        remarks={rubric?.remarks}
        item={rubric}
        type={"rubric"}
        updateRemarks={updateRubric}
      />
    </>
  );
};
