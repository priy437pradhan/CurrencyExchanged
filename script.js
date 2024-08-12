document.addEventListener("DOMContentLoaded", () => {
    const BASE_URL = "https://v6.exchangerate-api.com/v6/0eef172ee64b637d92ce5b7c/latest/";

    const dropdowns = document.querySelectorAll(".dropdown select");
    const btn = document.querySelector("form button");
    const fromCurr = document.querySelector(".from select");
    const toCurr = document.querySelector(".to select");
    const msg = document.querySelector(".msg");

    if (!fromCurr || !toCurr || !msg) {
        console.error("One or more elements are missing in the DOM.");
    }

    for (let select of dropdowns) {
        for (let currCode in countryList) {
            let newOptions = document.createElement("option");
            newOptions.innerHTML = currCode;
            newOptions.value = currCode;
            if (select.name === "from" && currCode === "USD") {
                newOptions.selected = "selected"; 
            } else if (select.name === "to" && currCode === "INR") {
                newOptions.selected = "selected";
            }
            select.append(newOptions);
        }

        select.addEventListener("change", (evt) => {
            updateFlags(evt.target);
        });
    }

    const updateFlags = (element) => {
        let currCode = element.value;
        let countryCode = countryList[currCode];
        if (!countryCode) {
            console.error("Country code not found for", currCode);
            return;
        }
        let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
        let img = element.parentElement.querySelector("img");
        if (img) {
            img.src = newSrc;
        } else {
            console.error("Image element not found for", element);
        }
    };

    const updateExchangeRate = async () => {
        let amount = document.querySelector(".amount input");
        console.log("Amount element:", amount); 
        if (!amount) {
            console.error("Amount input element not found.");
            return;
        }
        let amtVal = amount.value;

        if (amtVal === "" || amtVal < 1) {
            amtVal = 1;
            amount.value = "1";
        }

        const URL = `${BASE_URL}${fromCurr.value}`;
        
        try {
            let response = await fetch(URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            let data = await response.json();
            let rate = data.conversion_rates[toCurr.value];

            if (rate === undefined) {
                throw new Error("Invalid currency code or rate not found.");
            }

            let finalAmount = amtVal * rate;
            msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
        } catch (error) {
            msg.innerText = `Error: ${error.message}`;
            console.error("Update Exchange Rate Error:", error);
        }
    };

    btn.addEventListener("click", (evt) => {
        evt.preventDefault();
        updateExchangeRate();
    });

    if (fromCurr && toCurr) {
        updateExchangeRate();
    }
});
