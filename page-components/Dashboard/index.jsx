import { Spacer } from "@/components/Layout";
import styles from "./Dashboard.module.css";

import { useCurrentUser } from "@/lib/user";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";

import { QuickNumber } from "./QuickNumber";
import { FrequentTopic } from "./FrequentTopic";
import { RecentRubric } from "./RecentRubric";

export const Dashboard = ({ frequentTopics, latestRubrics, quickStats }) => {
  const { data, error, mutate } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!data && !error) return;
    if (!data.user) {
      router.replace("/login");
    }
  }, [router, data, error]);

  return (
    <div className={styles.root}>
      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <div className="d-md-flex align-items-center">
                <div>
                  {data && data.user ? (
                    <>
                      <h4 className="card-title">
                        Welcome {data.user.username},
                      </h4>
                      <h6 className="card-subtitle">
                        {data.user.department?.name}
                      </h6>
                    </>
                  ) : (
                    <>
                      <h4 className="card-title">Welcome,</h4>
                    </>
                  )}
                  <div className="ms-3">
                    <h5 className="mb-0 fw-bold">About the website</h5>
                    <span className="text-muted fs-6">
                      This database is limited only to the college department of
                      Lyceum of the Philippines – Laguna. It is the goal of this
                      effort to standardize college department rubrics. This
                      project will expedite the process and standardize the
                      rubrics of the faculties on their respective disciplines,
                      hence reducing the amount of time it takes to complete
                      them.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h3>Recently Created Rubrics</h3>
          <p className="text-body-secondary fw-lighter">View what other teachers from your department have created</p>
          <div className="d-flex">
          {!latestRubrics ? (
            <>
            <RecentRubric loading={true}/> 
            <RecentRubric loading={true}/> 
            </>
          ) : (
            latestRubrics.map((latestRubric) => (
              <RecentRubric rubric={latestRubric}/>
            ))
          )}
          </div>

          <h3>Quick numbers</h3>
          {!quickStats ? (
            <>
              <QuickNumber
                loading={true}
                iconName={`mdi-eye`}
                action={"viewed"}
              />
              <QuickNumber
                loading={true}
                iconName={`mdi-download`}
                action={"downloaded"}
              />
            </>
          ) : (
            <>
              <QuickNumber
                quickStatA={{ length: quickStats.rlvy?.length || 0 }}
                quickStatB={{ length: quickStats.rlv7da?.length || 0 }}
                iconName={`mdi-eye`}
                action={"viewed"}
              />
              <QuickNumber
                quickStatA={{ length: quickStats.rldy?.length || 0 }}
                quickStatB={{ length: quickStats.rld7da?.length || 0 }}
                iconName={`mdi-download`}
                action={"downloaded"}
              />
            </>
          )}
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Frequent Topics</h4>
              <h6 className="card-subtitle">
                Choose a Topic below to create a new rubric based on a template:
              </h6>
              {!frequentTopics ? (
                <>
                  {(() => {
                    const topicsPlaceholder = [];
                    for (let i = 0; i < 3; i++) {
                      topicsPlaceholder.push(<FrequentTopic loading={true} />);
                    }
                    return topicsPlaceholder;
                  })()}
                  <FrequentTopic loading={true} />
                </>
              ) : (
                frequentTopics.map((frequentTopic) => (
                  <FrequentTopic activity={frequentTopic} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
