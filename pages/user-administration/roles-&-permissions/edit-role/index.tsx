/** @format */

import CreateRole from "../CreateRole";

interface Props {
  onCancel: () => void;
  _id: string;
}

const EditRole = ({ onCancel, _id }: Props): JSX.Element => {
  return <CreateRole onCancel={onCancel} _id={_id} />;
};

export default EditRole;
