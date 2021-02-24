import { withUrqlClient } from "next-urql";
import { ReactElement } from "react";
import { createUrqlClient } from "../../../utils/createUrqlClient";

function EditPost(): ReactElement | null {
  return <div>hello</div>;
}

export default withUrqlClient(createUrqlClient)(EditPost);
