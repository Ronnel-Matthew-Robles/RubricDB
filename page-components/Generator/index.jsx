import { Spacer } from "@/components/Layout";
import { Button } from "@/components/Button";
import { Input, Select as NormalSelect, Textarea } from "@/components/Input";
import Select, { StylesConfig } from 'react-select'; 

import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState, createRef } from "react";
import { useCurrentUser } from "@/lib/user";
import { fetcher } from "@/lib/fetch";

import styles from "./Generator.module.css";

import toast from "react-hot-toast";

import { generatePDF } from "@/lib/rubric";

import { useReducer } from 'react';

const initialState = {
  selectedCriteria: [],
  criteria: [],
  selectedCriteriaCustomNames: [],
  selectedCriteriaWeights: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_CRITERIA':
      return {
        ...state,
        criteria: action.criteria.criteria
      };
    case 'ADD_ROW':
      return {
        ...state,
        selectedCriteria: [...state.selectedCriteria, ''],
        selectedCriteriaCustomNames: [...state.selectedCriteriaCustomNames, ''],
        selectedCriteriaWeights: [...state.selectedCriteriaWeights, ''],
      };
    case 'DELETE_ROW':
      console.log(state)
      return {
        ...state,
        selectedCriteria: state.selectedCriteria.filter((_, i) => i !== action.index),
        selectedCriteriaCustomNames: state.selectedCriteriaCustomNames.filter((_, i) => i !== action.index),
        selectedCriteriaWeights: state.selectedCriteriaWeights.filter((_, i) => i !== action.index),
      };
    case 'UPDATE_CRITERIA':
      return {
        ...state,
        selectedCriteria: state.selectedCriteria.map((c, i) => (i === action.index ? action.value : c)),
      };
    case 'UPDATE_CUSTOM_NAME':
      return {
        ...state,
        selectedCriteriaCustomNames: state.selectedCriteriaCustomNames.map((c, i) => (i === action.index ? action.value : c)),
      };
    case 'UPDATE_WEIGHT':
      return {
        ...state,
        selectedCriteriaWeights: state.selectedCriteriaWeights.map((c, i) => (i === action.index ? action.value : c)),
      };
    default:
      throw new Error();
  }
}

const EmptyCell = () => {
  return (
    <>
      <div className="criteria-description">
        <span className="placeholder col-7"></span>
        <span className="placeholder col-4"></span>
        <span className="placeholder col-4"></span>
        <span className="placeholder col-6"></span>
        <span className="placeholder col-8"></span>
      </div>
    </>
  );
};

const AddRow = ({onClick}) => {
  return (
    <>
      <tr onClick={onClick}>
        <td align="center" colspan="10">
          <i className="mdi mdi-plus-box"> </i>
          Add Row
        </td>
      </tr>
    </>
  );
};

const Row = ({
  criterion,
  customName,
  weight,
  criteria,
  handleCriteriaChange,
  handleCriteriaCustomNamesChange,
  handleCriteriaWeightsChange,
  rowNumber,
  onDeleteSpecificRow
}) => {
  const onCriterionChange = (event) => {
    handleCriteriaChange(event)
  };

  const handleDeleteRow = () => {
    onDeleteSpecificRow(rowNumber);
  };

  const newCriteria = criteria.map(criterion => {
    let c = criterion;
    c.label = criterion.title;
    c.value = criterion._id;
    return c;
  })

  return (
    <>
      <tr>
        <td onClick={handleDeleteRow} className={"text-danger"}>x</td>
        <td valign="top" width="200">
          <div>
            <Select
              options={newCriteria}
              onChange={onCriterionChange}
              isSearchable={true}
              isClearable={true}
              required
              defaultInputValue={criterion}
              value={criterion}
              className={'custom-select'}
            />
          </div>
          <div>
            <table border="0">
              <tbody>
                <tr>
                  <td valign="top">
                    <div>
                      Custom Name
                      <Input onChange={handleCriteriaCustomNamesChange} placeholder="N/A" value={customName}></Input>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td valign="top">
                    <div>
                      Weight% (Optional)
                      <Input onChange={handleCriteriaWeightsChange} placeholder="0" value={weight}></Input>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </td>
        <td>
          <Spacer size={0.1} axis={"horizontal"} />
        </td>
        <td valign="top">
          {!criterion ? <EmptyCell /> : <>{criterion.c4}</>}
        </td>
        <td>
          <Spacer size={0.1} axis={"horizontal"} />
        </td>
        <td valign="top">
          {!criterion ? <EmptyCell /> : <>{criterion.c3}</>}
        </td>
        <td>
          <Spacer size={0.1} axis={"horizontal"} />
        </td>
        <td valign="top">
          {!criterion ? <EmptyCell /> : <>{criterion.c2}</>}
        </td>
        <td>
          <Spacer size={0.1} axis={"horizontal"} />
        </td>
        <td valign="top">
          {!criterion ? <EmptyCell /> : <>{criterion.c1}</>}
        </td>
      </tr>
    </>
  );
};

