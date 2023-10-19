import { Spacer } from '@/components/Layout';
import { Button, ButtonLink } from '@/components/Button';
import { Textarea } from '@/components/Input';

import toast from 'react-hot-toast';

import { useCurrentUser } from '@/lib/user';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useCurrentUserCriteria } from '@/lib/criterion';
import { fetcher } from '@/lib/fetch';

export const Criterion = ({
  criterion,
  admin,
  isAdmin,
  loading,
  updateCriteria,
}) => {
  let createdAt;
  const remarkRef = useRef();

  if (!loading) {
    createdAt = new Date(criterion?.createdAt);
  }

  const [isLoading, setIsLoading] = useState(false);

  const onApprove = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const isCriterionLogAdded = await fetcher('/api/criteria/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          statusName: 'Approved',
          criterionId: criterion._id,
        }),
      });

      const response = await fetcher('/api/criteria/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityId: criterion.activity._id,
          criterionId: criterion._id,
        }),
      });
      if (response.isApproved == 1 && response.isAdded == 1) {
        toast.success('The criterion has been approved.');
        updateCriteria();
      } else {
        throw Error("There's a problem approving criterion.");
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onReject = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const isCriterionLogAdded = await fetcher('/api/criteria/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          statusName: 'Rejected',
          criterionId: criterion._id,
        }),
      });

      const response = await fetcher('/api/criteria/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          criterionId: criterion._id,
        }),
      });
      if (response.updated == 1) {
        toast.success('The criterion has been rejected.');
        updateCriteria();
      } else {
        throw Error("There's a problem rejecting criterion.");
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onAddRemark = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetcher(`/api/remark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorId: admin.user._id,
          itemId: criterion._id,
          text: remarkRef.current.value,
          type: "criteria"
        }),
      });

      if (response.remark._id && response.addRemarkToItem == 1) {
        toast.success('The remark has been added successfully.');
        remarkRef.current.value = '';
      } else {
        throw Error("There's a problem adding the remark.");
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <li className="list-group-item">
      <div className="card-group">
        <div className="card text-white bg-secondary">
          <div className="card-body">
            <h5 className="card-title text-light">
              {loading ? (
                <>
                  <p class="card-text placeholder-glow">
                    <span class="placeholder col-12"></span>
                  </p>
                </>
              ) : (
                criterion?.title
              )}{' '}
              {loading ? (
                <>
                  <p class="card-text placeholder-glow">
                    <span class="placeholder col-12"></span>
                  </p>
                </>
              ) : (
                <>
                  <span className="badge bg-info text-dark">
                    {criterion?.activity?.name}
                  </span>
                </>
              )}
            </h5>
            <p className="card-text">
              <small className="text-white">
                {loading ? (
                  <>
                    <p class="card-text placeholder-glow">
                      <span class="placeholder col-6"></span>
                    </p>
                  </>
                ) : (
                  `${createdAt.getMonth()}/${createdAt.getDate()}/${createdAt.getYear()} ${createdAt.getHours()}:${createdAt.getMinutes()} `
                )}
              </small>

              <p class="card-text">
                <small class="text-white">
                  {loading ? (
                    <>
                      <p class="card-text placeholder-glow">
                        <span class="placeholder col-4"></span>
                      </p>
                    </>
                  ) : (
                    <>By {criterion?.creator?.name} </>
                  )}
                </small>
                {loading ? (
                  <>
                    <p class="card-text placeholder-glow">
                      <span class="placeholder col-4"></span>
                    </p>
                  </>
                ) : criterion?.status.name === 'Pending' ? (
                  <span className="badge bg-warning">Pending</span>
                ) : criterion?.status.name === 'Approved' ? (
                  <span className="badge bg-success">Approved</span>
                ) : (
                  <span className="badge bg-danger">Rejected</span>
                )}
              </p>
            </p>
            {isAdmin && criterion?.status.name === 'Pending' ? (
              <>
                <div className="d-flex gx-1">
                  <Button
                    type="green"
                    className={`me-1`}
                    onClick={onApprove}
                    loading={isLoading}
                  >
                    Approve
                  </Button>
                  <Button type="error" onClick={onReject} loading={isLoading}>
                    Reject
                  </Button>
                </div>
              </>
            ) : loading ? (
              <>
                <a
                  className="btn btn-dark disabled"
                  href={`/criteria/${criterion?._id}`}
                >
                  View
                </a>
              </>
            ) : (
              <a className="btn btn-dark" href={`/criteria/${criterion?._id}`}>
                View
              </a>
            )}
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Excellent (4)</h5>
            <p className="card-text">
              {loading ? (
                <>
                  <p class="card-text placeholder-glow">
                    <span class="placeholder col-12"></span>
                    <span class="placeholder col-10"></span>
                    <span class="placeholder col-11"></span>
                    <span class="placeholder col-12"></span>
                    <span class="placeholder col-5"></span>
                  </p>
                </>
              ) : criterion?.c4.length > 100 ? (
                criterion?.c4.substring(0, 50) + '...'
              ) : (
                criterion?.c4
              )}
            </p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Good (3)</h5>
            <p className="card-text">
              {loading ? (
                <>
                  <p class="card-text placeholder-glow">
                    <span class="placeholder col-12"></span>
                    <span class="placeholder col-10"></span>
                    <span class="placeholder col-11"></span>
                    <span class="placeholder col-12"></span>
                    <span class="placeholder col-5"></span>
                  </p>
                </>
              ) : criterion?.c3.length > 100 ? (
                criterion?.c3.substring(0, 50) + '...'
              ) : (
                criterion?.c3
              )}
            </p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Satisfactory (2)</h5>
            <p className="card-text">
              {loading ? (
                <>
                  <p class="card-text placeholder-glow">
                    <span class="placeholder col-12"></span>
                    <span class="placeholder col-10"></span>
                    <span class="placeholder col-11"></span>
                    <span class="placeholder col-12"></span>
                    <span class="placeholder col-5"></span>
                  </p>
                </>
              ) : criterion?.c2.length > 100 ? (
                criterion?.c2.substring(0, 50) + '...'
              ) : (
                criterion?.c2
              )}
            </p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Needs Improvement (1)</h5>
            <p className="card-text">
              {loading ? (
                <>
                  <p class="card-text placeholder-glow">
                    <span class="placeholder col-12"></span>
                    <span class="placeholder col-10"></span>
                    <span class="placeholder col-11"></span>
                    <span class="placeholder col-12"></span>
                    <span class="placeholder col-5"></span>
                  </p>
                </>
              ) : criterion?.c1.length > 100 ? (
                criterion?.c1.substring(0, 50) + '...'
              ) : (
                criterion?.c1
              )}
            </p>
          </div>
        </div>
        {isAdmin ? (
          <>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  Remarks ({criterion.remarks ? criterion.remarks.length : 0})
                </h5>
                <Textarea ref={remarkRef} />
                <Button onClick={onAddRemark} loading={isLoading}>
                  Add
                </Button>
              </div>
            </div>
          </>
        ) : undefined}
      </div>
    </li>
  );
};

export const CriteriaList = ({ criteria, loading, updateCriteria }) => {
  const { data, error } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!data && !error) return;
    if (!data.user) {
      router.replace('/login');
    }
  }, [router, data, error]);

  var perPage = 3;
  var page = 1;

  const [pageNumber, setPageNumber] = useState(page);
  const [items, setItems] = useState([]);

  let pagesHTML = [];

  if (criteria) {
    var result = criteria.reduce((resultArray, item, index) => {
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
    setItems((result && result[pageNumber - 1]) || criteria);
  }, [criteria, pageNumber]);

  const onPrevious = () => {
    setPageNumber(pageNumber - 1);
  };

  const onNext = () => {
    setPageNumber(pageNumber + 1);
  };

  const onChangePage = (specificPageNumber) => {
    setPageNumber(specificPageNumber);
  };

  return (
    <>
      {loading ? (
        <>
          <Criterion loading={loading} />
          <Criterion loading={loading} />
        </>
      ) : criteria?.length != 0 ? (
        <div>
          <ul id="list" className="list-group mb-5">
            {items?.map((criterion) => {
              return (
                <>
                  {data?.user?.isAdmin ? (
                    <Criterion
                      criterion={criterion}
                      updateCriteria={updateCriteria}
                      admin={data}
                      isAdmin
                    />
                  ) : (
                    <Criterion
                      criterion={criterion}
                      updateCriteria={updateCriteria}
                    />
                  )}
                </>
              );
            })}
          </ul>

          <nav aria-label="My Criteria Pagination">
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
                        <li className={'page-item page-number active'} onClick={() => onChangePage(i)}>
                          <span className={'page-link'}>{i}</span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className={'page-item page-number'} onClick={() => onChangePage(i)}>
                          <span className={'page-link'}>{i}</span>
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
      ) : (
        <h1>No criteria</h1>
      )}
    </>
  );
};
