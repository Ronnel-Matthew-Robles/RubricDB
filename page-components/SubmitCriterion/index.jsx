import { Spacer } from '@/components/Layout';
import { Input, Select, Textarea } from '@/components/Input';
import { Button } from '@/components/Button';

import { useCurrentUser } from '@/lib/user';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { fetcher } from '@/lib/fetch';
import toast from 'react-hot-toast';

import styles from './SubmitCriterion.module.css';

export const SubmitCriterion = ({ activities }) => {
  const { data, error, mutate } = useCurrentUser();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const activityRef = useRef();
  const newActivityRef = useRef();
  const titleRef = useRef();
  const c4Ref = useRef();
  const c3Ref = useRef();
  const c2Ref = useRef();
  const c1Ref = useRef();

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setIsLoading(true);
        const response = await fetcher('/api/criteria', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            activity: activityRef.current.value,
            newActivity: newActivityRef.current.value,
            title: titleRef.current.value,
            c4: c4Ref.current.value,
            c3: c3Ref.current.value,
            c2: c2Ref.current.value,
            c1: c1Ref.current.value,
          }),
        });
        toast.success('Your criterion has been submitted for approval.');
        router.replace(`/user/${data.user.username}/criteria`);
      } catch (e) {
        toast.error(e.message);
      } finally {
        setIsLoading(false);
      }
    },
    [mutate, router]
  );

  useEffect(() => {
    if (!data && !error) return;
    if (!data.user) {
      router.replace('/login');
    }
  }, [router, data, error]);

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-3">
        <div className="row align-items-center">
          <div className="col-4">
            <Select selectOptions={activities} label={`Activity`} ref={activityRef}/>
          </div>
          <div className="col-6">
            <Input label={`OR New Activity`} ref={newActivityRef}/>
          </div>
          <div className="col-2">
            <small className="text-muted form-text">
              Only add if activity is not present
            </small>
          </div>
        </div>
        <Spacer size={0.5} axie={`vertical`} />
        <Input label={`Criterion Title`} ref={titleRef} required />
        <Spacer size={0.5} axie={`vertical`} />
        <Textarea label={`Excellent (4)`} ref={c4Ref} required />
        <Spacer size={0.5} axie={`vertical`} />
        <Textarea label={`Good (3)`} ref={c3Ref} required />
        <Spacer size={0.5} axie={`vertical`} />
        <Textarea label={`Satisfactory (2)`} ref={c2Ref} required />
        <Spacer size={0.5} axie={`vertical`} />
        <Textarea label={`Needs Improvement (1)`} ref={c1Ref} required />
        <Spacer size={0.5} axie={`vertical`} />
        <center>
          <Button
            htmlType="submit"
            type="success"
            size="large"
            className={styles.main}
            loading={isLoading}
          >
            Submit Criteria
          </Button>
        </center>
      </div>
    </form>
  );
};
