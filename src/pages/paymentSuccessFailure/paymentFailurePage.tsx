import {Helmet} from "react-helmet";

function PaymentFailurePage() {
    return (
        <div>
            <Helmet>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <h2>Failure :(</h2>
        </div>
    );
}

export default PaymentFailurePage;
