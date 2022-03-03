const electronWindow = window;
const electronApi = electronWindow.electronApi;
import { queryRequiredElement } from "./pageUtils.js";
const select = queryRequiredElement("select", "weather");
const selectTheme = queryRequiredElement("select", "theme");
const para = queryRequiredElement("p", "weatherDescription");
const themes = {
    "white": { color: "black", backgroundColor: "white" },
    "black": { color: "white", backgroundColor: "black" }
};
const currentTheme = { color: "black", backgroundColor: "white" };
updateColors();
selectTheme.addEventListener("change", function (ev) {
    const selectedSchene = this.value === "white"
        ? themes.white
        : themes.black;
    // assign<T, U>(target: T, source: U): T & U;
    //const o1 = Object.assign(currentTheme, selectedSchene);
    const o2 = { ...currentTheme, ...selectedSchene };
    //console.log("o1:", o1);
    console.log("o2:", o2);
    updateColors();
});
select.addEventListener('change', setWeather);
function setWeather() {
    const choice = select.value;
    const weather = electronApi.getWeather();
    const [, description] = weather.find(([weatherType, weatherDescription]) => weatherType === choice) ?? [choice, void 0];
    if (description) {
        para.textContent = description;
    }
    else {
        para.textContent = "";
    }
    // if (choice === 'sunny') {
    //     para.textContent = 'It is nice and sunny outside today. Wear shorts! Go to the beach, or the park, and get an ice cream.';
    // } else if (choice === 'rainy') {
    //     para.textContent = 'Rain is falling outside; take a rain coat and an umbrella, and don\'t stay out for too long.';
    // } else if (choice === 'snowing') {
    //     para.textContent = 'The snow is coming down — it is freezing! Best to stay in with a cup of hot chocolate, or go build a snowman.';
    // } else if (choice === 'overcast') {
    //     para.textContent = 'It isn\'t raining, but the sky is grey and gloomy; it could turn any minute, so take a rain coat just in case.';
    // } else {
    //     para.textContent = '';
    // }
}
function updateColors() {
    const bodyStyle = document.body.style;
    bodyStyle.backgroundColor = currentTheme.backgroundColor;
    bodyStyle.color = currentTheme.color;
}
