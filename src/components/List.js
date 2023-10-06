import React from "react";

const List = ({list}) => {
    console.log("list is ",list);
  return (
    <div>
      <ul>
        {list?.map((username) => (
          <li key={username}>{username}</li>
        ))}
      </ul>
    </div>
  );
};

export default List;
