import { Spacer } from '@/components/Layout';
import { Input, Select, Textarea } from '@/components/Input';
import { Button } from '@/components/Button';
import { LoadingDots } from '@/components/LoadingDots';
import { Remarks } from '@/components/Remarks';

import { useCurrentUser } from '@/lib/user';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';

export const Criterion = ({ criterion, loading, updateCriterion }) => {
  const { data, error, mutate } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!data && !error) return;
    if (!data.user) {
      router.replace('/login');
    }
  }, [router, data, error]);

  return (
    <main>
      <h1>
        {loading ? (
          <>
            <p class="card-text placeholder-glow">
              <span class="placeholder col-4"></span>
            </p>
          </>
        ) : (
          <>
            {criterion.title}{' '}
            <span class="badge bg-info text-dark">
              {criterion.activity?.name}
            </span>
          </>
        )}
      </h1>
      <h5>
        {loading ? (
          <>
            <p class="card-text placeholder-glow">
              By <span class="placeholder col-3"></span>
            </p>
          </>
        ) : (
          <>
            By {criterion.creator.name}
            {criterion.status.name === 'Pending' ? (
              <span class="badge bg-warning">Pending</span>
            ) : criterion.status.name === 'Approved' ? (
              <span class="badge bg-success">Approved</span>
            ) : criterion.status.name === 'Rejected' ? (
              <span class="badge bg-danger">Rejected</span>
            ) : undefined}
          </>
        )}
      </h5>
      {loading ? (
        <>
          <p class="card-text placeholder-glow">
            <span class="placeholder col-2"></span>
          </p>
        </>
      ) : (
        <>
          <p>{criterion.createdAt + ''}</p>
        </>
      )}
      <hr />
      {loading ? (
        <>
          <li class="list-group-item">
            <div class="card-group" id={0}>
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Excellent (4)</h5>
                  <p class="card-text placeholder-glow">
                    <span class="placeholder col-12"></span>
                    <span class="placeholder col-10"></span>
                    <span class="placeholder col-11"></span>
                    <span class="placeholder col-12"></span>
                    <span class="placeholder col-5"></span>
                  </p>
                </div>
              </div>
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Good (3)</h5>
                  <p class="card-text placeholder-glow">
                    <span class="placeholder col-12"></span>
                    <span class="placeholder col-10"></span>
                    <span class="placeholder col-11"></span>
                    <span class="placeholder col-12"></span>
                    <span class="placeholder col-5"></span>
                  </p>
                </div>
              </div>
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Satisfactory (2)</h5>
                  <p class="card-text placeholder-glow">
                    <span class="placeholder col-12"></span>
                    <span class="placeholder col-10"></span>
                    <span class="placeholder col-11"></span>
                    <span class="placeholder col-12"></span>
                    <span class="placeholder col-5"></span>
                  </p>
                </div>
              </div>
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Needs Improvement (1)</h5>
                  <p class="card-text placeholder-glow">
                    <span class="placeholder col-12"></span>
                    <span class="placeholder col-10"></span>
                    <span class="placeholder col-11"></span>
                    <span class="placeholder col-12"></span>
                    <span class="placeholder col-5"></span>
                  </p>
                </div>
              </div>
            </div>
          </li>
        </>
      ) : (
        <>
          <li class="list-group-item">
            <div class="card-group" id={criterion._id}>
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Excellent (4)</h5>
                  <p class="card-text">{criterion.c4}</p>
                </div>
              </div>
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Good (3)</h5>
                  <p class="card-text">{criterion.c3}</p>
                </div>
              </div>
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Satisfactory (2)</h5>
                  <p class="card-text">{criterion.c2}</p>
                </div>
              </div>
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Needs Improvement (1)</h5>
                  <p class="card-text">{criterion.c1}</p>
                </div>
              </div>
            </div>
          </li>
        </>
      )}

      <Remarks remarks={criterion?.remarks} loading={loading} item={criterion} type={'criteria'} updateRemarks={updateCriterion}/>
    </main>
  );
};
