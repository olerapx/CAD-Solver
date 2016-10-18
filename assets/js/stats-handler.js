Chart.defaults.global.legend.position = 'right'

var psc = $('#popularSelfChart');

var pscChart = new Chart(psc, {
    type: 'doughnut',
    data: {
        labels: ["Коммивояжер", "Упаковка", "Клика"],
        datasets: [{
            label: '% использований',
            data: [75, 12, 13],
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
        }]
    }
});

var pea = $('#popularEveryoneAllChart');

var peaChart = new Chart(pea, {
    type: 'doughnut',
    data: {
        labels: ["Коммивояжер", "Упаковка", "Клика"],
        datasets: [{
            label: '% использований',
            data: [41, 54, 5],
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
        }]
    }
});

var pew = $('#popularEveryoneWeekChart');

var pewChart = new Chart(pew, {
    type: 'doughnut',
    data: {
        labels: ["Коммивояжер", "Упаковка", "Клика"],
        datasets: [{
            label: '% использований',
            data: [35, 38, 27],
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
        }]
    }
});

var vc = $('#visitorsChart');

var vcChart = new Chart(vc, {
    type: 'line',
    data: {
        labels: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
        datasets: [{
            label: 'Уникальных посетителей',
            fill: true,
            data: [0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 10, 15],
            backgroundColor: 'rgba(75,192,192,1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
          xAxes: [{
            gridLines: {
              drawOnChartArea: false
            }
          }]
        }
    }
});