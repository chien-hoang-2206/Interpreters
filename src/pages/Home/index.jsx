import React from "react";
import ContentHome from "../../components/Content/ContentHome";
import { useLocation, useParams } from "react-router-dom";
const Home = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = useParams()
  const keyword = searchParams.get("keyword");
  return (
    <ContentHome serchValue={keyword} id={id?.id}/>
  );
};

export default Home;
