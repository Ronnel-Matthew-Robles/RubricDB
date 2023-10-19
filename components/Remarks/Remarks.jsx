import { useCurrentUser } from "@/lib/user";
import { useRef, useState } from "react";
import { Wrapper, Container } from "../Layout";
import { Input } from "../Input";
import Link from "next/link";
import { Text, TextLink } from '@/components/Text';
import { Button } from "../Button";
import { Avatar } from "../Avatar";
import { LoadingDots } from "../LoadingDots";
import styles from "./Remarks.module.css";

import { fetcher } from "@/lib/fetch";

import toast from "react-hot-toast";

const Remarks = ({ remarks, loading, item, type, updateRemarks }) => {
  return (
    <>
      <hr />
      <h3>Remarks</h3>
      <Poster item={item} type={type} updateRemarks={updateRemarks}/>
      {loading ? (
        <>
          <LoadingDots />
        </>
      ) : remarks?.length > 0 ? (
        remarks.map((remark) => {
          return (
            <>
              <div class="card mb-3">
                <div class="card-body">
                  <h5 class="card-title">{remark.creator.name}</h5>
                  <p class="card-text">{remark.text}</p>
                  <p class="card-text">
                    <small class="text-muted">{remark.createdAt}</small>
                  </p>
                </div>
              </div>
            </>
          );
        })
      ) : (
        <h5>No remarks</h5>
      )}
      <hr />
    </>
  );
};

const PosterInner = ({ user, item, type, updateRemarks }) => {
  const contentRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetcher(`/api/remark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorId: user._id,
          itemId: item._id,
          text: contentRef.current.value,
          type: type
        }),
      });

      if (response.remark._id && response.addRemarkToItem == 1) {
        toast.success('The remark has been added successfully.');
        updateRemarks();
        contentRef.current.value = '';
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
    <form onSubmit={onSubmit}>
      <Container className={styles.poster}>
        <Avatar size={40} username={user.username} url={user.profilePicture} />
        <Input
          ref={contentRef}
          className={styles.input}
          placeholder={`What's on your mind, ${user.name}?`}
          ariaLabel={`What's on your mind, ${user.name}?`}
        />
        <Button type="success" loading={isLoading}>
          Post
        </Button>
      </Container>
    </form>
  );
};

const Poster = ({item, type, updateRemarks}) => {
  const { data, error } = useCurrentUser();
  const loading = !data && !error;

  return (
    <Wrapper>
      <div className={styles.root}>
        <h3 className={styles.heading}>Share your thoughts</h3>
        {loading ? (
          <LoadingDots>Loading</LoadingDots>
        ) : data?.user ? (
          <PosterInner user={data.user} item={item} type={type} updateRemarks={updateRemarks}/>
        ) : (
          <Text color="secondary">
            Please{" "}
            <Link href="/login" passHref>
              <TextLink color="link" variant="highlight">
                sign in
              </TextLink>
            </Link>{" "}
            to post
          </Text>
        )}
      </div>
    </Wrapper>
  );
};

export default Remarks;
