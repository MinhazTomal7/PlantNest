import React, {useEffect} from 'react';
import LegalContents from "../components/features/legal-contents.jsx";
import FeatureStore from "../store/FeatureStore.js";

const AboutPage = () => {
    const {LegalDetailsRequest}=FeatureStore();
    useEffect(() => {
        (async ()=>{
            await LegalDetailsRequest("about")
        })()
    }, []);
    return (

            <LegalContents/>

    );
};

export default AboutPage;