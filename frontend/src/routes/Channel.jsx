import { useParams } from "react-router-dom";

const Channel = () => {
  const { id } = useParams();
  return <h2>Channel Page - {id}</h2>;
};

export default Channel;
