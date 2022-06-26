import { Chart, registerables } from "chart.js";

function plot_heart_rate() {

}



export function initialise_heart_rate() {
    Chart.register(...registerables);
    plot_heart_rate();
}