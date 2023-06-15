import styles from "./TweetView.module.css";
import { useSession } from "next-auth/react";
import { PostListItem } from "@/participated/components/post-list-item/PostListItem";
import { useModal } from "@/participated/hooks/useModal";
import { CreatePost } from "@/participated/components/create-post/CreatePost";
import { Confirmation } from "@/participated/components/confirmation/Confirmation";
import { useCustomState } from "@/participated/hooks/useCustomState";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useToast } from "@/participated/hooks/useToast";
import { RetweetIcon } from "@/participated/components/icons/RetweetIcon";
import { CgMore } from "react-icons/cg";
import Link from "next/link";
import { Dropdown } from "@/participated/components/dropdown/Dropdown";
import { AsyncButton } from "@/participated/components/async-button/AsyncButton";
import { TweetActions, useTweetReducer } from "../../actions/tweet.action";
import { useEffect } from "react";
export function TweetView({
  tweet = {},
  onDelete = () => {},
  parentType = "",
}) {
  const { data: session, status } = useSession();
  const [tweetState, dispatch] = useTweetReducer(
    tweet.type === "retweet"
      ? { ...tweet.parent, replyPageIndex: 1 }
      : { ...tweet, replyPageIndex: 1 }
  );
  const expanded = useCustomState(false);
  const [repliesRef] = useAutoAnimate();
  const [parent] = useAutoAnimate();
  const modal = useModal();
  const createToast = useToast();

  useEffect(() => {
    if (tweetState.success?.message) {
      createToast({ text: tweetState.success.message });
    }
  }, [tweetState.success]);

  useEffect(() => {
    if (tweetState.error) {
      createToast({ text: tweetState.error.message });
    }
  }, [tweetState.error]);

  const like = async () => {
    if (tweetState.isLiked) {
      dispatch({ type: TweetActions.UNLIKE });
    } else {
      dispatch({ type: TweetActions.LIKE });
    }
  };

  const sendComment = async ({ text, image }) => {
    if (text || image) {
      await dispatch({
        type: TweetActions.REPLY,
        payload: { text, image: image?.file },
      });
    }
  };

  function edit() {
    modal.open(
      <CreatePost
        text={tweetState.content?.text}
        image={tweetState.content?.image}
        submitButton="save"
        onSubmit={async ({ text, image }) => {
          await dispatch({
            type: TweetActions.UPDATE,
            payload: { text, image },
          });
          modal.close();
        }}
      />
    );
  }

  const remove = () => {
    modal.open(
      <Confirmation
        subtitle="Do you really want to delete it?"
        onConfirm={async () => {
          await dispatch({
            type: TweetActions.DELETE,
            payload: tweetState.id,
          });
          onDelete(tweet);
          modal.close();
          createToast({ text: "tweet deleted" });
        }}
      />
    );
  };

  const retweet = async () => {
    await dispatch({ type: TweetActions.RETWEET });
    createToast({ text: "tweet retweeted" });
  };

  const onActionClick = (event) => {
    if (status === "authenticated") {
      if (event === "like") {
        like();
      } else if (event === "comment") {
        expanded.set(!expanded.value);
        if (
          tweetState.replies?.length === 0 &&
          tweetState.totalReplies !== 0 &&
          !expanded.value
        ) {
          dispatch({ type: TweetActions.LOAD_REPLIES });
        }
      } else if (event === "edit") {
        edit();
      } else if (event === "delete") {
        remove();
      } else if (event === "retweet") {
        retweet();
      }
    }
  };

  const retweetOptionClick = async (option) => {
    if (option === "delete") {
      modal.open(
        <Confirmation
          subtitle="You want to delete this retweet."
          onConfirm={async () => {
            await dispatch({ type: TweetActions.DELETE, payload: tweet.id });
            modal.close();
            onDelete(tweet);
            createToast({ text: "retweet deleted" });
          }}
          onReject={modal.close}
        />
      );
    }
  };

  return (
    <div ref={parent}>
      {tweet.type === "retweet" && (
        <div className={styles.retweetUser}>
          <RetweetIcon style={{ height: "1.2rem", width: "1.2rem" }} />{" "}
          <Link
            href={`/profile/${tweet.user?.id}`}
            className={styles.retweetUsername}
          >
            {tweet.user?.username}
          </Link>
          <span>retweeted </span>
          {session?.user.id === tweet.user?.id && (
            <Dropdown options={["delete"]} onOptionClick={retweetOptionClick}>
              <div className="btn btn-ghost" style={{ padding: "0.2rem" }}>
                <CgMore />
              </div>
            </Dropdown>
          )}
        </div>
      )}
      {tweetState.id ? (
        <>
          <PostListItem
            post={tweetState}
            parentType={parentType}
            onActionClick={onActionClick}
          />
          {expanded.value && (
            <div className={styles.expanded}>
              <div>
                <div>
                  <CreatePost
                    onSubmit={sendComment}
                    placeholder="Write your reply"
                    submitButton="reply"
                  />
                </div>
                <div ref={repliesRef}>
                  {tweetState.replies.map((reply) => (
                    <TweetView
                      key={reply.id}
                      tweet={reply}
                      parentType={tweetState.type}
                    ></TweetView>
                  ))}
                </div>
                {tweetState.replies.length < tweetState.totalReplies &&
                  tweetState.replies.length != 0 && (
                    <div className={styles.seeMoreComments}>
                      <AsyncButton
                        onClickAsync={() => {
                          dispatch({ type: TweetActions.LOAD_REPLIES });
                        }}
                      >
                        See more replies
                      </AsyncButton>
                    </div>
                  )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className={styles.unavailable}>
          <div>unavailable</div>
        </div>
      )}
    </div>
  );
}
