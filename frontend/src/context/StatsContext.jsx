import { createContext , useContext , useState  } from "react";

const StatsContext = createContext();

export const StatsProvider = ({children}) => {
 
    const [ stats , setStats ] = useState({
        templates : 0,
        uploaded_files : 0,
        active_mappings : 0,
        products_mapped : 0
    });


return (
    <StatsContext.Provider value = {{ stats , setStats}}>
         {children}
    </StatsContext.Provider>
);
};

export const useStats = () => useContext(StatsContext);