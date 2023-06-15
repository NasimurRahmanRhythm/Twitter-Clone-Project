import { MiniUserList } from "@/participated/components/mini-user-list/MiniUserList";
import { useRouter } from "next/router";

export function YouMayKnow({ users = [] }) {
  const router = useRouter();
  const onItemClick = (user) => {
    router.push("/profile/" + user.id);
  };

  return (
    <MiniUserList
      users={users}
      onItemClick={onItemClick}
      title="You may know"
    />
  );
}
