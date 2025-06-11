import React from "react";

const Custom404: React.FC = () => {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>404 - העמוד לא נמצא</h1>
      <p>מצטערים, העמוד שחיפשת לא קיים.</p>
      <a href="/">חזור לעמוד הבית</a>
    </div>
  );
};

export default Custom404;
