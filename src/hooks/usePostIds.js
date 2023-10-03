import { useSWR } from "swr";


const usePostIds = (postIds) => {
  const urls = postIds.map((postId) => (postId ? `/api/posts/${postId}` : null));

  const results = urls.map((url) => useSWR(url, fetcher));

  const data = results.map((result) => result.data);
  const error = results.map((result) => result.error);
  const isLoading = results.some((result) => result.isValidating);

  return {
    data,
    error,
    isLoading,
  };
};

export default usePostIds;
