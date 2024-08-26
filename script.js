const autoCompleteJS = new autoComplete({
    data: {
        src: async (query) => {
            try {
                // ConstrucciÃ³n de la URL de bÃºsqueda usando la query del usuario
                const baseURL = "https://api.bridgedataoutput.com/api/v2/miamire/listings";
                const accessToken = "access_token=56264eb81be0586138d71904152dfd77";
                const fields = "fields=BuildingName,UnparsedAddress,PropertyType";
                const mlsStatus = "MlsStatus.in=Active";
                const limit = "limit=200";
                const offset = "offset=1";
                const propertyTypeLease = "PropertyType.in=Residential Lease";
                const propertyTypeIncome = "PropertyType.in=Residential Income";
                const unparsedAddress = `UnparsedAddress.eq=${encodeURIComponent(query)}`;

                const finalURL = `${baseURL}?${accessToken}&${fields}&${mlsStatus}&${limit}&${offset}&${propertyTypeLease}&${propertyTypeIncome}&${unparsedAddress}`;

                const response = await fetch(finalURL);
                const data = await response.json();

                // Post Loading placeholder text
                document.getElementById("autoComplete").setAttribute("placeholder", autoCompleteJS.placeHolder);
                // Retorna solo los nombres de los usuarios
                return data.bundle.map((Building) => Building.UnparsedAddress);
            } catch (error) {
                console.error("Error fetching data", error);
                return [];
            }
        },
        cache: false,
        trigger: {
            event: ["keypress"],
            condition: (query) => query.trim().length > 2,
        },
    },
    placeHolder: "Search for Building & Address!",
    resultsList: {
        noResults: true,
        maxResults: 15,
        tabSelect: true,
    },
    resultItem: {
        element: (item, data) => {
            console.log(data);
            // Modify Results Item Style
            item.style = "display: flex; justify-content: space-between;";
            // Modify Results Item Content
            item.innerHTML = `
            <span style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
                ${data.match}
            </span>`;
        },
        highlight: true,
    },
    events: {
        input: {
            focus: () => {
                autoCompleteJS.input.value = ""; // Limpia el valor del input
                document.querySelector(".selection").innerHTML = ""; // Limpia la selecciÃ³n
                if (autoCompleteJS.input.value.length) autoCompleteJS.start();
            },
        },
    },
});

autoCompleteJS.input.addEventListener("selection", function (event) {
    const feedback = event.detail;
    autoCompleteJS.input.blur();
    const selection = feedback.selection.value;
    document.querySelector(".selection").innerHTML = `Seleccionaste: ${selection}`;
    autoCompleteJS.input.value = selection;
});

// Toggle Search Engine Type/Mode
document.querySelector(".toggler").addEventListener("click", () => {
    // Holds the toggle button selection/alignment
    const toggle = document.querySelector(".toggle").style.justifyContent;

    if (toggle === "flex-start" || toggle === "") {
        // Set Search Engine mode to Loose
        document.querySelector(".toggle").style.justifyContent = "flex-end";
        document.querySelector(".toggler").innerHTML = "Filter";
        autoCompleteJS.searchEngine = "loose";
    } else {
        // Set Search Engine mode to Strict
        document.querySelector(".toggle").style.justifyContent = "flex-start";
        document.querySelector(".toggler").innerHTML = "Simple";
        autoCompleteJS.searchEngine = "strict";
    }
});

// Blur/unBlur page elements
const action = (action) => {
    const title = document.querySelector("h1");
    const mode = document.querySelector(".mode");
    const selection = document.querySelector(".selection");
    const footer = document.querySelector(".footer");

    if (action === "dim") {
        title.style.opacity = 1;
        mode.style.opacity = 1;
        selection.style.opacity = 1;
    } else {
        title.style.opacity = 0.3;
        mode.style.opacity = 0.2;
        selection.style.opacity = 0.1;
    }
};

// Blur/unBlur page elements on input focus
["focus", "blur"].forEach((eventType) => {
    autoCompleteJS.input.addEventListener(eventType, () => {
        // Blur page elements
        if (eventType === "blur") {
            action("dim");
        } else if (eventType === "focus") {
            // unBlur page elements
            action("light");
        }
    });
});