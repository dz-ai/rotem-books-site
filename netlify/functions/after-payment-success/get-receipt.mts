// fetch receipt from "Morning API"
export async function getReceipt(token: string, email: string, username: string) {
    try {
        const currentDate = getCurrentFormattedDate();

        // search parameters to get the specific receipt fot the user that made the payment right now (the email in the description performs as a unique identifier).
        const searchPrams = {
            page: 1,
            pageSize: 20,
            type: 400,
            status: [0],
            paymentType: [0],
            fromDate: currentDate,
            toDate: currentDate,
            clientName: username,
            description: `קניה באתר הספרים של רותם (${email})`,
            sort: "documentDate"
        };

        const receiptResponse = await fetch(`${process.env.MORNING_URL}/documents/search`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(searchPrams),
        });


        const receiptResults = await receiptResponse.json();

        let results = null;

        type TItem = {
            id: string;
            url: { he: string, origin: string };
        }

        if (receiptResults) {
            const items: TItem[] = receiptResults.items;

            // even if the user buy couple of times this day, the position [0] is the latest receipt
            const receiptUrl = items[0].url.he;
            const receiptId = items[0].id;

            results = {receiptUrl, receiptId};
        }

        return results;
    } catch (err) {
        return null
    }
}

// get the date of today in the form of year-month-day
function getCurrentFormattedDate() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}
