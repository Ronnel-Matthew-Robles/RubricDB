import { Spacer } from "@/components/Layout";
import { Input, Select, Textarea, NumberInput } from "@/components/Input";
import { Button } from "@/components/Button";
import { LoadingDots } from "@/components/LoadingDots";
import { Remarks } from "@/components/Remarks";

import { useCurrentUser } from "@/lib/user";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { fetcher } from "@/lib/fetch";

import styles from "./Calculator.module.css";

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

export const Calculator = ({ rubric, loading }) => {
  const { data, error } = useCurrentUser();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState([]);

  const groupNameRef = useRef();
  const groupMembersRef = useRef();
  const weights = [];
  const scoreRefs = [];
  const totalScoreRef = useRef();

  useEffect(() => {
    if (!data && !error) return;
    if (!data.user) {
      router.replace("/login");
    }
  }, [router, data, error]);

  const onChange = (e) => {
    const scores = [];
    for (let scoreRef of scoreRefs) {
      const score = scoreRef.current.value;
      if (score === "") {
        scores.push(0);
      } else {
        scores.push(parseInt(scoreRef.current.value));
      }
    }
    totalScoreRef.current.value = scores.reduce(
      (partialSum, a) => partialSum + a,
      0
    );
  };

  const onAdd = () => {
    try {
      setIsLoading(true);

      if (groupNameRef.current.value === "") {
        throw Error("Add a group name.");
      }

      if (groupMembersRef.current.value === "") {
        throw Error("Add group members.");
      }

      const scores = [];
      for (let scoreRef of scoreRefs) {
        const score = scoreRef.current.value;
        if (score === "") {
          throw Error("Score can not be blank.");
        }
        scores.push(parseInt(scoreRef.current.value));
      }

      let total = scores.reduce((partialSum, a) => partialSum + a, 0);
      const scoreTexts = [];
      const calculatedWeights = [];
      if (weights.length != 0) {
        for (let i = 0; i < scores.length; i++) {
          const calculatedWeight =
            (scores[i] / rubric.category_names.length) * weights[i];
          calculatedWeights.push(calculatedWeight);
          let text = `${scores[i]} (${calculatedWeight}%)`;
          scoreTexts.push(text);
        }

        total = `${total} (${calculatedWeights.reduce(
          (partialSum, a) => partialSum + a,
          0
        )}%)`;
      }

      let newRecords = [...records];
      newRecords.push({
        groupName: groupNameRef.current.value,
        groupMembers: groupMembersRef.current.value,
        weights: weights,
        scores: scoreTexts.length != 0 ? scoreTexts : scores,
        total: total,
      });
      setRecords(newRecords);
      groupNameRef.current.value = "";
      groupMembersRef.current.value = "";
      setIsLoading(false);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onReset = () => {
    setRecords([]);
  };

  return (
    <>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">Group Name</th>
              <th scope="col">Members</th>
              {rubric.criteria.map((criterion) => {
                return (
                  <>
                    <th scope="col">
                      {criterion.new_name !== ""
                        ? criterion.new_name
                        : criterion.criteria.title}
                      {criterion.weight ? ` (${criterion.weight}%)` : ""}
                    </th>
                  </>
                );
              })}
              <th scope="col">Score</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => {
              return (
                <>
                  <tr>
                    <th>{record.groupName}</th>
                    <td>{record.groupMembers}</td>
                    {record.scores.map((score) => {
                      return (
                        <>
                          <td>{score}</td>
                        </>
                      );
                    })}
                    <td>{record.total}</td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
        <button className="btn btn-secondary mb-2" onClick={onReset}>
          Reset
        </button>
      </div>

      <hr />
      <div className="d-flex justify-content-between">
        <h1 className="col-12">
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
      </div>

      <div className="row mt-2">
        <div className="col-6">
          <Input
            label="Group Name"
            htmlType="text"
            ref={groupNameRef}
            required
          />
        </div>
        <div className="col-6">
          <Input
            htmlType="text"
            label="Members"
            ref={groupMembersRef}
            required
          />
        </div>
      </div>

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
                const rowScoreRef = useRef();
                scoreRefs.push(rowScoreRef);

                if (criterion?.weight != undefined) {
                  weights.push(criterion.weight);
                }

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
                          <td className="w-25">
                            <NumberInput
                              htmlType="number"
                              min="1"
                              max="4"
                              ref={rowScoreRef}
                              onChange={onChange}
                            />
                          </td>
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
              <td>
                <Input value="0" ref={totalScoreRef} readonly />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <center>
        <div className={styles.main}>
          <Button
            type="success"
            size="large"
            loading={isLoading}
            onClick={onAdd}
          >
            Add Score
          </Button>
        </div>
      </center>
    </>
  );
};
