const cutout = 0;


document.addEventListener("DOMContentLoaded", () => {
    const soilChart = document.getElementById('soil-chart');
    new Chart(soilChart, {
        type: 'line',
        data: {
            labels: ['22:00', '22:30', '23:00', '23:30', '00:00', '00:30'],
            datasets: [
                {
                    label: 'White Widow',
                    data: [76, 54, 43, 81, 56, 39],
                    borderWidth: 2
                },
                {
                    label: 'Cream Caramel',
                    data: [54, 43, 76, 56, 42, 81],
                    borderWidth: 2,
                },
                {
                    label: 'Amnesia',
                    data: [32, 83, 60, 41, 79, 62],
                    borderWidth: 2,
                },
            ]
        },
        options: {
            scales: {
                y: {
                    min: 0,
                    max: 100,
                }
            }
        }
    });

    const powerChart = document.getElementById('power-chart');
    new Chart(powerChart, {
        type: 'bar',
        data: {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
            datasets: [
                {
                    label: 'Consumo',
                    data: [420, 425, 419, 437, 420, 415],
                }
            ]
        },
        options: {
            scales: {
                y: {
                    min: 0,
                    max: 600,
                }
            }
        }
    });

    const tempChart = document.getElementById('temp-chart');
    new Chart(tempChart, {
        type: 'line',
        data: {
            labels: ['22:00', '22:30', '23:00', '23:30', '00:00', '00:30'],
            datasets: [
                {
                    label: 'Humedad',
                    data: [52, 43, 54, 56, 42, 48],
                    borderWidth: 2,
                },
                {
                    label: 'Temperatura',
                    data: [24, 23, 25, 26, 28, 25],
                    borderWidth: 2
                },
            ]
        },
        options: {
            scales: {
                y: {
                    min: 0,
                    max: 100,
                }
            }
        }
    });
    
    const tempDonut = document.getElementById('temp-donut');
    new Chart(tempDonut, {
        type: 'doughnut',
        data: {
            labels: {
                display: false
            },
            datasets: [
                {
                    label: 'Temperatura',
                    data: [26, 14],
                    backgroundColor: [
                        "#FF6384",
                        "#202020"
                    ],
                    hoverBackgroundColor: [
                        "#36A2EB",
                        "#202020"
                    ]
                }
            ]
        },
        options: {
            borderWidth: 0,
            cutout: cutout
        }
    });
    
    const humDonut = document.getElementById('hum-donut');
    new Chart(humDonut, {
        type: 'doughnut',
        data: {
            labels: {
                display: false
            },
            datasets: [
                {
                    label: 'Humedad',
                    data: [54, 36],
                    backgroundColor: [
                        "#36A2EB",
                        "#202020"
                    ],
                    hoverBackgroundColor: [
                        "#FF6384",
                        "#202020"
                    ]
                }
            ]
        },
        options: {
            borderWidth: 0,
            cutout: cutout
        }
    });
    
    const powerDonut = document.getElementById('power-donut');
    new Chart(powerDonut, {
        type: 'doughnut',
        data: {
            labels: {
                display: false
            },
            datasets: [
                {
                    label: 'Consumo',
                    data: [40, 60],
                    backgroundColor: [
                        "#FFCE56",
                        "#202020"
                    ],
                    hoverBackgroundColor: [
                        "#FF6384",
                        "#202020"
                    ]
                }
            ]
        },
        options: {
            borderWidth: 0,
            cutout: cutout
        }
    });
    
    const lightDonut = document.getElementById('light-donut');
    new Chart(lightDonut, {
        type: 'doughnut',
        data: {
            labels: {
                display: false
            },
            datasets: [
                {
                    label: 'Luz',
                    data: [30, 60],
                    backgroundColor: [
                        "#4f4f4f",
                        "#202020"
                    ],
                    hoverBackgroundColor: [
                        "#FF6384",
                        "#202020"
                    ]
                }
            ]
        },
        options: {
            borderWidth: 0,
            cutout: cutout
        }
    });
})
