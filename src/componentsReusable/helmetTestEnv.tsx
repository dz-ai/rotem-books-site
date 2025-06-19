import {Helmet} from "react-helmet";

export const HelmetTestEnv = () => {
    return (
        <Helmet>
            <title>Test Site</title>
            <meta name="robots" content="noindex, nofollow"/>
        </Helmet>

    );
};
