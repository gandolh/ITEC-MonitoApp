import PubDashCard from "./PubDashCard.tsx";
import AddAppCard from "../shared/AddAppCard.tsx";
import iApp from "../../types/IApp.ts";

interface PubDashboardComp{
  data : iApp[],
  OnRefetchData : ()=> void,
  isUserDashboard : boolean;
}

const PubDashboardComp = ({data,OnRefetchData, isUserDashboard} : PubDashboardComp) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">

      <AddAppCard OnRefetchData={OnRefetchData}/>
      {data.map((app) => {
        return (
            <PubDashCard app={app} isUserDashboard={isUserDashboard}/>
        );
      })}
    </div>
  );
};

export default PubDashboardComp;