export const RubricGenerator = ({ activities }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activity, setActivity] = useState(activities[0]);

  const [state, dispatch] = useReducer(reducer, initialState);

  const titleRef = useRef();
  const activityRef = useRef();
  const instructionsRef = useRef();
  const c4CustomNameRef = useRef();
  const c3CustomNameRef = useRef();
  const c2CustomNameRef = useRef();
  const c1CustomNameRef = useRef();

  const userResponse = useCurrentUser();
  const user = userResponse.data;

  const router = useRouter();

  useEffect(() => {
    fetch(`/api/activity/${activity._id}/approved`)
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: 'SET_CRITERIA', criteria: data })
      });
  }, [activity]);

  // useEffect(() => {
  //   if (!data && !error) return;
  //   if (!data.user) {
  //     router.replace('/login');
  //   }
  // }, [router, data, error]);

  const onActivityChange = (event) => {
    const activity = activities.filter(
      (activity) => activity._id === event.target.value
    );
    setActivity(activity[0]);
  };

  const onDeleteSpecificRow = (index) => {
    dispatch({ type: 'DELETE_ROW', index });
  };

  const onAddRow = () => {
    dispatch({ type: 'ADD_ROW' });
  };

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setIsLoading(true);
        var hasWeights = false;
        var weights = [];
        if (state.selectedCriteriaWeights.length > 0) {
          for (let i = 0; i < state.selectedCriteriaWeights.length; i++) {
            weights.push(state.selectedCriteriaWeights[i]);
            if (state.selectedCriteriaWeights[i] !== "") {
              hasWeights = true;
            }
          }
        }

        if (hasWeights) {
          const checkedWeights = checkWeights(weights, state.selectedCriteriaWeights.length);
          if (!checkedWeights.isValid) {
            throw checkedWeights;
          } else {
            weights = checkedWeights.weights;
          }
        }

        const criteria = [];
        for (let i = 0; i < state.selectedCriteria.length; i++) {
          criteria.push({
            criteria: state.selectedCriteria[i]._id,
            new_name: state.selectedCriteriaCustomNames[i],
            weight: weights[i] === '' ? undefined : weights[i]
          });
        }
        const category_names = [
          c1CustomNameRef.current.value,
          c2CustomNameRef.current.value,
          c3CustomNameRef.current.value,
          c4CustomNameRef.current.value,
        ];
        const data = {
          activity: activityRef.current.value,
          title: titleRef.current.value,
          category_names: category_names,
          criteria: criteria,
          instructions: instructionsRef.current.value,
        };
        console.log(data);
        const response = await fetcher("/api/rubric", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data,
          }),
        });
        generatePDF(response.rubric, user.user);

        if (response.rubric) {
          toast.success("Your rubric has been created.");
          router.replace('/user/teacher/rubrics');
        } else {
          throw Error("There's a problem creating the rubric.");
        }

        // router.replace(`/user/${data.user.name}/criteria`);
      } catch (e) {
        toast.error(e.message);
      } finally {
        setIsLoading(false);
      }
    },
    [router, state]
  );

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="row mb-3">
          <div className="col-6">
            <Input label="Rubric Title" ref={titleRef} required />
          </div>
          <div className="col-6">
            <NormalSelect
              label="Actvitiy"
              ref={activityRef}
              selectOptions={activities}
              onChange={onActivityChange}
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <Textarea label="Instructions" ref={instructionsRef} />
        </div>

        <div className="table-responsive">
          <table className="table table-bordered" border="1">
            <tbody>
              <tr>
                <td></td>
                <td valign="center" align="center">
                  <div>
                    <p>Category:</p>
                  </div>
                </td>
                <td>
                  <Spacer size={0.1} axis={"horizontal"} />
                </td>
                <td valign="top" colspan="1">
                  <Input ref={c4CustomNameRef} placeholder="4" />
                </td>
                <td>
                  <Spacer size={0.1} axis={"horizontal"} />
                </td>
                <td valign="top" colspan="1">
                  <Input ref={c3CustomNameRef} placeholder="3" />
                </td>
                <td>
                  <Spacer size={0.1} axis={"horizontal"} />
                </td>
                <td valign="top" colspan="1">
                  <Input ref={c2CustomNameRef} placeholder="2" />
                </td>
                <td>
                  <Spacer size={0.1} axis={"horizontal"} />
                </td>
                <td valign="top" colspan="1">
                  <Input ref={c1CustomNameRef} placeholder="1" />
                </td>
              </tr>
              {state.selectedCriteria.map((c, i) => (
                <Row
                  criterion={state.selectedCriteria[i]}
                  customName={state.selectedCriteriaCustomNames[i]}
                  weight={state.selectedCriteriaWeights[i]}
                  criteria={state.criteria}
                  handleCriteriaChange={(event) => dispatch({ type: 'UPDATE_CRITERIA', index: i, value: event ? state.criteria.filter((criterion) => criterion._id == event._id)[0] : null})}
                  handleCriteriaCustomNamesChange={(event) => dispatch({ type: 'UPDATE_CUSTOM_NAME', index: i, value: event.target.value })}
                  handleCriteriaWeightsChange={(event) => dispatch({ type: 'UPDATE_WEIGHT', index: i, value: event.target.value })}
                  activityRef={activityRef}
                  rowNumber={i}
                  onDeleteSpecificRow={onDeleteSpecificRow}
                  currentUser={user}
                  key={i}
                />
              ))}
              <AddRow onClick={onAddRow}/>
            </tbody>
          </table>
        </div>
        <center>
          <div className={styles.main}>
            <Button
              htmlType="submit"
              type="success"
              size="large"
              loading={isLoading}
            >
              Create
            </Button>
          </div>
        </center>
      </form>
    </>
  );
};

