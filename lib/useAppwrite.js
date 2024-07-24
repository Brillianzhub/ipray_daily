import { Alert } from "react-native";
import { useEffect, useState } from "react";

const useAppwrite = (fn) => {
    const [data, setData] = useState([]);
    const [loading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await fn();
            setData(res);
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const refetch = () => fetchData();

    return { data, loading, refetch };
};

export default useAppwrite;