const checkWeights = (weights, defaultNumOfCriteria) => {
  var numOfValidWeights = 0;
  const parsedWeights = [];
  for (let weight of weights) {
    if (weight === "") {
      parsedWeights.push(0);
    } else {
      parsedWeights.push(parseInt(weight));
      numOfValidWeights++;
    }
  }
  const sum = parsedWeights.reduce((partialSum, a) => partialSum + a, 0);
  if (numOfValidWeights != defaultNumOfCriteria) {
    if (sum == 100) {
      return { message: "Some weights can not be set to zero", isValid: false };
    } else if (sum > 100) {
      return { message: "Sum of weights can not go over 100", isValid: false };
    } else if (numOfValidWeights > defaultNumOfCriteria) {
      return { message: "Wrong number of criteria", isValid: false };
    } else if (numOfValidWeights < defaultNumOfCriteria) {
      const missingNumOfWeights = defaultNumOfCriteria - numOfValidWeights;
      // Remaining weight divided by number of missing weights
      const equalMissingWeight = (100 - sum) / missingNumOfWeights;
      for (let i = 0; i < parsedWeights.length; i++) {
        if (parsedWeights[i] == 0) {
          parsedWeights[i] = equalMissingWeight;
        }
      }
      return { message: "Success", isValid: true, weights: parsedWeights };
    }
  } else if (sum != 100) {
    return { message: "Total of weights should be 100", isValid: false };
  }

  return { message: "Success", isValid: true, weights: parsedWeights };
};
